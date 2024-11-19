export const all_routes = {
  //public
  home: "/",
  singin: "/signin",

  // internal
  dashboard: "/",
  list: "/list/:tablename",
  form: "/form/:tablename/:view/:id",

  patients: "/list/patients",
  doctors: "/list/doctors",
  appointments: "/list/appointments",

  // patient_details: "/patient-details/:id",
  // doctor_details: "/doctor-details/:id",
  // appoinment_details: "/appoinment-details/:id",
};
