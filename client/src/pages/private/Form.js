import React from "react";
import { useParams } from "react-router-dom";

// Import the components for Patient and Doctor views and edits
import PatientDetails from "./PatientDetails";
import PatientEdit from "./PatientEdit";
import DoctorDetails from "./DoctorDetails";
import DoctorEdit from "./DoctorEdit";
import AppointmentDetails from "./AppointmentDetails";
import AppointmentEdit from "./AppointmentEdit";
import BirthReportDetails from "./BirthReportDetails";

function Form() {
  const { tablename, view, id } = useParams();

  const componentMap = {
    patients: {
      view: <PatientDetails id={id} />,
      edit: <PatientEdit id={id} />,
    },
    doctors: {
      view: <DoctorDetails id={id} />,
      edit: <DoctorEdit id={id} />,
    },
    appointments: {
      view: <AppointmentDetails id={id} />,
      edit: <AppointmentEdit id={id} />,
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
