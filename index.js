const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const path = require("path");

dotenv.config();

// routes
// const authRouter = require("./src/routers/authRouter");
// const userRouter = require("./src/routers/userRouter");



const app = express();
const PORT = process.env.PORT || 4000;




app.use(express.static(path.join(__dirname, "src", "public")));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

// usage routes
// app.use("/api", authRouter);
// app.use("/api", userRouter);




const MONGO_URL = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
