require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./utils/cronJobs");
const allowedOrigins = ["http://localhost:5173", "http://example.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const { paymentRouter } = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log(
        "Server is successfully listening on port " + process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
