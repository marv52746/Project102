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
  { name: "dose", label: "Dose", placeholder: "e.g. 500mg", required: true },
  {
    name: "frequency",
    label: "Frequency",
    type: "select",
    required: true,
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
    required: true,
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
  {
    name: "reaction",
    label: "Reaction",
    placeholder: "e.g. Rash, swelling",
    required: true,
  },
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
    required: true,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    required: true,
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
  // {
  //   name: "code",
  //   label: "ICD Code",
  //   placeholder: "e.g. I10",
  // },
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
    required: true,
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
    required: true,
  },
  {
    name: "reason",
    required: true,
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
    required: true,
  },
  {
    name: "para",
    label: "Para",
    type: "number",
    placeholder: "e.g. 1 (total births)",
    min: 0,
    required: true,
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
    required: true,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Enter additional notes",
    required: true,
  },
  // {
  //   name: "amount",
  //   label: "Consultation Fee",
  //   type: "text",
  //   placeholder: "Enter consultation fee (₱)",
  //   required: true,
  // },
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
    type: "reactselect",
    required: true,
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
    ],

    placeholder: "Select test",
    dynamic: true, // 👈 tells your form handler to allow switching type
  },
  // 👇 This extra field is hidden unless "Others" is chosen
  // {
  //   name: "name_custom",
  //   label: "Specify Test (if Others)",
  //   type: "text",
  //   placeholder: "Enter test name",
  //   conditional: { field: "name", value: "Others" },
  // },

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

// export const ultrasoundFormFields = [
//   {
//     name: "patient",
//     label: "Patient",
//     type: "reference",
//     ref: "users",
//     hidden: true,
//   },
//   {
//     name: "type",
//     label: "Ultrasound Type",
//     type: "select",
//     options: [
//       { label: "Biometry", value: "Biometry" },
//       { label: "Biophysical Score", value: "Biophysical Score" },
//       {
//         label: "Transvaginal Ultrasound - OB",
//         value: "Transvaginal Ultrasound - OB",
//       },
//       {
//         label: "Transvaginal Ultrasound - Gyne",
//         value: "Transvaginal Ultrasound - Gyne",
//       },

//       { label: "Others", value: "Others" },
//     ],
//     placeholder: "Select ultrasound type",
//     required: true,
//     dynamic: true, // 👈 allow conditional rendering
//   },
//   {
//     name: "type_custom",
//     label: "Specify Ultrasound (if Others)",
//     type: "text",
//     placeholder: "Enter ultrasound type",
//     conditional: { field: "type", value: "Others" },
//   },
//   {
//     name: "date",
//     label: "Date",
//     type: "date",
//     default: new Date(),
//   },
//   {
//     name: "radiologist",
//     label: "Radiologist",
//     placeholder: "e.g. Dr. Cruz",
//   },
//   {
//     name: "findings",
//     label: "Findings",
//     type: "textarea",
//     placeholder: "Enter ultrasound findings",
//   },
//   {
//     name: "impression",
//     label: "Impression",
//     type: "textarea",
//     placeholder: "Enter impression/summary",
//   },

//   {
//     name: "notes",
//     label: "Additional Notes",
//     type: "textarea",
//     placeholder: "Any extra notes related to this ultrasound",
//   },
// ];

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
      { label: "Biometry", value: "Biometry" },
      { label: "Biophysical Score", value: "Biophysical Score" },
      {
        label: "Transvaginal Ultrasound - OB",
        value: "Transvaginal Ultrasound - OB",
      },
      {
        label: "Transvaginal Ultrasound - Gyne",
        value: "Transvaginal Ultrasound - Gyne",
      },
      { label: "Others", value: "Others" },
    ],
    placeholder: "Select ultrasound type",
    required: true,
    dynamic: true,
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

  // ---------------- OB DATA ----------------
  {
    name: "ob_data.lmp",
    label: "LMP",
    type: "date",
  },
  {
    name: "ob_data.edd",
    label: "EDD",
    type: "date",
  },
  {
    name: "ob_data.aog",
    label: "AOG",
    type: "text",
    placeholder: "e.g. 21W 4D",
  },
  {
    name: "ob_data.gravida_para",
    label: "Gravida / Para",
    type: "text",
    placeholder: "e.g. G3P1(1011)",
  },

  // ---------------- EARLY PREGNANCY (TVS-OB) ----------------
  {
    name: "early_pregnancy.gestational_sac.size",
    label: "Gestational Sac Size",
    type: "text",
    placeholder: "e.g. 2.0 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.gestational_sac.age_equiv",
    label: "Gestational Sac Age Equivalent",
    type: "text",
    placeholder: "e.g. 6W 3D",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.crown_rump_length.size",
    label: "CRL Size",
    type: "text",
    placeholder: "e.g. 1.14 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.crown_rump_length.age_equiv",
    label: "CRL Age Equivalent",
    type: "text",
    placeholder: "e.g. 7W 2D",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.yolk_sac",
    label: "Yolk Sac",
    type: "text",
    placeholder: "present / absent",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.fetal_heart_rate",
    label: "Fetal Heart Rate",
    type: "text",
    placeholder: "e.g. 165 bpm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.average_ultrasonic_age",
    label: "Average Ultrasonic Age",
    type: "text",
    placeholder: "e.g. 7W 2D",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.ultrasonic_edc",
    label: "Ultrasonic EDC",
    type: "date",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.uterus",
    label: "Uterus",
    type: "text",
    placeholder: "e.g. anteverted",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.adnexae.right_ovary",
    label: "Right Ovary",
    type: "text",
    placeholder: "e.g. normal",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.adnexae.left_ovary",
    label: "Left Ovary",
    type: "text",
    placeholder: "e.g. normal",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.cervix.dimensions",
    label: "Cervix Dimensions",
    type: "text",
    placeholder: "e.g. 2.79 x 2.12 x 2.47 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.cervix.volume",
    label: "Cervix Volume",
    type: "text",
    placeholder: "e.g. 7.64 ml",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "early_pregnancy.cervix.notes",
    label: "Cervix Notes",
    type: "textarea",
    placeholder: "e.g. long and closed",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },

  // ---------------- FETAL SURVEY ----------------
  {
    name: "fetal_survey.presentation",
    label: "Presentation",
    type: "text",
    placeholder: "e.g. cephalic",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.fetal_sex",
    label: "Fetal Sex",
    type: "text",
    placeholder: "e.g. male / female",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.number_of_fetus",
    label: "Number of Fetuses",
    type: "text",
    placeholder: "e.g. singleton",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.placenta_grade",
    label: "Placenta Grade",
    type: "text",
    placeholder: "e.g. Grade II",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.placenta_position",
    label: "Placenta Position",
    type: "text",
    placeholder: "e.g. anterior",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.fetal_heart_rate",
    label: "Fetal Heart Rate",
    type: "text",
    placeholder: "e.g. 140 bpm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.svp",
    label: "Amniotic Fluid SVP",
    type: "text",
    placeholder: "e.g. 2.1 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.afi.q1",
    label: "AFI Q1",
    type: "text",
    placeholder: "Quadrant 1",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.afi.q2",
    label: "AFI Q2",
    type: "text",
    placeholder: "Quadrant 2",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.afi.q3",
    label: "AFI Q3",
    type: "text",
    placeholder: "Quadrant 3",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.afi.q4",
    label: "AFI Q4",
    type: "text",
    placeholder: "Quadrant 4",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },
  {
    name: "fetal_survey.amniotic_fluid.afi.total",
    label: "AFI Total",
    type: "text",
    placeholder: "e.g. 12.4 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - OB" },
  },

  // ---------------- FETAL BIOMETRY ----------------
  {
    name: "fetal_biometry.bpd.measurement",
    label: "BPD (cm)",
    type: "text",
    placeholder: "e.g. 5.02 cm",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.bpd.age_equiv",
    label: "BPD Age Equivalent",
    type: "text",
    placeholder: "e.g. 21W 1D",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.ofd.measurement",
    label: "OFD (cm)",
    type: "text",
    placeholder: "e.g. 6.14 cm",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.ofd.age_equiv",
    label: "OFD Age Equivalent",
    type: "text",
    placeholder: "e.g. 22W 0D",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.hc.measurement",
    label: "HC (cm)",
    type: "text",
    placeholder: "e.g. 19.2 cm",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.hc.age_equiv",
    label: "HC Age Equivalent",
    type: "text",
    placeholder: "e.g. 22W 3D",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.ac.measurement",
    label: "AC (cm)",
    type: "text",
    placeholder: "e.g. 16.4 cm",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.ac.age_equiv",
    label: "AC Age Equivalent",
    type: "text",
    placeholder: "e.g. 21W 6D",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.fl.measurement",
    label: "FL (cm)",
    type: "text",
    placeholder: "e.g. 3.7 cm",
    conditional: { field: "type", value: "Biometry" },
  },
  {
    name: "fetal_biometry.fl.age_equiv",
    label: "FL Age Equivalent",
    type: "text",
    placeholder: "e.g. 21W 2D",
    conditional: { field: "type", value: "Biometry" },
  },

  // ---------------- BIOPHYSICAL PROFILE ----------------
  {
    name: "biophysical_profile.fetal_breathing",
    label: "Fetal Breathing (0/2)",
    type: "number",
    conditional: { field: "type", value: "Biophysical Score" },
  },
  {
    name: "biophysical_profile.fetal_tone",
    label: "Fetal Tone (0/2)",
    type: "number",
    conditional: { field: "type", value: "Biophysical Score" },
  },
  {
    name: "biophysical_profile.fetal_movement",
    label: "Fetal Movement (0/2)",
    type: "number",
    conditional: { field: "type", value: "Biophysical Score" },
  },
  {
    name: "biophysical_profile.afi_score",
    label: "AFI Score (0/2)",
    type: "number",
    conditional: { field: "type", value: "Biophysical Score" },
  },
  {
    name: "biophysical_profile.total",
    label: "Total BPS Score",
    type: "number",
    conditional: { field: "type", value: "Biophysical Score" },
  },

  // ---------------- GYNE FINDINGS ----------------
  {
    name: "gyn_findings.cervix.dimensions",
    label: "Cervix Dimensions",
    type: "text",
    placeholder: "e.g. 2.47 x 1.91 x 2.10 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.cervix.notes",
    label: "Cervix Notes",
    type: "textarea",
    placeholder: "e.g. nabothian cysts, long and closed",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.uterus.dimensions",
    label: "Uterus Dimensions",
    type: "text",
    placeholder: "e.g. 7.2 x 5.4 x 6.1 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.uterus.orientation",
    label: "Uterus Orientation",
    type: "text",
    placeholder: "e.g. anteverted",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.uterus.notes",
    label: "Uterus Notes",
    type: "textarea",
    placeholder: "e.g. homogeneous myometrium",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.uterus.wall_thickness.anterior",
    label: "Wall Thickness (Anterior)",
    type: "text",
    placeholder: "e.g. 0.9 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.uterus.wall_thickness.posterior",
    label: "Wall Thickness (Posterior)",
    type: "text",
    placeholder: "e.g. 1.1 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.endometrium.thickness",
    label: "Endometrium Thickness",
    type: "text",
    placeholder: "e.g. 0.7 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.endometrium.notes",
    label: "Endometrium Notes",
    type: "textarea",
    placeholder: "e.g. secretory phase",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.right_ovary.dimensions",
    label: "Right Ovary Dimensions",
    type: "text",
    placeholder: "e.g. 2.5 x 1.8 x 2.0 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.right_ovary.volume",
    label: "Right Ovary Volume",
    type: "text",
    placeholder: "e.g. 7.2 ml",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.right_ovary.notes",
    label: "Right Ovary Notes",
    type: "textarea",
    placeholder: "e.g. functional cyst",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.left_ovary.dimensions",
    label: "Left Ovary Dimensions",
    type: "text",
    placeholder: "e.g. 2.6 x 2.1 x 1.9 cm",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.left_ovary.volume",
    label: "Left Ovary Volume",
    type: "text",
    placeholder: "e.g. 8.1 ml",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.left_ovary.notes",
    label: "Left Ovary Notes",
    type: "textarea",
    placeholder: "e.g. cystic follicle",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },
  {
    name: "gyn_findings.others.notes",
    label: "Other Gyne Findings",
    type: "textarea",
    placeholder: "Additional notes",
    conditional: { field: "type", value: "Transvaginal Ultrasound - Gyne" },
  },

  // ---------------- COMMON ----------------
  {
    name: "average_age",
    label: "Average Age",
    type: "text",
    placeholder: "e.g. 22W 0D",
  },
  { name: "ultrasonic_edd", label: "Ultrasonic EDD", type: "date" },
  {
    name: "efw",
    label: "Estimated Fetal Weight",
    type: "text",
    placeholder: "e.g. 520 g",
  },

  // ---------------- IMPRESSION & NOTES ----------------
  {
    name: "others",
    label: "Other Findings",
    type: "textarea",
    placeholder: "Additional findings or comments",
  },
  {
    name: "impression",
    label: "Impression",
    type: "textarea",
    placeholder: "Final impression / conclusion",
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
