import React, { useEffect, useState } from 'react';
import '../styles/NotificationPermission.scss';

const NotificationPermission: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // 检查是否支持通知
        if (!('Notification' in window)) {
          console.log('浏览器不支持通知功能');
          return;
        }

        // 检查通知权限状态
        const permission = Notification.permission;
        console.log('当前通知权限状态:', permission);
        
        // 如果权限是默认或拒绝状态，都显示提示
        if (permission === 'default' || permission === 'denied') {
          setShowNotification(true);
        }
      } catch (error) {
        console.error('检查通知权限时出错:', error);
      }
    };

    checkPermission();
  }, []);

  const handleClose = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div className="notification-permission">
      <div className="notification-content">
        <p>通知权限已被拒绝，请在浏览器设置中允许通知</p>
        <p>开启麦克风权限，以便使用语音输入功能</p>
        <button onClick={handleClose} className="close-button">
          我知道了
        </button>
      </div>
    </div>
  );
};

export default NotificationPermission; 