import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import VoiceInput from "./VoiceInput";
import "../styles/addTask.scss";

const AddTask = () => {
  const [taskText, setTaskText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  // 处理回车提交待办
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskText.trim()) {
      dispatch(addTask({ text: taskText, completed: false }));
      setTaskText("");
      setIsEditing(false);
    }
  };

  // 处理语音识别结果
  const handleVoiceResult = (text: string, dueDate?: string, reminderTime?: string) => {
    dispatch(addTask({
      text,
      completed: false,
      dueDate,
      reminderTime
    }));
    setTaskText("");
    setIsEditing(false);
  };

  return (
    <div className="add-task">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onClick={() => setIsEditing(true)}
        onKeyDown={handleKeyPress}
        placeholder={isEditing ? "输入内容后，回车创建成功" : "+ 点击新建待办"}
      />
      <VoiceInput onResult={handleVoiceResult} />
    </div>
  );
};

export default AddTask;
