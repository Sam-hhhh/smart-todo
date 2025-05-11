import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { removeTask, updateTaskCategory, updateTaskDetails } from "../store/tasksSlice";
import "../styles/TaskContextMenu.scss";

interface Props {
  taskId: number;
  x: number;
  y: number;
  onClose: () => void;
}

const TaskContextMenu: React.FC<Props> = ({ taskId, x, y, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const task = useSelector((state: RootState) => 
    state.tasks.tasks.find(t => t.id === taskId)
  );
  const [isRenaming, setIsRenaming] = useState(false);
  const [newText, setNewText] = useState(task?.text || "");

  const handleDelete = () => {
    dispatch(removeTask(taskId));
    onClose();
  };

  const handleCategorySelect = (categoryId: number) => {
    dispatch(updateTaskCategory({ taskId, categoryId }));
    onClose();
  };

  const handleRename = () => {
    if (task && newText.trim() && newText !== task.text) {
      dispatch(updateTaskDetails({
        id: taskId,
        updatedTask: { ...task, text: newText.trim() }
      }));
    }
    setIsRenaming(false);
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="context-menu-overlay" onClick={handleClickOutside}>
      <div 
        className="context-menu" 
        style={{ top: y, left: x }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-section">
          {isRenaming ? (
            <div className="rename-input">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  } else if (e.key === 'Escape') {
                    setIsRenaming(false);
                    onClose();
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <div className="menu-item" onClick={() => setIsRenaming(true)}>
              重命名待办
            </div>
          )}
        </div>
        {categories.length > 0 && (
          <div className="menu-section">
            <div className="menu-title">移动到分类</div>
            {categories.map((category) => (
              <div 
                key={category.id} 
                className={`menu-item ${task?.categoryId === category.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
                {task?.categoryId === category.id && (
                  <span className="current-category-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="menu-section">
          <div className="menu-item delete" onClick={handleDelete}>
            删除待办
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskContextMenu; 