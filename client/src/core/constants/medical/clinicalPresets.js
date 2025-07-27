// clinicalPresets.js

export const vitalsFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "blood_pressure",
    label: "Blood Pressure",
    placeholder: "e.g. 120/80",
    required: true,
  },
  { name: "heart_rate", label: "Heart Rate (bpm)", placeholder: "e.g. 72" },
  {
    name: "respiratory_rate",
    label: "Respiratory Rate",
    placeholder: "e.g. 18",
  },
  {
    name: "temperature",
    label: "Temperature (\u00b0C)",
    placeholder: "e.g. 36.7",
  },
  { name: "weight", label: "Weight (kg)", placeholder: "e.g. 70" },
  { name: "height", label: "Height (cm)", placeholder: "e.g. 170" },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Add notes here...",
  },
];

export const surgeryFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "name",
    label: "Surgery Name",
    placeholder: "e.g. Appendectomy",
    required: true,
  },
  { name: "year", label: "Year", type: "number", placeholder: "e.g. 2022" },
  { name: "surgeon", label: "Surgeon", placeholder: "e.g. Dr. Santos" },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "e.g. complications, recovery details",
  },
];

export const medicationFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "name",
    label: "Medication Name",
    placeholder: "e.g. Amoxicillin",
    required: true,
  },
  { name: "dose", label: "Dose", placeholder: "e.g. 500mg" },
  { name: "frequency", label: "Frequency", placeholder: "e.g. 3x per day" },
  { name: "start_date", label: "Start Date", type: "date" },
  { name: "end_date", label: "End Date", type: "date" },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Instructions or additional info",
  },
];

export const allergyFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "name",
    label: "Allergy Name",
    placeholder: "e.g. Penicillin",
    required: true,
  },
  { name: "reaction", label: "Reaction", placeholder: "e.g. Rash, swelling" },
  {
    name: "severity",
    label: "Severity",
    placeholder: "e.g. Mild, Moderate, Severe",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Additional allergy details",
  },
];

export const conditionFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "name",
    label: "Condition",
    placeholder: "e.g. Hypertension",
    required: true,
  },
  {
    name: "code",
    label: "ICD Code",
    placeholder: "e.g. I10",
  },
  {
    name: "diagnosed_date",
    label: "Diagnosed Date",
    type: "date",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Any notes or observations",
  },
];

export const clinicalFormFieldMap = {
  vitals: vitalsFormFields,
  surgeries: surgeryFormFields,
  medications: medicationFormFields,
  allergies: allergyFormFields,
  conditions: conditionFormFields,
};
