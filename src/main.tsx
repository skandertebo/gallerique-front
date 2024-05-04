import { ApolloProvider } from "@apollo/client";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import ROUTES from "./ROUTES.ts";
import { client } from "./api/apiInstance.ts";
import { AuthProvider } from "./context/auth.context.tsx";
import "./index.css";

const router = createBrowserRouter(ROUTES);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
