require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
