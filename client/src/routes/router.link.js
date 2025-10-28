import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";
import List from "../pages/private/List";
import Form from "../pages/private/Form";
import OrganizationChart from "../pages/private/OrganizationChart";
import Login from "../pages/main/login";
import SignUp from "../pages/main/signup";
import Portal from "../pages/public/Portal";
import SettingsPage from "../pages/private/Settings/Settings";
import Calendar from "../pages/private/Calendar/Calendar";
import InventoryDashboard from "../pages/private/Dashboard/InventoryDashboard";
import MainDashboard from "../pages/private/Dashboard/MainDashboard";
import ForcePasswordChange from "../pages/main/forcePasswordChange";
import ForgotPassword from "../pages/main/forgotPassword";
import HelpPage from "../core/components/help/HelpPage";

const routes = all_routes;

export const publicRoutesArray = [
  {
    path: routes.home,
    name: "home",
    element: <Home />,
  },
  {
    path: routes.login,
    name: "login",
    element: <Login />,
  },
  {
    path: routes.forcePasswordChange,
    name: "login-new",
    element: <ForcePasswordChange />,
  },
  {
    path: routes.forgotPassword,
    name: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: routes.signup,
    name: "signup",
    element: <SignUp />,
  },

  {
    path: routes.create_appointment,
    name: "create_appointment",
    element: <Portal />,
  },
];

const routesArray = [
  {
    path: routes.dashboard,
    name: "dashboard",
    element: <MainDashboard />,
  },

  { path: routes.list, name: "list", element: <List /> },
  { path: routes.form, name: "form", element: <Form /> },
  {
    path: routes.orgChart,
    name: "organizational-structure-diagram",
    element: <OrganizationChart />,
  },
  {
    path: routes.calendar,
    name: "calendar",
    element: <Calendar />,
  },
  {
    path: routes.settings,
    name: "settings",
    element: <SettingsPage />,
  },
  {
    path: routes.portal,
    name: "portal",
    element: <Portal />,
  },
  {
    path: routes.help,
    name: "help",
    element: <HelpPage />,
  },
  {
    path: routes.testPage,
    name: "testPage",
    element: <InventoryDashboard />,
  },
];

export const authRoute = routesArray.map((route, index) => ({
  id: index + 1, // Dynamic ID based on index
  path: route.path,
  name: route.name,
  element: route.element,
  route: Route,
}));

export const publicRoutes = publicRoutesArray.map((route, index) => ({
  id: index + 1, // Dynamic ID based on index
  path: route.path,
  name: route.name,
  element: route.element,
  route: Route,
}));
