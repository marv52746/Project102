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
  {
    name: "year",
    label: "Year",
    type: "number",
    placeholder: "e.g. 2025",
    default: 2025,
  },
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
  {
    name: "frequency",
    label: "Frequency",
    type: "select",
    options: [
      { label: "Once daily", value: "Once daily" },
      { label: "Twice daily (BID)", value: "Twice daily (BID)" },
      { label: "Three times daily (TID)", value: "Three times daily (TID)" },
      { label: "Four times daily (QID)", value: "Four times daily (QID)" },
      { label: "Every 4 hours", value: "Every 4 hours" },
      { label: "Every 6 hours", value: "Every 6 hours" },
      { label: "Every 8 hours", value: "Every 8 hours" },
      { label: "As needed (PRN)", value: "As needed (PRN)" },
      { label: "Before meals", value: "Before meals" },
      { label: "After meals", value: "After meals" },
      { label: "Bedtime", value: "Bedtime" },
    ],
    placeholder: "Select frequency",
  },
  {
    name: "start_date",
    label: "Start Date",
    type: "date",
    default: new Date(),
  },
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
    type: "select",
    options: [
      { label: "Mild", value: "Mild" },
      { label: "Moderate", value: "Moderate" },
      { label: "Severe", value: "Severe" },
      { label: "Life-threatening", value: "Life-threatening" },
    ],
    placeholder: "Select severity",
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
    default: new Date(),
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Any notes or observations",
  },
];

export const appointmentsFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    default: new Date(),
    required: true,
  },
  {
    name: "time",
    label: "Time",
    type: "time",
    default: new Date().toTimeString().slice(0, 5),
    required: true,
  },
  {
    name: "doctor",
    label: "Doctor",
    type: "reference",
    ref: "users",
  },
  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    placeholder: "Reason of visit",
  },
];

export const pregnancyFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  // {
  //   name: "is_pregnant",
  //   label: "Pregnancy Status",
  //   type: "checkbox",
  //   required: true,
  // },
  {
    name: "gravida",
    label: "Gravida",
    type: "number",
    placeholder: "e.g. 2 (total pregnancies)",
    min: 0,
  },
  {
    name: "para",
    label: "Para",
    type: "number",
    placeholder: "e.g. 1 (total births)",
    min: 0,
  },
  {
    name: "lmp",
    label: "Last Menstrual Period (LMP)",
    type: "date",
  },
  {
    name: "edd",
    label: "Expected Due Date (EDD)",
    type: "date",
  },
  {
    name: "trimester",
    label: "Trimester",
    type: "select",
    options: [
      { label: "First", value: "First" },
      { label: "Second", value: "Second" },
      { label: "Third", value: "Third" },
    ],
    placeholder: "Select trimester",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Additional pregnancy-related notes or risks",
  },
];
export const othersFormFields = [
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Add notes here...",
  },
];

export const clinicalFormFieldMap = {
  vitals: vitalsFormFields,
  surgeries: surgeryFormFields,
  medications: medicationFormFields,
  allergies: allergyFormFields,
  conditions: conditionFormFields,
  appointments: appointmentsFormFields,
  pregnancies: pregnancyFormFields,
  others: othersFormFields,
};
