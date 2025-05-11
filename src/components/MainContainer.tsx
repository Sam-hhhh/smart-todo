import { useState } from "react";
import CategoryList from "./CategoryList";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import AddTask from "./AddTask";
import "../styles/MainContainer.scss";

const MainContainer = ({
  filter,
}: {
  filter: "all" | "recent" | "completed";
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <div className="main-container">
      <div className="category-container">
        <CategoryList />
      </div>
      <div className="task-list-container">
        <AddTask />
        <TaskList filter={filter} onTaskSelect={setSelectedTaskId} />
      </div>
      <div className="task-detail-container">
        <TaskDetail selectedTaskId={selectedTaskId} />
      </div>
    </div>
  );
};

export default MainContainer;
