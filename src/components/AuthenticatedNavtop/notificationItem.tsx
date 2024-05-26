import React from "react";

interface NotificationItemProps {
  notification: {
    title: string;
    content: string;
    createdAt: string;
  };
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-300">
      <h4 className="text-lg font-semibold text-palette-5">
        {notification.title}
      </h4>
      <p className="text-sm text-gray-600">{notification.content}</p>
      <p className="text-xs text-gray-500">
        {formatDate(notification.createdAt)}
      </p>
    </div>
  );
};

export default NotificationItem;
