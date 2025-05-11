import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updateTaskDetails } from "../store/tasksSlice";
import type { Task } from "../types/task";
import "../styles/TaskDetail.scss";

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

  const handleSave = () => {
    console.log("保存按钮被点击");
    console.log("当前选中的待办ID:", selectedTaskId);
    console.log("当前待办列表:", tasks);
    
    if (selectedTaskId === null) {
      console.warn("没有选中的待办");
      return;
    }

    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) {
      console.warn("未找到要更新的待办");
      return;
    }

    console.log("保存前的待办:", task);
    console.log("要更新的详情:", taskDetails);
    
    const updatedTask: Task = {
      ...task,
      ...taskDetails,
      id: selectedTaskId,
    };
    
    console.log("更新后的待办:", updatedTask);
    console.log("准备分发更新动作");
    
    try {
      dispatch(updateTaskDetails({ id: selectedTaskId, updatedTask }));
      console.log("更新动作已分发");
    } catch (error) {
      console.error("更新待办时发生错误:", error);
    }
  };

  const handleInputChange = (field: keyof Task, value: string | boolean) => {
    console.log(`更新字段 ${field}:`, value);
    setTaskDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const task = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="task-detail">
      {selectedTaskId !== null ? (
        <div className="task-detail-form">
          <h2 className="task-title">{task?.text}</h2>
          
          <div className="form-group">
            <label>截止日期</label>
            <input
              type="date"
              value={taskDetails.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>提醒时间</label>
            <input
              type="time"
              value={taskDetails.reminderTime}
              onChange={(e) => handleInputChange("reminderTime", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              value={taskDetails.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="请输入待办描述"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>备注</label>
            <textarea
              value={taskDetails.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="请输入备注信息"
              rows={3}
            />
          </div>

          <button 
            className="save-button" 
            onClick={handleSave}
            type="button"
          >
            保存
          </button>
        </div>
      ) : (
        <p>请点击一个待办查看详情</p>
      )}
    </div>
  );
};

export default TaskDetail;
