const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    receipt: { type: String, required: true },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      emailId: { type: String },
      phoneNumber: { type: String },
      membershipType: { type: String },
    },
  },
  { timestamps: true }
);
const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports = { PaymentModel };
