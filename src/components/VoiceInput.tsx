import React, { useState } from "react";
import "../styles/voiceInput.scss";

interface VoiceInputProps {
  onResult: (text: string, dueDate?: string, reminderTime?: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);

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

  // 处理语音识别
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      // 尝试从语音文本中提取日期和时间
      let dueDate = '';
      let reminderTime = '';

      // 处理日期
      // 匹配格式：明天、后天、下周一、下周二等
      const relativeDateMatch = transcript.match(/(明天|后天|下周一|下周二|下周三|下周四|下周五|下周六|下周日)/);
      if (relativeDateMatch) {
        const today = new Date();
        const relativeDate = relativeDateMatch[0];
        
        if (relativeDate === '明天') {
          today.setDate(today.getDate() + 1);
        } else if (relativeDate === '后天') {
          today.setDate(today.getDate() + 2);
        } else if (relativeDate.startsWith('下')) {
          const weekday = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].indexOf(relativeDate.slice(1));
          const currentWeekday = today.getDay() || 7; // 将周日的0转换为7
          const daysToAdd = (weekday + 7 - currentWeekday + 1) % 7;
          today.setDate(today.getDate() + daysToAdd);
        }
        
        dueDate = today.toISOString().split('T')[0];
      } else {
        // 匹配格式：X月X日、XXXX年X月X日
        const dateMatch = transcript.match(/(\d{1,2}月\d{1,2}日|\d{4}年\d{1,2}月\d{1,2}日)/);
        if (dateMatch) {
          const dateStr = dateMatch[0];
          if (dateStr.includes('年')) {
            const [year, month, day] = dateStr.match(/\d+/g) || [];
            dueDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            const [month, day] = dateStr.match(/\d+/g) || [];
            const year = new Date().getFullYear();
            dueDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }
      }

      // 处理时间
      // 匹配格式：上午/下午/晚上 中文数字点、中文数字点、数字:数字
      const timeMatch = transcript.match(/(上午|下午|晚上)?\s*([一二三四五六七八九十两\d]+)(点|:(\d{2}))?/);
      if (timeMatch) {
        let hour = parseInt(convertChineseToArabic(timeMatch[2]));
        const period = timeMatch[1];
        
        // 处理12小时制
        if (period === '下午' || period === '晚上') {
          if (hour < 12) {
            hour += 12;
          }
        } else if (period === '上午' && hour === 12) {
          hour = 0;
        }
        
        const minutes = timeMatch[4] || '00';
        reminderTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
      }
      
      console.log('提取的日期和时间:', { dueDate, reminderTime });
      
      // 调用回调函数，传递识别结果
      onResult(transcript, dueDate || undefined, reminderTime || undefined);
    };

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button 
      className={`voice-input-btn ${isListening ? 'listening' : ''}`}
      onClick={handleVoiceInput}
      title="语音输入"
    >
      🎤
    </button>
  );
};

export default VoiceInput; 