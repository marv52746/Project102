import { userFormFields, userTableColumns } from "./userPresets";
import {
  appointmentFormFields,
  appointmentTableColumns,
} from "./appointmentPresets";
import { propertyAllFields } from "./propertiesPresets";
import { getFields } from "../utils/fieldUtils";

export const formConfigMap = {
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
    getFields: () => getFields(null, userFormFields),
    title: "Users",
  },
  properties: {
    apiURL: "properties",
    getFields: () => getFields(null, propertyAllFields),
    title: "System Properties",
  },
  appointments: {
    apiURL: "appointments",
    getFields: () => getFields(null, appointmentFormFields),
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
    fieldData: getFields(userTableColumns),
    title: "Users",
  },
  properties: {
    apiURL: "properties",
    fieldData: getFields(propertyAllFields),
    title: "System Properties",
  },
  appointments: {
    apiURL: "appointments",
    fieldData: getFields(appointmentTableColumns),
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
