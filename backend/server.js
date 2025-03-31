require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
// const quizRoutes = require("./routes/quiz");
const userRoutes = require("./routes/user");

// create express app
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, res.path);
  next();
});

// routes
// app.use("/quiz", quizRoutes);
app.use("/user", userRoutes);

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB and listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
