import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";
import Dashboard from "../pages/private/Dashboard";
import List from "../pages/private/List";
import Form from "../pages/private/Form";
import OrganizationChart from "../pages/private/OrganizationChart";
import Login from "../pages/main/login";
import SignUp from "../pages/main/signup";
import Portal from "../pages/public/Portal";
import CalendarPage from "../pages/private/Calendar/CalendarPage";
import SettingsPage from "../pages/private/Settings/Settings";
import UserDashboardPage from "../pages/private/FormDetails/Index";

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
    path: routes.signup,
    name: "signup",
    element: <SignUp />,
  },
  {
    path: routes.portal,
    name: "portal",
    element: <Portal />,
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
    element: <Dashboard />,
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
    element: <CalendarPage />,
  },
  {
    path: routes.settings,
    name: "settings",
    element: <SettingsPage />,
  },
  {
    path: routes.testPage,
    name: "testPage",
    element: <UserDashboardPage />,
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
