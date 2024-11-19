import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";
import Dashboard from "../pages/private/Dashboard";
import List from "../pages/private/List";
import Form from "../pages/private/Form";

const routes = all_routes;

export const publicRoutesArray = [
  {
    path: routes.home,
    name: "home",
    element: <Home />,
  },
  {
    path: routes.signin,
    name: "signin",
    // element: <Signin />,
  },
  {
    path: routes.about,
    name: "about",
    // element: <About />,
  },
  {
    path: routes.contact,
    name: "contact",
    // element: <Contact />,
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
