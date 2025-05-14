import type { Task } from "../types/task";

class ReminderService {
  private static instance: ReminderService;
  private reminderTimeouts: Map<number, NodeJS.Timeout[]> = new Map();

  private constructor() {
    // 在构造函数中检查通知权限
    this.checkNotificationPermission();
  }

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  // 检查通知权限
  private async checkNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("您的浏览器不支持桌面通知功能");
      return;
    }

    if (Notification.permission === "default") {
      console.log("正在请求通知权限...");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("通知权限已授予");
      } else {
        console.log("通知权限被拒绝，您将无法收到提醒通知");
      }
    } else if (Notification.permission === "denied") {
      console.log("通知权限已被拒绝，请在浏览器设置中允许通知");
    }
  }

  // 设置提醒
  setReminder(task: Task) {
    if (!task.dueDate || !task.reminderTime) {
      console.log('设置提醒失败：缺少截止日期或提醒时间', task);
      return;
    }

    // 清除已存在的提醒
    this.clearReminder(task.id);

    const dueDate = new Date(task.dueDate);
    const [hours, minutes] = task.reminderTime.split(':').map(Number);

    const now = new Date();
    const currentReminderTimeouts: NodeJS.Timeout[] = [];

    // --- 原有提醒逻辑：截止日期前一天 ---
    const reminderDateTimePreDay = new Date(dueDate);
    reminderDateTimePreDay.setDate(dueDate.getDate() - 1); // 设置为截止日期前一天
    reminderDateTimePreDay.setHours(hours);
    reminderDateTimePreDay.setMinutes(minutes);
    reminderDateTimePreDay.setSeconds(0);
    reminderDateTimePreDay.setMilliseconds(0);

    const timeUntilReminderPreDay = reminderDateTimePreDay.getTime() - now.getTime();

    console.log('原有提醒设置信息：', {
      taskText: task.text,
      dueDate: dueDate.toLocaleString(),
      reminderTime: task.reminderTime,
      reminderDateTime: reminderDateTimePreDay.toLocaleString(),
      timeUntilReminder: Math.floor(timeUntilReminderPreDay / 1000) + '秒'
    });

    if (timeUntilReminderPreDay > 0) {
      const timeoutPreDay = setTimeout(async () => {
        console.log('触发原有提醒（前一天）：', task.text);
        await this.showNotification(task, `"${task.text}" 将在明天到期`);
      }, timeUntilReminderPreDay);
      currentReminderTimeouts.push(timeoutPreDay);
      console.log('原有提醒（前一天）设置成功');
    } else {
      console.log('原有提醒（前一天）时间已过，不设置提醒');
    }

    // --- 新增提醒逻辑：截止日期当天，提前一小时 ---
    const reminderDateTimeOnDueDate = new Date(dueDate);
    reminderDateTimeOnDueDate.setHours(hours);
    reminderDateTimeOnDueDate.setMinutes(minutes);
    reminderDateTimeOnDueDate.setSeconds(0);
    reminderDateTimeOnDueDate.setMilliseconds(0);

    // 计算提前一小时的时间点
    const reminderDateTimeOneHourBefore = new Date(reminderDateTimeOnDueDate.getTime() - 60 * 60 * 1000); // 减去一小时

    const timeUntilReminderOneHourBefore = reminderDateTimeOneHourBefore.getTime() - now.getTime();

    console.log('新增提醒设置信息（截止日当天提前一小时）：', {
      taskText: task.text,
      dueDate: dueDate.toLocaleString(),
      originalReminderTime: task.reminderTime,
      actualReminderTime: reminderDateTimeOneHourBefore.toLocaleString(),
      timeUntilReminder: Math.floor(timeUntilReminderOneHourBefore / 1000) + '秒'
    });
    
    // 确保这个提醒时间点是在截止日当天
    const isSameDayAsDueDate = reminderDateTimeOneHourBefore.getFullYear() === dueDate.getFullYear() &&
                             reminderDateTimeOneHourBefore.getMonth() === dueDate.getMonth() &&
                             reminderDateTimeOneHourBefore.getDate() === dueDate.getDate();

    if (timeUntilReminderOneHourBefore > 0 && isSameDayAsDueDate) {
      const timeoutOneHourBefore = setTimeout(async () => {
        console.log('触发新增提醒（截止日当天提前一小时）：', task.text);
        await this.showNotification(task, `"${task.text}" 将在一小时后到期`);
      }, timeUntilReminderOneHourBefore);
      currentReminderTimeouts.push(timeoutOneHourBefore);
      console.log('新增提醒（截止日当天提前一小时）设置成功');
    } else {
      if (!isSameDayAsDueDate) {
        console.log('新增提醒（截止日当天提前一小时）不在截止日当天，不设置提醒');
      } else {
        console.log('新增提醒（截止日当天提前一小时）时间已过，不设置提醒');
      }
    }

    // 如果有设置任何提醒，则存入 map
    if (currentReminderTimeouts.length > 0) {
      this.reminderTimeouts.set(task.id, currentReminderTimeouts);
    }
  }

  // 清除提醒
  clearReminder(taskId: number) {
    const timeouts = this.reminderTimeouts.get(taskId);
    if (timeouts && timeouts.length > 0) {
      timeouts.forEach(timeout => clearTimeout(timeout));
      this.reminderTimeouts.delete(taskId);
      console.log('已清除提醒：', taskId);
    }
  }

  // 显示通知
  private async showNotification(task: Task, bodyMessage: string) {
    if (!("Notification" in window)) {
      console.log("您的浏览器不支持桌面通知功能");
      return;
    }

    try {
      // 如果权限是默认状态，先请求权限
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("通知权限被拒绝，无法显示通知");
          return;
        }
      }

      // 如果权限被拒绝，提示用户
      if (Notification.permission === "denied") {
        console.log("通知权限已被拒绝，请在浏览器设置中允许通知");
        return;
      }

      // 创建并显示通知
      const notification = new Notification("待办提醒", {
        body: bodyMessage,
        icon: '/src/assets/logo.svg',
        requireInteraction: true, // 通知不会自动关闭
        tag: `task-${task.id}-${Date.now()}`
      });

      // 添加通知点击事件
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log("通知已发送");
    } catch (error) {
      console.error("显示通知时出错：", error);
    }
  }

  // 初始化所有提醒
  initializeReminders(tasks: Task[]) {
    console.log('初始化所有提醒，任务数量：', tasks.length);
    // 先清除所有旧的提醒，避免重复
    this.reminderTimeouts.forEach(timeouts => {
        timeouts.forEach(timeout => clearTimeout(timeout));
    });
    this.reminderTimeouts.clear();
    
    tasks.forEach(task => {
      if (task.dueDate && task.reminderTime) {
        this.setReminder(task);
      }
    });
  }
}

export const reminderService = ReminderService.getInstance(); 