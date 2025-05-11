import { useState } from "react";
import CategoryList from "./CategoryList";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import AddTask from "./AddTask";

const MainLayout = () => {
  const [filter, setFilter] = useState<"all" | "recent" | "completed">("all");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleFilterChange = (status: "all" | "recent" | "completed") => {
    setFilter(status);
  };

  return (
    <div className="main-layout">
      <CategoryList />
      <div className="task-container">
        <AddTask />
        <TaskList filter={filter} onTaskSelect={setSelectedTaskId} />
        <TaskDetail selectedTaskId={selectedTaskId} />
      </div>
    </div>
  );
};

export default MainLayout;
