import React from "react";
import { useParams } from "react-router-dom";
import Patients from "./Patients/Patients";
import Doctors from "./Staff/Doctors";
import Appointments from "./Appointments/Appointments";
import BirthReport from "./LaborAndPregnancies/BirthReport";
import Pregnancies from "./LaborAndPregnancies/Pregnancies";
import LaborAndDelivery from "./LaborAndPregnancies/LaborAndDelivery";
import Payments from "./Payments/Payments";

function List() {
  const { tablename } = useParams();

  // Conditionally render components based on the `tablename`
  switch (tablename) {
    case "patients":
      return <Patients />;
    case "staff":
      return <Doctors />;
    case "appointments":
      return <Appointments />;
    case "birth-reports":
      return <BirthReport />;
    case "pregnancies":
      return <Pregnancies />;
    case "labor-and-deliveries":
      return <LaborAndDelivery />;
    case "payments":
      return <Payments />;
    default:
      return <div>Page not found</div>; // Handle cases where tablename doesn't match any
  }
}

export default List;
