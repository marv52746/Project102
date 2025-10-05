import { genderOptions } from "../formFieldPresets";

export const ultrasoundsForm = {
  patient_data: {
    condition: null, // always visible
    fields: [
      {
        name: "patient.name",
        label: "Patient",
        type: "text",
        readOnly: true,
      },
      {
        name: "patient.age",
        label: "Age",
        type: "text",
        readOnly: true,
        // default: (data) => getAbsoluteAge(data?.patient?.date_of_birth),
      },
      {
        name: "chief_complaint",
        label: "Chief complaint",
        type: "text",
        colSpan: 2,
      },
      { type: "break", name: "__break__" },
      {
        name: "type",
        label: "Ultrasound Type",
        type: "select",
        creatable: true,
        options: [
          { label: "Biometry", value: "Biometry" },
          { label: "Biophysical Score", value: "Biophysical Score" },
          {
            label: "TVS - OB",
            value: "Transvaginal Ultrasound - OB",
          },
          {
            label: "TVS - Gyne",
            value: "Transvaginal Ultrasound - Gyne",
          },
        ],
        // default: "Biometry",
        placeholder: "Select ultrasound type",
        required: true,
        dynamic: true,
      },

      {
        name: "radiologist",
        label: "Radiologist",
        type: "select",
        placeholder: "Select Radiologist",
        creatable: true,
        options: [
          {
            label: "NIEL KRISTOFFER P. GAMBOA, MD, DPBR",
            value: "NIEL KRISTOFFER P. GAMBOA, MD, DPBR",
          },
          {
            label: "LIZA M. MUÑEZ, MD, FPCR",
            value: "LIZA M. MUÑEZ, MD, FPCR",
          },
        ],
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        default: () => new Date(),
      },
      { name: "radio_fee", label: "Radiologist Fee", type: "number" },
    ],
  },

  ob_data: {
    condition: {
      type: ["Biometry", "Biophysical Score", "Transvaginal Ultrasound - Gyne"],
    },
    fields: [
      { name: "ob_data.lmp", label: "LMP", type: "date" },
      { name: "ob_data.edd", label: "EDD", type: "date" },
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
    ],
  },

  ob_data: {
    condition: { type: "Transvaginal Ultrasound - Gyne" },
    fields: [
      {
        name: "ob_data.gravida_para",
        label: "Gravida / Para",
        type: "text",
        placeholder: "e.g. G3P1(1011)",
      },
      {
        name: "ob_data.day_of_cycle",
        label: "Day of Cycle",
        type: "text",
      },
    ],
  },

  fetal_survey: {
    condition: { type: ["Biometry", "Biophysical Score"] },
    fields: [
      {
        name: "fetal_survey.presentation",
        label: "Presentation",
        type: "text",
        placeholder: "e.g. Cephalic",
      },
      {
        name: "fetal_survey.fetal_sex",
        label: "Fetal Sex",
        type: "select",
        placeholder: "e.g. Male / Female",
        options: genderOptions,
      },
      {
        name: "fetal_survey.number_of_fetus",
        label: "Number of Fetuses",
        type: "text",
        placeholder: "e.g. Singleton",
      },
      {
        name: "fetal_survey.placenta_grade",
        label: "Placenta Grade",
        type: "text",
        placeholder: "e.g. Grade II",
      },
      {
        name: "fetal_survey.placenta_position",
        label: "Placenta Position",
        type: "text",
        placeholder: "e.g. Anterior",
      },
      {
        name: "fetal_survey.fetal_heart_rate",
        label: "Fetal Heart Rate",
        type: "text",
        placeholder: "e.g. 140 bpm",
      },

      // 🔹 Amniotic Fluid Section
      { type: "break", name: "__break__" },

      {
        name: "fetal_survey.amniotic_fluid.afi.q1",
        label: "AFI - Quadrant 1",
        type: "text",
        placeholder: "e.g. 2.1 cm",
        // default: " ",
      },
      {
        name: "fetal_survey.amniotic_fluid.afi.q2",
        label: "AFI - Quadrant 2",
        type: "text",
        placeholder: "e.g. 3.5 cm",
      },
      {
        name: "fetal_survey.amniotic_fluid.afi.q3",
        label: "AFI - Quadrant 3",
        type: "text",
        placeholder: "e.g. 2.8 cm",
      },
      {
        name: "fetal_survey.amniotic_fluid.afi.q4",
        label: "AFI - Quadrant 4",
        type: "text",
        placeholder: "e.g. 3.0 cm",
      },
      {
        name: "fetal_survey.amniotic_fluid.afi.total",
        label: "AFI - Total",
        type: "text",
        placeholder: "e.g. 11.4 cm",
      },
      {
        name: "fetal_survey.amniotic_fluid.svp",
        label: "Single Vertical Pocket (SVP)",
        type: "text",
        placeholder: "e.g. 3.2 cm",
      },
    ],
  },

  fetal_biometry: {
    condition: { type: ["Biometry", "Biophysical Score"] },
    fields: [
      {
        name: "fetal_biometry.bpd.measurement",
        label: "BPD (cm)", // Biparietal Diameter
        type: "text",
        placeholder: "e.g. 5.02 cm",
      },
      {
        name: "fetal_biometry.bpd.age_equiv",
        label: "BPD (age equiv)",
        type: "text",
        placeholder: "e.g. 21W 1D",
      },
      {
        name: "fetal_biometry.ofd.measurement",
        label: "OFD (cm)", // Occipito-Frontal Diameter
        type: "text",
        placeholder: "e.g. 6.10 cm",
      },
      {
        name: "fetal_biometry.ofd.age_equiv",
        label: "OFD (age equiv)",
        type: "text",
        placeholder: "e.g. 22W 0D",
      },
      {
        name: "fetal_biometry.hc.measurement",
        label: "HC (cm)", // Head Circumference
        type: "text",
        placeholder: "e.g. 17.5 cm",
      },
      {
        name: "fetal_biometry.hc.age_equiv",
        label: "HC (age equiv)",
        type: "text",
        placeholder: "e.g. 22W 4D",
      },
      {
        name: "fetal_biometry.ac.measurement",
        label: "AC (cm)", // Abdominal Circumference
        type: "text",
        placeholder: "e.g. 15.2 cm",
      },
      {
        name: "fetal_biometry.ac.age_equiv",
        label: "AC (age equiv)",
        type: "text",
        placeholder: "e.g. 21W 6D",
      },
      {
        name: "fetal_biometry.fl.measurement",
        label: "FL (cm)", // Femur Length
        type: "text",
        placeholder: "e.g. 3.8 cm",
      },
      {
        name: "fetal_biometry.fl.age_equiv",
        label: "FL (age equiv)",
        type: "text",
        placeholder: "e.g. 22W 2D",
      },
    ],
  },

  biophysical_profile: {
    condition: { type: "Biophysical Score" },
    fields: [
      {
        name: "biophysical_profile.fetal_breathing",
        label: "Fetal Breathing (0/2)",
        type: "number",
        placeholder: "0 or 2",
      },
      {
        name: "biophysical_profile.fetal_tone",
        label: "Fetal Tone (0/2)",
        type: "number",
        placeholder: "0 or 2",
      },
      {
        name: "biophysical_profile.fetal_movement",
        label: "Fetal Movement (0/2)",
        type: "number",
        placeholder: "0 or 2",
      },
      {
        name: "biophysical_profile.afi_score",
        label: "AFI Score (0/2)",
        type: "number",
        placeholder: "0 or 2",
      },
      {
        name: "biophysical_profile.total",
        label: "Total BPS Score",
        type: "number",
      },
    ],
  },

  early_pregnancy: {
    condition: { type: "Transvaginal Ultrasound - OB" },
    fields: [
      // Gestational Sac
      {
        name: "early_pregnancy.gestational_sac.size",
        label: "Gestational Sac Size",
        type: "text",
        placeholder: "e.g. 2.0 cm",
      },
      {
        name: "early_pregnancy.gestational_sac.age_equiv",
        label: "Gestational Sac Age Equivalent",
        type: "text",
        placeholder: "e.g. 6W 3D",
      },

      // Crown-Rump Length
      {
        name: "early_pregnancy.crown_rump_length.size",
        label: "Crown Rump Length Size",
        type: "text",
        placeholder: "e.g. 1.14 cm",
      },
      {
        name: "early_pregnancy.crown_rump_length.age_equiv",
        label: "Crown Rump Length Age Equivalent",
        type: "text",
        placeholder: "e.g. 7W 2D",
      },

      // Yolk Sac
      {
        name: "early_pregnancy.yolk_sac",
        label: "Yolk Sac",
        type: "text",
        placeholder: "present / absent / size",
      },

      // Fetal Heart Rate
      {
        name: "early_pregnancy.fetal_heart_rate",
        label: "Fetal Heart Rate",
        type: "text",
        placeholder: "e.g. 165 bpm",
        colSpan: 1,
      },

      // force new row here
      { name: "", type: "break" },

      // Summary
      {
        name: "early_pregnancy.average_ultrasonic_age",
        label: "Average Ultrasonic Age",
        type: "text",
        placeholder: "e.g. 7W 2D",
      },
      {
        name: "early_pregnancy.ultrasonic_edc",
        label: "Ultrasonic EDC",
        type: "date",
      },

      // force new row here
      { name: "", type: "break" },

      // Uterus
      {
        name: "early_pregnancy.uterus",
        label: "Uterus",
        type: "text",
        placeholder: "e.g. anteverted",
      },

      // Adnexae
      {
        name: "early_pregnancy.adnexae.right_ovary",
        label: "Right Ovary",
        type: "text",
        placeholder: "e.g. normal",
      },
      {
        name: "early_pregnancy.adnexae.left_ovary",
        label: "Left Ovary",
        type: "text",
        placeholder: "e.g. normal",
      },

      // force new row here
      { name: "", type: "break" },

      // Cervix
      {
        name: "early_pregnancy.cervix.dimensions",
        label: "Cervix Dimensions",
        type: "text",
        placeholder: "e.g. 2.79 x 2.12 x 2.47 cm",
      },
      {
        name: "early_pregnancy.cervix.volume",
        label: "Cervix Volume",
        type: "text",
        placeholder: "e.g. 7.64 ml",
      },
      {
        name: "early_pregnancy.cervix.notes",
        label: "Cervix Notes",
        type: "textarea",
        colSpan: 2,
        placeholder: "e.g. long and closed",
      },
    ],
  },

  gyn_findings: {
    condition: { type: "Transvaginal Ultrasound - Gyne" },
    fields: [
      // CERVIX
      {
        name: "gyn_findings.cervix.dimensions",
        label: "Cervix Dimensions",
        type: "text",
        placeholder: "e.g. 2.47 x 1.91 x 2.10 cm",
      },
      {
        name: "gyn_findings.cervix.notes",
        label: "Cervix Notes",
        type: "textarea",
        colSpan: 2,
        placeholder: "e.g. Nabothian cysts, long and closed",
      },

      { type: "break", name: "__break__" },

      // UTERUS
      {
        name: "gyn_findings.uterus.dimensions",
        label: "Uterus Dimensions",
        type: "text",
        placeholder: "e.g. 7.2 x 4.5 x 3.8 cm",
      },
      {
        name: "gyn_findings.uterus.orientation",
        label: "Uterus Orientation",
        type: "text",
        placeholder: "e.g. anteverted",
      },

      {
        name: "gyn_findings.uterus.wall_thickness.anterior",
        label: "Anterior Wall Thickness",
        type: "text",
        placeholder: "e.g. 1.2 cm",
      },
      {
        name: "gyn_findings.uterus.wall_thickness.posterior",
        label: "Posterior Wall Thickness",
        type: "text",
        placeholder: "e.g. 1.3 cm",
      },
      {
        name: "gyn_findings.uterus.notes",
        label: "Uterus Notes",
        type: "textarea",
        placeholder: "e.g. homogeneous, adenomyosis",
      },
      { type: "break", name: "__break__" },

      // ENDOMETRIUM
      {
        name: "gyn_findings.endometrium.thickness",
        label: "Endometrium Thickness",
        type: "text",
        placeholder: "e.g. 0.8 cm",
      },
      {
        name: "gyn_findings.endometrium.notes",
        label: "Endometrium Notes",
        type: "textarea",
        colSpan: 2,
        placeholder: "e.g. trilaminar pattern",
      },

      { type: "break", name: "__break__" },

      // RIGHT OVARY
      {
        name: "gyn_findings.right_ovary.dimensions",
        label: "Right Ovary Dimensions",
        type: "text",
        placeholder: "e.g. 3.1 x 2.5 x 2.8 cm",
      },
      {
        name: "gyn_findings.right_ovary.volume",
        label: "Right Ovary Volume",
        type: "text",
        placeholder: "e.g. 9.2 ml",
      },
      {
        name: "gyn_findings.right_ovary.notes",
        label: "Right Ovary Notes",
        type: "textarea",
        colSpan: 2,
        placeholder: "e.g. simple cyst",
      },

      { type: "break", name: "__break__" },

      // LEFT OVARY
      {
        name: "gyn_findings.left_ovary.dimensions",
        label: "Left Ovary Dimensions",
        type: "text",
        placeholder: "e.g. 2.9 x 2.1 x 2.6 cm",
      },
      {
        name: "gyn_findings.left_ovary.volume",
        label: "Left Ovary Volume",
        type: "text",
        placeholder: "e.g. 8.5 ml",
      },
      {
        name: "gyn_findings.left_ovary.notes",
        label: "Left Ovary Notes",
        type: "textarea",
        colSpan: 2,
        placeholder: "e.g. normal",
      },

      { type: "break", name: "__break__" },

      // OTHERS
      {
        name: "gyn_findings.others.notes",
        label: "Other Findings",
        type: "textarea",
        placeholder: "e.g. free fluid in cul-de-sac",
      },
    ],
  },

  common: {
    condition: { type: ["Biometry", "Biophysical Score"] },
    fields: [
      {
        name: "average_age",
        label: "Average Ultrasonic Age",
        type: "text",
        placeholder: "e.g. 22W 0D",
      },
      { name: "ultrasonic_edd", label: "Ultrasonic EDD", type: "date" },
      {
        name: "efw",
        label: "Estimated Fetal Weight (EFW)",
        type: "text",
        placeholder: "e.g. 520 g",
      },
    ],
  },

  notes: {
    condition: null, // always visible
    fields: [
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
    ],
  },
};
