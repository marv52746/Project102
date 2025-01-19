export const all_routes = {
  //public
  home: "/",
  singin: "/signin",
  login: "/login",
  signup: "/signup",

  // internal
  dashboard: "/",
  list: "/list/:tablename",
  form: "/form/:tablename/:view/:id",
  orgChart: "/organizational-structure-diagram",
  calendar: "/calendar",
  testPage: "/testPage",

  patients: "/list/patients",
  doctors: "/list/doctors",
  staff: "/list/staff",
  appointments: "/list/appointments",
  birthReports: "/list/birth-reports",

  pregnancies: "/list/pregnancies",
  laborAndDeliveries: "/list/labor-and-deliveries",
  payments: "/list/payments",

  // patient_details: "/patient-details/:id",
  // doctor_details: "/doctor-details/:id",
  // appoinment_details: "/appoinment-details/:id",
};
