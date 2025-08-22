import { userFormFields, userTableColumns } from "./userPresets";
import {
  appointmentFormFields,
  appointmentTableColumns,
} from "./appointmentPresets";
import { propertyAllFields } from "./propertiesPresets";
import { getFields } from "../utils/fieldUtils";
import { patientFormFields, patientTableColumns } from "./patientPresets";
import { doctorFormFields, doctorTableColumns } from "./doctorPresets";
import { inventoryFormFields, inventoryTableColumns } from "./inventoryPresets";
import {
  inventoryLogsFormFields,
  inventoryLogsTableColumns,
} from "./inventoryLogsPresets";

export const formConfigMap = {
  // Management Form
  patients: {
    apiURL: "users",
    query: { role: "patient" },
    getFields: () => getFields(null, patientFormFields),
    title: "Patients",
  },
  doctors: {
    apiURL: "users",
    query: { role: "doctor" },
    getFields: () => getFields(null, doctorFormFields),
    title: "Doctors",
  },
  appointments: {
    apiURL: "appointments",
    getFields: () => getFields(null, appointmentFormFields),
    title: "Appointments",
  },
  inventory: {
    apiURL: "inventory",
    getFields: () => getFields(null, inventoryFormFields),
    title: "Inventory",
  },
  inventoryLogs: {
    apiURL: "inventoryLogs",
    getFields: () => getFields(null, inventoryLogsFormFields),
    title: "Inventory Logs",
  },

  // Settings form
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
};

export const listConfigMap = {
  // Management List
  doctors: {
    apiURL: "users",
    query: { role: "doctor" },
    fieldData: getFields(doctorTableColumns),
    title: "Doctors",
  },
  patients: {
    apiURL: "users",
    query: { role: "patient" },
    fieldData: getFields(patientTableColumns),
    title: "Patients",
  },
  appointments: {
    apiURL: "appointments",
    fieldData: getFields(appointmentTableColumns),
    title: "Appointments",
  },
  inventory: {
    apiURL: "inventory",
    fieldData: getFields(inventoryTableColumns),
    title: "Inventory",
  },
  inventoryLogs: {
    apiURL: "inventoryLogs",
    fieldData: getFields(inventoryLogsTableColumns),
    title: "Inventory Logs",
  },

  // Settings List
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
};
