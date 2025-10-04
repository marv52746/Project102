const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// Helper sub-schema for biometry
const BiometryField = {
  measurement: { type: String }, // e.g. "5.02 cm"
  age_equiv: { type: String }, // e.g. "21W 1D"
};

const ultrasoundSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  // General Info
  type: { type: String, required: true }, // e.g., OB Ultrasound, TVS, Biophysical Score, Pelvic, Abdominal
  type_custom: { type: String },
  date: { type: Date, default: Date.now },
  radiologist: { type: String },
  notes: { type: String },
  image_urls: [{ type: String }], // allow multiple image attachments

  // OB / Pregnancy Data
  ob_data: {
    lmp: { type: Date },
    edd: { type: Date },
    aog: { type: String }, // ex. "21W 4D"
    gravida_para: { type: String }, // G1P0, G3P1(1011)
  },

  // TRANSVAGINAL ULTRASOUND - OB
  early_pregnancy: {
    gestational_sac: {
      size: { type: String }, // e.g. "2.0 cm"
      age_equiv: { type: String }, // e.g. "6W 3D"
    },
    crown_rump_length: {
      size: { type: String }, // e.g. "1.14 cm"
      age_equiv: { type: String }, // e.g. "7W 2D"
    },
    yolk_sac: { type: String }, // present / absent / size
    fetal_heart_rate: { type: String }, // e.g. "165 bpm"
    average_ultrasonic_age: { type: String }, // e.g. "7W 2D"
    ultrasonic_edc: { type: Date }, // e.g. "2026-05-14"

    uterus: { type: String }, // "anteverted"
    adnexae: {
      right_ovary: { type: String }, // "normal"
      left_ovary: { type: String }, // "normal"
    },
    cervix: {
      dimensions: { type: String }, // "2.79 x 2.12 x 2.47 cm"
      volume: { type: String }, // "7.64 ml"
      notes: { type: String }, // "long and closed"
    },
  },

  // Fetal Survey
  fetal_survey: {
    presentation: { type: String }, // cephalic, breech
    fetal_sex: { type: String }, // male/female
    number_of_fetus: { type: String }, // singleton, twins
    placenta_grade: { type: String },
    placenta_position: { type: String },
    fetal_heart_rate: { type: String },
    amniotic_fluid: {
      svp: { type: String },
      afi: {
        q1: { type: String }, // quadrant 1
        q2: { type: String }, // quadrant 2
        q3: { type: String }, // quadrant 3
        q4: { type: String }, // quadrant 4
        total: { type: String }, // total AFI
      },
    },
  },

  // Fetal Biometry
  fetal_biometry: {
    bpd: BiometryField, // Biparietal Diameter
    ofd: BiometryField, // Occipito-Frontal Diameter
    hc: BiometryField, // Head Circumference
    ac: BiometryField, // Abdominal Circumference
    fl: BiometryField, // Femur Length
  },

  // Biophysical Profile (BPS)
  biophysical_profile: {
    fetal_breathing: { type: Number }, // 0 or 2
    fetal_tone: { type: Number },
    fetal_movement: { type: Number },
    afi_score: { type: Number },
    total: { type: Number },
  },

  // TRANSVAGINAL ULTRASOUND - Gyne
  // Gynecological / TVS Findings
  gyn_findings: {
    cervix: {
      dimensions: { type: String }, // e.g., "2.47 x 1.91 x 2.10 cm"
      notes: { type: String }, // nabothian cysts, long and closed
    },
    uterus: {
      dimensions: { type: String },
      orientation: { type: String }, // anteverted, retroverted
      notes: { type: String }, // homogeneous, adenomyosis
      wall_thickness: {
        anterior: { type: String },
        posterior: { type: String },
      },
    },
    endometrium: {
      thickness: { type: String },
      notes: { type: String },
    },
    right_ovary: {
      dimensions: { type: String },
      volume: { type: String },
      notes: { type: String }, // e.g., cyst
    },
    left_ovary: {
      dimensions: { type: String },
      volume: { type: String },
      notes: { type: String },
    },
    others: {
      notes: { type: String },
    },
  },

  average_age: { type: String },
  ultrasonic_edd: { type: Date },
  efw: { type: String }, // Estimated Fetal Weight

  // Impression
  others: { type: String }, // detailed description
  impression: { type: String }, // summary / conclusion

  radio_fee: { type: String }, // Radiologist Fee
  chief_complaint: { type: String },

  // Audit Trail
  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const UltrasoundDb = mongoose.model("ultrasound", ultrasoundSchema);
module.exports = { UltrasoundDb };
