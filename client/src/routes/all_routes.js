export const all_routes = {
  //public
  home: "/",
  singin: "/signin",
  login: "/login",
  forcePasswordChange: "/login-new",
  forgotPassword: "/forgot-password",
  signup: "/signup",
  create_appointment: "/create_appointment",

  // internal
  portal: "/portal",
  dashboard: "/",
  list: "/list/:tablename",
  form: "/form/:tablename/:view/:id?",
  orgChart: "/organizational-structure-diagram",
  calendar: "/calendar",
  settings: "/settings",
  testPage: "/testPage",

  users: "/list/users",
  properties: "/list/properties",
  patients: "/list/patients",
  doctors: "/list/doctors",
  appointments: "/list/appointments",
  inventory: "/list/inventory",
  inventoryLogs: "/list/inventoryLogs",

  staff: "/list/staff",
  birthReports: "/list/birth-reports",
  pregnancies: "/list/pregnancies",
  laborAndDeliveries: "/list/labor-and-deliveries",
  payments: "/list/payments",

  // patient_details: "/patient-details/:id",
  // doctor_details: "/doctor-details/:id",
  // appoinment_details: "/appoinment-details/:id",
};
