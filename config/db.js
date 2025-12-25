const { default: mongoose } = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.CONNECTION_STRING)
      .then(() => console.log("db Connected"))
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
