export const all_routes = {
  //public
  home: "/",
  singin: "/signin",

  // internal
  dashboard: "/",
  list: "/list/:tablename",
  form: "/form/:tablename/:view/:id",
  orgChart: "/organizational-structure-diagram",
  calendar: "/calendar",

  patients: "/list/patients",
  doctors: "/list/doctors",
  appointments: "/list/appointments",
  birthReports: "/list/birth-reports",

  // patient_details: "/patient-details/:id",
  // doctor_details: "/doctor-details/:id",
  // appoinment_details: "/appoinment-details/:id",
};
