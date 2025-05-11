import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import categoriesReducer from "./categoriesSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 添加开发环境下的调试
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    console.log('Store updated:', store.getState());
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
