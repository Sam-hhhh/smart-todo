export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;        // 截止日期
  reminderTime?: string;   // 提醒时间
  description?: string;    // 描述
  notes?: string;         // 备注
  categoryId?: number;    // 分类ID
}
