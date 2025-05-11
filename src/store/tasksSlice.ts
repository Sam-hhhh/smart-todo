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
      action: PayloadAction<{ taskId: number; details: Partial<Task> }>
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        Object.assign(task, action.payload.details);
        saveTasksToLocalStorage(state.tasks);
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
    },
  },
});

export const {
  addTask,
  toggleTaskCompletion,
  removeTask,
  updateTaskDetails,
  updateTaskCategory,
} = tasksSlice.actions;

export default tasksSlice.reducer;
