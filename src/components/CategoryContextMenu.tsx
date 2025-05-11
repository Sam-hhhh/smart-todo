import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeCategory, updateCategory } from "../store/categoriesSlice";
import "../styles/CategoryContextMenu.scss";

interface Props {
  categoryId: number;
  categoryName: string;
  x: number;
  y: number;
  onClose: () => void;
}

const CategoryContextMenu: React.FC<Props> = ({ categoryId, categoryName, x, y, onClose }) => {
  const dispatch = useDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(categoryName);

  const handleDelete = () => {
    dispatch(removeCategory(categoryId));
    onClose();
  };

  const handleRename = () => {
    if (newName.trim() && newName !== categoryName) {
      dispatch(updateCategory({ id: categoryId, name: newName.trim() }));
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
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
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
              重命名分类
            </div>
          )}
        </div>
        <div className="menu-section">
          <div className="menu-item delete" onClick={handleDelete}>
            删除分类
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContextMenu; 