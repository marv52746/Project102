import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";
import Dashboard from "../pages/private/Dashboard";
import List from "../pages/private/List";
import Form from "../pages/private/Form";

const routes = all_routes;

export const publicRoutes = [
  {
    id: 1,
    path: routes.home,
    name: "home",
    element: <Home />,
    route: Route,
  },
  {
    id: 2,
    path: routes.signin,
    name: "signin",
    // element: <Signin />,
    route: Route,
  },
  {
    id: 3,
    path: routes.about,
    name: "about",
    // element: <About />,
    route: Route,
  },
  {
    id: 4,
    path: routes.contact,
    name: "contact",
    // element: <Contact />,
    route: Route,
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
