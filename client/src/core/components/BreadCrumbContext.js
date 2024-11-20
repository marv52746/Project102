import React, { createContext, useState, useContext } from "react";

// Create a Context for Breadcrumb data
const BreadcrumbContext = createContext();

export const useBreadcrumb = () => useContext(BreadcrumbContext);

// Provider Component
export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbData, setBreadcrumbData] = useState({
    tablename: null,
    view: null,
    id: null,
  });

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbData, setBreadcrumbData }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
