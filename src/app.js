require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const { InitializeSocketIO } = require("./utils/socketIO");
const { connectDB } = require("./config/database");
const { paymentRouter } = require("./routes/payment");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

require("./utils/cronJobs");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devkp.xyz"], // allow frontend(s)
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you are sending cookies/JWT
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

InitializeSocketIO(server);
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log(
        "Server is successfully listening on port " + process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
