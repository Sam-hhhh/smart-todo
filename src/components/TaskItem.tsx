import React, { useState } from "react";
import type { Task } from "../types/task.ts";
import { useDispatch } from "react-redux";
import { toggleTaskCompletion } from "../store/tasksSlice";
import TaskContextMenu from "./TaskContextMenu";
import "../styles/TaskItem.scss";

interface Props {
  task: Task;
  onClick: () => void;
}

const TaskItem: React.FC<Props> = ({ task, onClick }) => {
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发onClick
    dispatch(toggleTaskCompletion(task.id));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div 
        className={`task-item ${task.completed ? 'completed' : ''}`} 
        onClick={onClick}
        onContextMenu={handleContextMenu}
      >
        <div className="task-item-left">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {}} // 空函数，因为我们使用onClick处理
            onClick={handleCheckboxClick}
          />
          <span>{task.text}</span>
        </div>
      </div>

      {contextMenu && (
        <TaskContextMenu
          taskId={task.id}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};

export default TaskItem;
