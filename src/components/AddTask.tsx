import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import VoiceInput from "./VoiceInput";
import "../styles/addTask.scss";

const AddTask = () => {
  const [taskText, setTaskText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  // 中文数字到阿拉伯数字的映射
  const chineseToArabic: { [key: string]: string } = {
    '零': '0', '一': '1', '二': '2', '三': '3', '四': '4',
    '五': '5', '六': '6', '七': '7', '八': '8', '九': '9',
    '十': '10', '两': '2'
  };

  // 将中文数字转换为阿拉伯数字
  const convertChineseToArabic = (chinese: string): string => {
    // 如果已经是阿拉伯数字，直接返回
    if (/^\d+$/.test(chinese)) {
      return chinese;
    }

    // 处理"十"的特殊情况
    if (chinese === '十') {
      return '10';
    }

    // 处理"十几"的情况
    if (chinese.startsWith('十')) {
      return '1' + chineseToArabic[chinese[1]];
    }

    // 处理"几十"的情况
    if (chinese.endsWith('十')) {
      return chineseToArabic[chinese[0]] + '0';
    }

    // 处理"几十几"的情况
    if (chinese.includes('十')) {
      const parts = chinese.split('十');
      return chineseToArabic[parts[0]] + chineseToArabic[parts[1]];
    }

    // 处理单个中文数字
    return chineseToArabic[chinese] || chinese;
  };

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
