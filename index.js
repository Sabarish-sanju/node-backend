const connectDB = require("./config/db.js");
const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api", userRoutes);
app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});
