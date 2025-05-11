import type { Task } from "../types/task";

class ReminderService {
  private static instance: ReminderService;
  private reminderTimeouts: Map<number, NodeJS.Timeout> = new Map();

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
    
    // 解析提醒时间（格式：HH:mm）
    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    
    // 计算提醒时间（截止日期前一天的提醒时间）
    const reminderDateTime = new Date(dueDate);
    reminderDateTime.setDate(dueDate.getDate() - 1); // 设置为截止日期前一天
    reminderDateTime.setHours(hours);
    reminderDateTime.setMinutes(minutes);
    reminderDateTime.setSeconds(0);
    reminderDateTime.setMilliseconds(0);

    const now = new Date();
    const timeUntilReminder = reminderDateTime.getTime() - now.getTime();

    console.log('提醒设置信息：', {
      taskText: task.text,
      dueDate: dueDate.toLocaleString(),
      reminderTime: task.reminderTime,
      reminderDateTime: reminderDateTime.toLocaleString(),
      timeUntilReminder: Math.floor(timeUntilReminder / 1000) + '秒'
    });

    // 如果提醒时间已过，则不设置提醒
    if (timeUntilReminder <= 0) {
      console.log('提醒时间已过，不设置提醒');
      return;
    }

    // 设置提醒
    const timeout = setTimeout(async () => {
      console.log('触发提醒：', task.text);
      await this.showNotification(task);
    }, timeUntilReminder);

    this.reminderTimeouts.set(task.id, timeout);
    console.log('提醒设置成功');
  }

  // 清除提醒
  clearReminder(taskId: number) {
    const timeout = this.reminderTimeouts.get(taskId);
    if (timeout) {
      clearTimeout(timeout);
      this.reminderTimeouts.delete(taskId);
      console.log('已清除提醒：', taskId);
    }
  }

  // 显示通知
  private async showNotification(task: Task) {
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
        body: `"${task.text}" 将在明天到期`,
        icon: '/src/assets/react.svg',
        requireInteraction: true, // 通知不会自动关闭
        tag: `task-${task.id}` // 使用任务ID作为通知标签
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
    tasks.forEach(task => {
      if (task.dueDate && task.reminderTime) {
        this.setReminder(task);
      }
    });
  }
}

export const reminderService = ReminderService.getInstance(); 