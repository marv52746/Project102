const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const billingSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "patient", required: true },
  appointment: { type: ObjectId, ref: "appointment" },
  items: [
    {
      description: String,
      cost: Number,
    },
  ],
  total_amount: Number,
  status: {
    type: String,
    enum: ["unpaid", "paid", "partial"],
    default: "unpaid",
  },
  payment_method: String,
  date_issued: { type: Date, default: Date.now },
  date_paid: Date,
});

const BillingDb = mongoose.model("billing", billingSchema);
module.exports = { BillingDb };
