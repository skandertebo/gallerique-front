import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import { apiDomain, wsProtocol } from "../constants";
import { useAuth } from "./auth.context";

export interface WebsocketEmittedMessage {
  scope: string;
  payload: any;
  requestId?: string;
}

export interface WebsocketObservableContext {
  observable: Subject<any>;
  send: (data: WebsocketEmittedMessage) => void;
}

const websocketObservableContext =
  createContext<WebsocketObservableContext | null>(null);

export const useWebsocketObservable = () => {
  const context = useContext(websocketObservableContext);
  if (!context) {
    throw new Error(
      "useWebsocketObservable must be used within WebsocketObservableProvider"
    );
  }
  return context;
};

export const WebsocketObservableProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { accessToken } = useAuth();
  const observable = useRef(new Subject<any>());
  const socket = useMemo(
    () =>
      io(`${wsProtocol}://${apiDomain}/websocket`, {
        extraHeaders: {
          Authorization: `${accessToken}`,
        },
      }),
    [accessToken]
  );
  const send = (data: WebsocketEmittedMessage) => {
    socket.emit(data.scope, {
      ...data.payload,
      requestId: data.requestId,
    });
  };

  useEffect(() => {
    if (socket) {
      socket.onAny((_, data) => {
        observable.current.next(data);
      });
    }
  }, [accessToken, socket]);

  return (
    <websocketObservableContext.Provider
      value={{ observable: observable.current, send }}
    >
      {children}
    </websocketObservableContext.Provider>
  );
};
