import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import { reminderService } from "./services/reminderService";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

// 创建一个新的组件来处理需要Redux状态的部分
const AppContent = () => {
  // 使用useMemo来记忆化选择器
  const tasks = useSelector((state: RootState) => state.tasks.tasks, (prev, next) => {
    // 只有当tasks数组的长度或内容发生变化时才更新
    if (prev.length !== next.length) return false;
    return prev.every((task, index) => task.id === next[index].id);
  });

  useEffect(() => {
    // 初始化所有提醒
    reminderService.initializeReminders(tasks);
  }, [tasks]);

  return (
      <BrowserRouter>
        <h1>智能代办清单</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/all" replace />} />
          <Route path="/all" element={<MainContainer filter="all" />} />
          <Route path="/recent" element={<MainContainer filter="recent" />} />
        <Route path="/completed" element={<MainContainer filter="completed" />} />
        <Route path="/category/:categoryId" element={<MainContainer filter="all" />} />
        </Routes>
      </BrowserRouter>
  );
};

// App组件作为Provider的包装器
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
