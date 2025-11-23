import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ToastNotification = ({ 
  notifications, 
  onDismiss, 
  onNotificationClick 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => 
      prev?.filter(notification => notification?.id !== notificationId)
    );
    setTimeout(() => {
      onDismiss(notificationId);
    }, 300);
  };

  const handleClick = (notification) => {
    onNotificationClick?.(notification);
    handleDismiss(notification?.id);
  };

  if (visibleNotifications?.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications?.map((notification) => (
        <div
          key={notification?.id}
          className="toast-enter toast-enter-active bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleClick(notification)}
        >
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0">
              <Image
                src={notification?.avatar}
                alt={notification?.avatarAlt}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {notification?.senderName}
                </h4>
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleDismiss(notification?.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 truncate mt-1">
                {notification?.type === 'image' ? (
                  <span className="flex items-center">
                    <Icon name="Image" size={14} className="mr-1" />
                    Photo
                  </span>
                ) : (
                  notification?.message
                )}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp)?.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;