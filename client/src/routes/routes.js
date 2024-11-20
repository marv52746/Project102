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
    alert: false,
    active: false,
    iconText: "Patients",
    to: all_routes.patients,
    table: "patients",
  },
  {
    text: "Doctors",
    icon: <UserCircle size={20} />,
    alert: false,
    active: false,
    iconText: "Doctors",
    to: all_routes.doctors,
    table: "doctors",
  },
  {
    text: "Appointments",
    icon: <NotebookPen size={20} />,
    alert: false,
    active: false,
    iconText: "Appointments",
    to: all_routes.appointments,
    table: "appointments",
  },
  {
    text: "Payments",
    icon: <Receipt size={20} />,
    alert: true,
    active: false,
    iconText: "Payments",
    table: "payments",
  },
  {
    text: "Room Allotments",
    icon: <Bed size={20} />,
    alert: true,
    active: false,
    iconText: "Room Allotments",
    table: "room-allotments",
  },
  {
    text: "Org Chart",
    icon: <Network size={20} />,
    alert: true,
    active: false,
    iconText: "Org Chart",
    table: "organizational-structure-diagram",
    to: all_routes.orgChart,
  },
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
        <hr className="my-3" />
      </Sidebar>

      {/* Main content for internal users */}
      <div className="flex-1 overflow-auto bg-side-active/30">
        <Header parms={parms} />
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
