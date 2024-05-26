import { createContext, useContext, useEffect, useState } from "react";
import { NotificationSchema } from "../api/notification/schemas/notification.schema";
import { useQuery } from "@apollo/client";
import NOTIFICATION_QUERIES from "../api/notification/notifications.queries";
import { useAuth } from "./auth.context";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { apiDomain, apiProtocol } from "../constants";

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
  const [read, setRead] = useState<boolean>(false);
  useState<boolean>(false);
  // Function to fetch initial notifications
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
  } = useQuery<{
    getNotifications: NotificationSchema[];
  }>(NOTIFICATION_QUERIES.GET_NOTIFICATIONS, { skip: !accessToken });

  // SSE setup to listen for new notifications
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.getNotifications);
    }
    if (notificationsError) {
      throw new Error("Failed to fetch notifications");
    }
  }, [notificationsData, notificationsError, notificationsLoading]);
  useEffect(() => {}, [notifications]);
  useEffect(() => {
    if (!accessToken) return;
    async function listen() {
      await fetchEventSource(
        `${apiProtocol}://${apiDomain}/notifications/listen`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          onmessage(event) {
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
            }
          },
          onerror(error) {
            throw new Error(error);
          },
        }
      );
    }
    listen();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notificationsLoading, notifications, setRead, read }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
