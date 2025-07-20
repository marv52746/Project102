import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { internalRoles } from "../../core/constants/rolePresets";
import ListFormat from "../../core/components/ListFormat"; // adjust this path
import { getUserFormFields } from "../../core/constants/userPresets";
import { getPropertyFields } from "../../core/constants/propertiesPresets";
import { getAppointmentFields } from "../../core/constants/appointmentPresets";

const listConfigMap = {
  //   patients: {
  //     apiURL: "patients",
  //     fieldData: patientFields,
  //     title: "Patients",
  //   },
  //   staff: {
  //     apiURL: "staff",
  //     fieldData: doctorFields,
  //     title: "Staff",
  //   },
  users: {
    apiURL: "users",
    fieldData: getUserFormFields("list"),
    title: "Users",
  },
  properties: {
    apiURL: "properties",
    fieldData: getPropertyFields(),
    title: "System Properties",
  },
  appointments: {
    apiURL: "appointments",
    fieldData: getAppointmentFields("list"),
    title: "Appointments",
  },
  //   "birth-reports": {
  //     apiURL: "birth-reports",
  //     fieldData: birthReportFields,
  //     title: "Birth Reports",
  //   },
  //   pregnancies: {
  //     apiURL: "pregnancies",
  //     fieldData: pregnancyFields,
  //     title: "Pregnancies",
  //   },
  //   "labor-and-deliveries": {
  //     apiURL: "labor-and-deliveries",
  //     fieldData: laborDeliveryFields,
  //     title: "Labor & Deliveries",
  //   },
  //   payments: {
  //     apiURL: "payments",
  //     fieldData: paymentFields,
  //     title: "Payments",
  //   },
};

function List() {
  const { tablename } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasValidRole = userInfo && internalRoles.includes(userInfo.role);

  if (!hasValidRole) return <div>Access denied</div>;

  const config = listConfigMap[tablename];
  if (!config) return <div>Page not found</div>;

  return (
    <ListFormat
      apiURL={config.apiURL}
      fieldData={config.fieldData}
      mode="view"
      title={config.title}
    />
  );
}

export default List;
