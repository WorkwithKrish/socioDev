const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const { PaymentModel } = require("../models/payment");
const { MembershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
// Dummy payment route
paymentRouter.post("/payment/create", userAuth, async (request, response) => {
  try {
    const { membershipType } = request.body;
    const { firstName, lastName, emailId } = request.user;
    const order = await instance.orders.create({
      amount: MembershipAmount[membershipType] * 100, // amount in the smallest currency unit ie paisa in INR
      currency: "INR",
      receipt: "receiptNo_1",

      notes: {
        firstName,
        lastName,
        emailId,
        phoneNumber: "9123456789", //what ever need to add
        membershipType: membershipType,
      },
    });

    const payment = new PaymentModel({
      userId: request.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
    });
    const paymentRes = await payment.save();
    response.json({
      ...paymentRes.toJSON(),
      rs_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
  }
});

paymentRouter.post("/payment/webhook", userAuth, async (request, response) => {
  try {
    const signature = request.get["X-Razorpay-Signature"];
    const isValid = validateWebhookSignature(
      JSON.stringify(request.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.log("Not a valid webhook");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");
    // if(req.body.event === "payment.captured") {
    await user.save();
    return response.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ msg: "Internal Server Error" });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

module.exports = { paymentRouter };
