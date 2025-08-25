import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { authRoute, publicRoutes } from "./router.link";
import { useSelector } from "react-redux";
import Sidebar, { SidebarItem } from "../core/components/Sidebar";
import Header from "../core/components/Header";
import { all_routes } from "./all_routes";
import { getParmsFromPath } from "../core/utils/stringUtils";
import { internalRoles } from "../core/constants/rolePresets";
import Notification from "../core/components/Notification";
import { iconMapping } from "./sidebarMenu";

const theme = "light";

const InternalLayout = () => {
  const location = useLocation(); // Get the current location (URL)
  const parms = getParmsFromPath(location);
  // const { expanded } = useContext(SidebarContext);

  // Function to determine the active item based on the current route
  const getActiveSidebarItem = (route) => {
    return route === parms.tablename ? "active" : "";
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme}`}>
      {/* Sidebar for internal users */}
      <Sidebar>
        {(expanded) => (
          <>
            {iconMapping.map((group, idx) => (
              <div key={idx} className="mb-8">
                {expanded && (
                  <div className="text-xs font-semibold text-muted px-3 mb-1">
                    {group.section}
                  </div>
                )}
                <div className={expanded ? "pl-3" : ""}>
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.text}
                      icon={item.icon}
                      text={item.iconText}
                      alert={item.alert}
                      active={getActiveSidebarItem(item.table)}
                      to={item.to}
                      expanded={expanded}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </Sidebar>

      {/* Main content for internal users */}
      <div
        className={`flex-1 bg-side-active/30 ${
          parms.tablename === "calendar" ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        {parms.tablename !== "calendar" && parms.tablename !== "settings" && (
          <Header parms={parms} />
        )}
        <Routes>
          {authRoute.map((route) => (
            <Route
              // exact={route.exact}
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
            // exact={route.exact}
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
  const location = useLocation();
  const userInfo = useSelector((state) => state.user.userInfo);

  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  const isPublicPath = publicRoutes.some(
    (route) => route.path === location.pathname
  );

  let content;

  // Case 1: Logged-in user with valid role trying to access /login → redirect to dashboard
  if (authState && hasValidRole && location.pathname === all_routes.login) {
    content = <Navigate to={all_routes.dashboard} replace />;
  }
  // Case 2: Logged-in but invalid role
  else if (authState && !hasValidRole) {
    content = <PublicLayout />;
  }
  // Case 3: Not logged in and trying to access a protected route
  else if (!authState && !isPublicPath) {
    content = <Navigate to={all_routes.login} replace />;
  }
  // Final: Route correctly
  else {
    content = authState && hasValidRole ? <InternalLayout /> : <PublicLayout />;
  }

  return (
    <>
      <Notification />
      {content}
    </>
  );
};

export default AllRoutes;
