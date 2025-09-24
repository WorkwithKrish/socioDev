const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://foreverNode:forever%40Node%23243@forevernode.tiohcqk.mongodb.net/socio-dev"
  );
};

module.exports = connectDB;
