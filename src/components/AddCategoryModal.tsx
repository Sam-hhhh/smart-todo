import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../store/categoriesSlice";
import "../styles/AddCategoryModal.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      dispatch(addCategory(categoryName.trim()));
      setCategoryName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>添加新分类</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="请输入分类名称"
              autoFocus
            />
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              取消
            </button>
            <button type="submit" className="submit-button">
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal; 