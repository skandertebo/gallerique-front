import { NotificationSchema } from "../../api/notification/schemas/notification.schema";
import NotificationItem from "./notificationItem";

interface NotificationListProps {
  notifications: NotificationSchema[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <div className="bg-white border-4  border-palette-3 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      )}
    </div>
  );
};

export default NotificationList;
