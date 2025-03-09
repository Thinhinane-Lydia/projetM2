

const ErrorHandler = require("../utils/ErrorHandler.js");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resources not found with this id.. Invalid ${err.path}`, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate key ${Object.keys(err.keyValue)} Entered`, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
