const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const { run } = require("./sentEmail");
// Schedule mail to sent every 8am
cron.schedule("0 8 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const dayStart = startOfDay(yesterday);
  const dayEnd = endOfDay(yesterday);

  try {
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: { $gte: dayStart, $lte: dayEnd },
    }).populate("fromUserId, toUserId");

    const emailList = [
      ...new Set(pendingRequests?.map((req) => req.toUserId.email)),
    ];

    emailList.forEach((email) => {
      const emailResponse = run("Request sent", "This is a reminder");
      console.log("Email to be sent to: ", emailResponse);
    });
  } catch (err) {
    console.error("Error in cron job: ", err);
  }
});
