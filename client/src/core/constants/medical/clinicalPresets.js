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
    // default: 2025,
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
      { label: "Every 12 hours", value: "Every 12 hours" },
      { label: "Every other day", value: "Every other day" },
      { label: "Weekly", value: "Weekly" },
      { label: "As needed (PRN)", value: "As needed (PRN)" },
      { label: "Before meals", value: "Before meals" },
      { label: "After meals", value: "After meals" },
      { label: "Bedtime", value: "Bedtime" },
      { label: "Morning", value: "Morning" },
      { label: "Noon", value: "Noon" },
      { label: "Evening", value: "Evening" },
      { label: "Night", value: "Night" },
    ],
    placeholder: "Select frequency",
  },
  {
    name: "start_date",
    label: "Start Date",
    type: "date",
    // default: new Date(),
  },
  { name: "end_date", label: "End Date", type: "date" },
  {
    name: "notes",
    label: "Instructions",
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
    // default: new Date(),
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
    // default: new Date(),
    required: true,
  },
  {
    name: "time",
    label: "Time",
    type: "time",
    // default: new Date().toTimeString().slice(0, 5),
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
    name: "code",
    label: "Code",
    type: "text",
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

  // {
  //   name: "trimester",
  //   label: "Trimester",
  //   type: "select",
  //   options: [
  //     { label: "First", value: "First" },
  //     { label: "Second", value: "Second" },
  //     { label: "Third", value: "Third" },
  //   ],
  //   placeholder: "Select trimester",
  // },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    fullRow: true,
    placeholder: "Additional pregnancy-related notes or risks",
  },
];
export const othersFormFields = [
  {
    name: "diagnosis",
    label: "Diagnosis",
    type: "text",
    placeholder: "Enter diagnosis",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Enter additional notes",
  },
  {
    name: "amount",
    label: "Consultation Fee",
    type: "text",
    placeholder: "Enter consultation fee (₱)",
  },
];

export const labRequestFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "name",
    label: "Test Name",
    type: "select",
    options: [
      {
        label: "Complete Blood Count (CBC)",
        value: "Complete Blood Count (CBC)",
      },
      { label: "Urinalysis", value: "Urinalysis" },
      { label: "Fecalysis", value: "Fecalysis" },
      { label: "Blood Sugar (FBS/RBS)", value: "Blood Sugar (FBS/RBS)" },
      { label: "Lipid Profile", value: "Lipid Profile" },
      {
        label: "Liver Function Test (LFT)",
        value: "Liver Function Test (LFT)",
      },
      {
        label: "Kidney Function Test (KFT)",
        value: "Kidney Function Test (KFT)",
      },
      { label: "Electrolytes", value: "Electrolytes" },
      { label: "Pregnancy Test (hCG)", value: "Pregnancy Test (hCG)" },
      { label: "Chest X-Ray", value: "Chest X-Ray" },
      { label: "Pap Smear", value: "Pap Smear" },
      { label: "COVID-19 Antigen", value: "COVID-19 Antigen" },
      { label: "COVID-19 RT-PCR", value: "COVID-19 RT-PCR" },
      { label: "Others", value: "Others" },
    ],

    placeholder: "Select test",
    required: true,
    dynamic: true, // 👈 tells your form handler to allow switching type
  },
  // 👇 This extra field is hidden unless "Others" is chosen
  {
    name: "name_custom",
    label: "Specify Test (if Others)",
    type: "text",
    placeholder: "Enter test name",
    conditional: { field: "name", value: "Others" },
  },

  {
    name: "requested_on",
    label: "Requested Date",
    type: "date",
    default: new Date(),
  },
  {
    name: "notes",
    label: "Notes / Instructions",
    type: "textarea",
    placeholder: "Special instructions for the lab",
  },
  // {
  //   name: "doctor",
  //   label: "Requesting Doctor",
  //   type: "reference",
  //   ref: "users",
  // },
  {
    name: "status",
    label: "Status",
    type: "select",
    default: "Pending",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Completed", value: "Completed" },
    ],
    placeholder: "Select status",
  },
  {
    name: "result",
    label: "Result",
    type: "textarea",
    placeholder: "Enter findings or result if available",
  },
];

export const ultrasoundFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    hidden: true,
  },
  {
    name: "type",
    label: "Ultrasound Type",
    type: "select",
    options: [
      { label: "Abdominal", value: "Abdominal" },
      { label: "Obstetric", value: "Obstetric" },
      { label: "Pelvic", value: "Pelvic" },
      { label: "Thyroid", value: "Thyroid" },
      { label: "Breast", value: "Breast" },
      { label: "Vascular", value: "Vascular" },
      { label: "Kidney", value: "Kidney" },
      { label: "Others", value: "Others" },
    ],
    placeholder: "Select ultrasound type",
    required: true,
    dynamic: true, // 👈 allow conditional rendering
  },
  {
    name: "type_custom",
    label: "Specify Ultrasound (if Others)",
    type: "text",
    placeholder: "Enter ultrasound type",
    conditional: { field: "type", value: "Others" },
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    default: new Date(),
  },
  {
    name: "radiologist",
    label: "Radiologist",
    placeholder: "e.g. Dr. Cruz",
  },
  {
    name: "findings",
    label: "Findings",
    type: "textarea",
    placeholder: "Enter ultrasound findings",
  },
  {
    name: "impression",
    label: "Impression",
    type: "textarea",
    placeholder: "Enter impression/summary",
  },

  {
    name: "notes",
    label: "Additional Notes",
    type: "textarea",
    placeholder: "Any extra notes related to this ultrasound",
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
  labrequests: labRequestFormFields,
  ultrasounds: ultrasoundFormFields,
  others: othersFormFields,
};
