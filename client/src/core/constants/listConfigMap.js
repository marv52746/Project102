// import { patientFields } from "./Patients/patientFields";
// import { doctorFields } from "./Staff/doctorFields";
// import { appointmentFields } from "./Appointments/appointmentFields";
// import { birthReportFields } from "./LaborAndPregnancies/birthReportFields";
// import { pregnancyFields } from "./LaborAndPregnancies/pregnancyFields";
// import { laborDeliveryFields } from "./LaborAndPregnancies/laborDeliveryFields";
// import { paymentFields } from "./Payments/paymentFields";
import { getUserFormFields } from "./userPresets";
import { getAppointmentFields } from "./appointmentPresets";
import { getPropertyFields } from "./propertiesPresets";

export const listConfigMap = {
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
    getFields: (mode) => getUserFormFields("form", mode),
    title: "Users",
  },
  properties: {
    apiURL: "properties",
    getFields: (mode) => getPropertyFields("form", mode),
    title: "System Properties",
  },
  appointments: {
    apiURL: "appointments",
    getFields: (mode) => getAppointmentFields("form", mode),
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
