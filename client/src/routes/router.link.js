import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import Home from "../pages/public/Home";

// import Signin from "../InitialPage/signin.jsx";
// import Home from "../modules/home/home.js";
// import About from "../modules/about/about.jsx";
// import Profile from "../modules/profile/profile.jsx";
// import Contact from "../modules/contact/contact.js";
// import OrderList from "../modules/orders/OrderList.js";
// import SalesList from "../modules/sales/SalesList.js";
// import CustomerList from "../modules/customers/CustomerList.js";
// import CustomerForm from "../modules/customers/customerForm.js";
// import ProductList from "../modules/products/ProductList.js";
// import OrderForm from "../modules/orders/OrderForm.js";
// import ProductForm from "../modules/products/ProductForm.js";
// import SigninTwo from "../InitialPage/signinTwo.js";

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
  { path: routes.dashboard, name: "home", element: <Home /> },
  //   { path: routes.dashboard, name: "home", element: <Home /> },
  //   { path: routes.profile, name: "profile", element: <Profile /> },
  //   { path: routes.customer, name: "customer", element: <CustomerList /> },
  //   {
  //     path: routes.customer_form,
  //     name: "customer_form",
  //     element: <CustomerForm />,
  //   },
  //   { path: routes.products, name: "products", element: <ProductList /> },
  //   {
  //     path: routes.products_category,
  //     name: "products_category",
  //     element: <ProductList />,
  //   },
  //   {
  //     path: routes.products_form,
  //     name: "products_form",
  //     element: <ProductForm />,
  //   },
  //   { path: routes.orders, name: "orders", element: <OrderList /> },
  //   { path: routes.orders_form, name: "orders_form", element: <OrderForm /> },
  //   {
  //     path: routes.orders_category,
  //     name: "orders_category",
  //     element: <OrderList />,
  //   },
  //   { path: routes.sales, name: "sales", element: <SalesList /> },
];

export const authRoute = routesArray.map((route, index) => ({
  id: index + 1, // Dynamic ID based on index
  path: route.path,
  name: route.name,
  element: route.element,
  route: Route,
}));
