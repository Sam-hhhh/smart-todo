import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import "../styles/addTask.scss";

const AddTask = () => {
  const [taskText, setTaskText] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 用来判断是否点击了输入框
  const dispatch = useDispatch();

  // 处理回车提交待办
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskText.trim()) {
      dispatch(addTask({ text: taskText, completed: false }));
      setTaskText(""); // 清空输入框
      setIsEditing(false); // 退出编辑模式
    }
  };

  return (
    <div className="add-task">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onClick={() => setIsEditing(true)} // 点击时进入编辑状态
        onKeyDown={handleKeyPress} // 监听回车键
        placeholder={isEditing ? "输入内容后，回车创建成功" : "+ 点击新建待办"}
      />
    </div>
  );
};

export default AddTask;
