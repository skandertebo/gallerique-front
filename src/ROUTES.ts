import { RouteObject } from "react-router-dom";
import AuthenticatedContainer from "./containers/AuthenticatedContainer";
import AuthPage from "./pages/auth-page";
import LoginForm from "./pages/auth-page/forms/loginForm";
import RegisterForm from "./pages/auth-page/forms/registerForm";
import HomePage from "./pages/home-page";
import LandingPage from "./pages/landing-page";

const ROUTES: RouteObject[] = [
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
    children: [
      {
        path: "login",
        Component: LoginForm,
      },
      {
        path: "register",
        Component: RegisterForm,
      },
    ],
  },
  {
    path: "/",
    Component: AuthenticatedContainer,
    children: [{ path: "home", Component: HomePage }],
  },
];

export default ROUTES;
