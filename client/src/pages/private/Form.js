import React from "react";
import { useParams } from "react-router-dom";

// Import the components for Patient and Doctor views and edits
import PatientDetails from "./Patients/PatientDetails";
import PatientEdit from "./Patients/PatientEdit";
import DoctorDetails from "./Staff/DoctorDetails";
import DoctorEdit from "./Staff/DoctorEdit";
import AppointmentDetails from "./Appointments/AppointmentDetails";
import BirthReportDetails from "./LaborAndPregnancies/BirthReportDetails";
import PregnancyForm from "./LaborAndPregnancies/PregnancyForm";
import LaborForm from "./LaborAndPregnancies/LaborForm";
import PaymentForm from "./Payments/PaymentForm";

function Form() {
  const { tablename, view, id } = useParams();

  const componentMap = {
    patients: {
      view: <PatientDetails id={id} />,
      edit: <PatientEdit id={id} />,
    },
    staff: {
      view: <DoctorDetails id={id} />,
      edit: <DoctorEdit id={id} />,
    },
    appointments: {
      view: <AppointmentDetails id={id} />,
      edit: <AppointmentDetails id={id} />,
      // edit: <AppointmentEdit id={id} />,
    },
    pregnancies: {
      view: <PregnancyForm id={id} />,
      edit: <PregnancyForm id={id} />,
    },
    payments: {
      view: <PaymentForm id={id} />,
      edit: <PaymentForm id={id} />,
    },
    "labor-and-deliveries": {
      view: <LaborForm id={id} />,
      edit: <LaborForm id={id} />,
    },
    "birth-reports": {
      view: <BirthReportDetails id={id} />,
      edit: <PatientEdit id={id} />,
    },
  };

  // If tablename and view exist in the component map, return the corresponding component
  const component = componentMap[tablename]?.[view];

  if (component) {
    return component;
  }

  return <div>Invalid route or parameters.</div>;
}

export default Form;
