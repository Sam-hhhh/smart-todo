import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../store";
import TaskItem from "./TaskItem";
import "../styles/taskList.scss";

interface Props {
  filter: "all" | "recent" | "completed";
  onTaskSelect: (taskId: number) => void;
}

const TaskList: React.FC<Props> = ({ filter, onTaskSelect }) => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tasks = useSelector((state: RootState) => {
    let filteredTasks = [...state.tasks.tasks];
    
    // 首先按分类过滤
    if (categoryId) {
      const categoryIdNum = parseInt(categoryId);
      filteredTasks = filteredTasks.filter(task => task.categoryId === categoryIdNum);
    }
    
    // 然后按状态过滤
    switch (filter) {
      case "completed":
        return filteredTasks.filter(task => task.completed);
      case "recent":
        // 过滤出未完成且有截止日期的待办
        filteredTasks = filteredTasks
          .filter(task => !task.completed && task.dueDate)
          // 按截止日期排序
          .sort((a, b) => {
            const dateA = new Date(a.dueDate!).getTime();
            const dateB = new Date(b.dueDate!).getTime();
            return dateA - dateB;
          })
          // 只取前三个
          .slice(0, 3);
        return filteredTasks;
      default:
        return filteredTasks.filter(task => !task.completed);
    }
  });

  const currentCategory = categoryId 
    ? categories.find(cat => cat.id === parseInt(categoryId))
    : null;

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">
            {currentCategory 
              ? `在"${currentCategory.name}"分类中暂无待办`
              : "暂无待办"}
          </p>
          {currentCategory && (
            <p className="empty-hint">
              右键点击待办可以将其移动到此分类
            </p>
          )}
        </div>
      ) : (
        <div className="task-list-content">
          {currentCategory && (
            <div className="category-header">
              <h3>{currentCategory.name}</h3>
              <span className="task-count">{tasks.length} 个待办</span>
            </div>
          )}
          {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={() => onTaskSelect(task.id)}
          />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
