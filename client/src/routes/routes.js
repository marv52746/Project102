import React from "react";
import { Route, Routes } from "react-router-dom";
import { authRoute, publicRoutes } from "./router.link";
import { useSelector } from "react-redux";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../core/components/Sidebar";

// ProtectedRoute to handle internal users
//   const ProtectedRoute = ({ element }) => {
//     const authState = useSelector((state) => state.user.authState);
//     return authState ? element : <Navigate to="/signin" />;
//   };

const theme = "light";

// Layout for internal users (employee users)
const InternalLayout = () => {
  return (
    <div className={`flex ${theme}`}>
      {/* Sidebar for internal users */}
      <Sidebar className="w-10">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" active />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
        <SidebarItem icon={<Package size={20} />} text="Orders" alert />
        <SidebarItem icon={<Receipt size={20} />} text="Billings" alert />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" alert />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" alert />
      </Sidebar>

      {/* Main content for internal users */}
      <div>
        <Routes>
          {authRoute.map((route) => (
            <Route
              path={route.path}
              //   element={<ProtectedRoute element={route.element} />}
              element={route.element}
              key={route.id}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
};

// Layout for external users (public users)
const PublicLayout = () => {
  return (
    <div className={`${theme}`}>
      {/* Header or any other common components for public users */}
      <div>
        <Routes>
          {publicRoutes.map((route) => (
            <Route path={route.path} element={route.element} key={route.id} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

// Main routing logic
const AllRoutes = () => {
  const authState = useSelector((state) => state.user.authState);

  return (
    <>
      {authState ? (
        // Show Internal Layout for logged-in users (employee)
        <InternalLayout />
      ) : (
        // Show Public Layout for external users
        <PublicLayout />
      )}
    </>
  );
};

export default AllRoutes;
