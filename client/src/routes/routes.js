import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { authRoute, publicRoutes } from "./router.link";
import { useSelector } from "react-redux";
import {
  Receipt,
  UserCircle,
  LayoutDashboard,
  Bed,
  NotebookPen,
  Accessibility,
  Network,
  Calendar,
  Baby,
  Clock,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../core/components/Sidebar";
import Header from "../core/components/Header";
import { all_routes } from "./all_routes";
import { getParmsFromPath } from "../core/utils/stringUtils";

const theme = "light";

// Updated iconMapping as an array of objects
const iconMapping = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    alert: false,
    active: false,
    iconText: "Dashboard",
    to: all_routes.dashboard,
    table: "dashboard",
  },
  {
    text: "Patients",
    icon: <Accessibility size={20} />,
    alert: true,
    active: false,
    iconText: "Patients",
    to: all_routes.patients,
    table: "patients",
  },
  {
    text: "Staff",
    icon: <UserCircle size={20} />,
    alert: false,
    active: false,
    iconText: "Staff",
    to: all_routes.staff,
    table: "staff",
  },
  {
    text: "Appointments",
    icon: <NotebookPen size={20} />,
    alert: true,
    active: false,
    iconText: "Appointments",
    to: all_routes.appointments,
    table: "appointments",
  },
  // {
  //   text: "Birth Reports",
  //   icon: <Baby size={20} />,
  //   alert: false,
  //   active: false,
  //   iconText: "Birth Reports",
  //   to: all_routes.birthReports,
  //   table: "birth-reports",
  // },
  {
    text: "Pregnancies",
    icon: <Baby size={20} />,
    alert: false,
    active: false,
    iconText: "Pregnancies",
    to: all_routes.pregnancies,
    table: "pregnancies",
  },
  {
    text: "Labor and Deliveries",
    icon: <Clock size={20} />,
    alert: true,
    active: false,
    iconText: "Labor and Deliveries",
    to: all_routes.laborAndDeliveries,
    table: "labor-and-deliveries",
  },
  {
    text: "Payments",
    icon: <Receipt size={20} />,
    alert: false,
    active: false,
    iconText: "Payments",
    to: all_routes.payments,
    table: "payments",
  },
  // {
  //   text: "Room Allotments",
  //   icon: <Bed size={20} />,
  //   alert: true,
  //   active: false,
  //   iconText: "Room Allotments",
  //   table: "room-allotments",
  // },
  {
    text: "Org Chart",
    icon: <Network size={20} />,
    alert: false,
    active: false,
    iconText: "Org Chart",
    table: "organizational-structure-diagram",
    to: all_routes.orgChart,
  },
  {
    text: "Birthing Calendar",
    icon: <Calendar size={20} />,
    alert: false,
    active: false,
    iconText: "Birthing Calendar",
    table: "calendar",
    to: all_routes.calendar,
  },
  // {
  //   text: "Test Page",
  //   icon: <Calendar size={20} />,
  //   alert: false,
  //   active: false,
  //   iconText: "Test Page",
  //   table: "testPage",
  //   to: all_routes.testPage,
  // },
];

const InternalLayout = () => {
  const location = useLocation(); // Get the current location (URL)
  const parms = getParmsFromPath(location);

  // Function to determine the active item based on the current route
  const getActiveSidebarItem = (route) => {
    return route === parms.tablename ? "active" : "";
  };

  return (
    <div className={`flex h-screen ${theme}`}>
      {/* Sidebar for internal users */}
      <Sidebar className="w-10 bg-side-active/30">
        {iconMapping.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon} // Dynamically set the icon based on the text
            text={item.iconText}
            alert={item.alert} // Display alert if true
            active={getActiveSidebarItem(item.table)} // Update active state based on route
            to={item.to}
          />
        ))}
        {/* <hr className="my-3" /> */}
      </Sidebar>

      {/* Main content for internal users */}
      <div className="flex-1 overflow-auto bg-side-active/30">
        {parms.tablename !== "calendar" && <Header parms={parms} />}
        <Routes>
          {authRoute.map((route) => (
            <Route
              exact={route.exact}
              path={route.path}
              element={route.element}
              key={route.id}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
};

const PublicLayout = () => {
  return (
    <div className={`h-screen ${theme}`}>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            exact={route.exact}
            path={route.path}
            element={route.element}
            key={route.id}
          />
        ))}
      </Routes>
    </div>
  );
};

const AllRoutes = () => {
  const authState = useSelector((state) => state.user.authState);

  return <>{authState ? <InternalLayout /> : <PublicLayout />}</>;
};

export default AllRoutes;
