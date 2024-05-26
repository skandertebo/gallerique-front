import { createContext, useContext, useEffect, useState } from "react";
import { NotificationSchema } from "../api/notification/schemas/notification.schema";
import { useQuery } from "@apollo/client";
import NOTIFICATION_QUERIES from "../api/notification/notifications.queries";
import { useAuth } from "./auth.context";
import { apiDomain, apiProtocol } from "../constants";
import { EventSourcePolyfill } from "event-source-polyfill";

export type NotificationsContextProps = {
  notificationsLoading: boolean;
  notifications: NotificationSchema[];
  setRead: (val: boolean) => void;
  read: boolean;
};

const NotificationContext = createContext<NotificationsContextProps | null>(
  null
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<NotificationSchema[]>([]);
  const [read, setRead] = useState<boolean>(true);

  // Function to fetch initial notifications
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
  } = useQuery<{
    notificationsOfUser: NotificationSchema[];
  }>(NOTIFICATION_QUERIES.GET_NOTIFICATIONS, { skip: !accessToken });

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.notificationsOfUser);
    }
    if (notificationsError) {
      throw new Error("Failed to fetch notifications");
    }
  }, [notificationsData, notificationsError, notificationsLoading]);

  useEffect(() => {
    if (!accessToken) return;

    // Set up the EventSource with headers
    const eventSourceInitDict = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const es = new EventSourcePolyfill(
      `${apiProtocol}://${apiDomain}/notifications/listen`,
      eventSourceInitDict
    );

    es.onmessage = function (event) {
      if (event.data) {
        const data = JSON.parse(event.data);
        const notification: NotificationSchema = {
          ...data,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
        setRead(false);
      }
    };

    es.onerror = function (error) {
      throw new Error(error);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notificationsLoading, notifications, setRead, read }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
