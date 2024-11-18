import React from "react";
import { useParams } from "react-router-dom";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";

function List() {
  const { tablename } = useParams();

  // Conditionally render components based on the `tablename`
  switch (tablename) {
    case "patients":
      return <Patients />;
    case "doctors":
      return <Doctors />;
    case "appointments":
      return <Appointments />;
    default:
      return <div>Page not found</div>; // Handle cases where tablename doesn't match any
  }
}

export default List;
