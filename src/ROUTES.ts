import { RouteObject } from "react-router-dom";
import LandingPage from "./pages/landing-page";

const ROUTES: RouteObject[] = [
  {
    path: "/",
    Component: LandingPage,
  },
];

export default ROUTES;
