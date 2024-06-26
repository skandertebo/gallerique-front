import { ApolloProvider } from "@apollo/client";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ROUTES from "./ROUTES.ts";
import { client } from "./api/apiInstance.ts";
import { AuthProvider } from "./context/auth.context.tsx";
import { WebsocketObservableProvider } from "./context/websocketObservable.context.tsx";
import "./index.css";
import { NotificationProvider } from "./context/notifications.context.tsx";

const router = createBrowserRouter(ROUTES);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <NotificationProvider>
          <WebsocketObservableProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </WebsocketObservableProvider>
        </NotificationProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
