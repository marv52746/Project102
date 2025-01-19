import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";
import Dashboard from "../pages/private/Dashboard";
import List from "../pages/private/List";
import Form from "../pages/private/Form";
import OrganizationChart from "../pages/private/OrganizationChart";
import Calendar2 from "../pages/private/Calendar/Calendar2";
import Login from "../pages/main/login";
import SignUp from "../pages/main/signup";

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
    element: <Calendar2 />,
  },
  {
    path: routes.testPage,
    name: "testPage",
    element: <Calendar2 />,
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
