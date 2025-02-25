const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors=require("cors");

app.use(express.json()); 
app.use(cors());
app.use(cookieParser());
// app.use("/",express.static("uploads"));
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./backend/config/.env" });
}

// import routes
const user = require("./controller/user");

app.use("/api/v2/user", user);

// it's for ErrorHandling
// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});



module.exports = app;
