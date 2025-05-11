import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../types/task";

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
};

const saveTasksToLocalStorage = (tasks: Task[]) => {
  try {
    console.log("保存到 localStorage:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(
      state,
      action: PayloadAction<{
        text: string;
        completed: boolean;
        dueDate?: string;
        reminderTime?: string;
        description?: string;
        notes?: string;
      }>
    ) {
      const newTask: Task = {
        id: Date.now(),
        text: action.payload.text,
        completed: action.payload.completed,
        createdAt: new Date().toISOString(),
        dueDate: action.payload.dueDate,
        reminderTime: action.payload.reminderTime,
        description: action.payload.description,
        notes: action.payload.notes,
      };
      state.tasks.push(newTask);
      saveTasksToLocalStorage(state.tasks);
    },
    toggleTaskCompletion(state, action: PayloadAction<number>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToLocalStorage(state.tasks);
      }
    },
    removeTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks);
    },
    updateTaskDetails(
      state,
      action: PayloadAction<{ id: number; updatedTask: Task }>
    ) {
      console.log("=== 开始更新待办 ===");
      console.log("当前状态:", state.tasks);
      console.log("Action payload:", action.payload);
      
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      
      if (index === -1) {
        console.warn("未找到要更新的待办:", action.payload.id);
        return;
      }

      console.log("找到待办索引:", index);
      console.log("原始待办:", state.tasks[index]);
      
      // 保留原始待办的创建时间
      const createdAt = state.tasks[index].createdAt;
      
      // 更新待办
      state.tasks[index] = {
        ...action.payload.updatedTask,
        createdAt, // 确保保留原始创建时间
      };
      
      console.log("更新后的待办:", state.tasks[index]);
      console.log("更新后的状态:", state.tasks);
      
      try {
        saveTasksToLocalStorage(state.tasks);
        console.log("=== 待办更新完成 ===");
      } catch (error) {
        console.error("保存到 localStorage 失败:", error);
      }
    },
    updateTaskCategory(
      state,
      action: PayloadAction<{ taskId: number; categoryId: number }>
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.categoryId = action.payload.categoryId;
        saveTasksToLocalStorage(state.tasks);
      }
    }
  },
});

export const { 
  addTask, 
  toggleTaskCompletion, 
  removeTask, 
  updateTaskDetails,
  updateTaskCategory 
} = tasksSlice.actions;

export default tasksSlice.reducer;
