import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updateTaskDetails } from "../store/tasksSlice";
import { reminderService } from "../services/reminderService";
import type { Task } from "../types/task";
import "../styles/taskDetail.scss";

const TaskDetail = ({ selectedTaskId }: { selectedTaskId: number | null }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({
    completed: false,
    dueDate: "",
    reminderTime: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    const task = tasks.find((task) => task.id === selectedTaskId);
    if (task) {
      console.log("找到待办:", task);
      setTaskDetails({
        completed: task.completed,
        dueDate: task.dueDate || "",
        reminderTime: task.reminderTime || "",
        description: task.description || "",
        notes: task.notes || "",
      });
    }
  }, [selectedTaskId, tasks]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (selectedTaskId) {
      dispatch(updateTaskDetails({ taskId: selectedTaskId, details: taskDetails }));
      
      // 更新提醒
      const updatedTask = tasks.find(task => task.id === selectedTaskId);
      if (updatedTask) {
        reminderService.setReminder({
          ...updatedTask,
          ...taskDetails
        });
      }
    }
  };

  if (!selectedTaskId) {
    return <div className="task-detail">请选择一个待办事项</div>;
  }

  return (
    <div className="task-detail">
      <h2>待办详情</h2>
      <div className="detail-form">
        <div className="form-group">
          <label>截止日期：</label>
          <input
            type="date"
            name="dueDate"
            value={taskDetails.dueDate}
            onChange={handleInputChange}
            onBlur={handleSave}
          />
        </div>
        <div className="form-group">
          <label>提醒时间：</label>
          <input
            type="time"
            name="reminderTime"
            value={taskDetails.reminderTime}
            onChange={handleInputChange}
            onBlur={handleSave}
          />
        </div>
        <div className="form-group">
          <label>描述：</label>
          <textarea
            name="description"
            value={taskDetails.description}
            onChange={handleInputChange}
            onBlur={handleSave}
          />
        </div>
        <div className="form-group">
          <label>备注：</label>
          <textarea
            name="notes"
            value={taskDetails.notes}
            onChange={handleInputChange}
            onBlur={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
