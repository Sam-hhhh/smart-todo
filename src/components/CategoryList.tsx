import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import AddCategoryModal from "./AddCategoryModal";
import CategoryContextMenu from "./CategoryContextMenu";
import "../styles/CategoryList.scss";

const CategoryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const location = useLocation();
  const [contextMenu, setContextMenu] = useState<{
    categoryId: number;
    categoryName: string;
    x: number;
    y: number;
  } | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleContextMenu = (e: React.MouseEvent, categoryId: number, categoryName: string) => {
    e.preventDefault();
    setContextMenu({
      categoryId,
      categoryName,
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div className="category-list">
      <h3>分类</h3>
      <ul className="default-categories">
        <li>
          <Link to="/all" className={isActive("/all") ? "active" : ""}>
            所有待办
          </Link>
        </li>
        <li>
          <Link to="/recent" className={isActive("/recent") ? "active" : ""}>
            最近待办
          </Link>
        </li>
        <li>
          <Link to="/completed" className={isActive("/completed") ? "active" : ""}>
            已完成
          </Link>
        </li>
      </ul>

      {categories.length > 0 && (
        <>
          <h3>自定义分类</h3>
          <ul className="custom-categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  to={`/category/${category.id}`}
                  className={isActive(`/category/${category.id}`) ? "active" : ""}
                  onContextMenu={(e) => handleContextMenu(e, category.id, category.name)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <button className="add-category-button" onClick={() => setIsModalOpen(true)}>
        + 添加分类
      </button>

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {contextMenu && (
        <CategoryContextMenu
          categoryId={contextMenu.categoryId}
          categoryName={contextMenu.categoryName}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default CategoryList;
