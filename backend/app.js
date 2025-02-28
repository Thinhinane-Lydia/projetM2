const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(cookieParser());


// app.use("/",express.static("uploads"));
app.use("/uploads", express.static("uploads"));



// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./backend/config/.env" });
}

// Import routes
const user = require("./controller/user");
const product=require("./controller/product");
const productRoutes = require("./routes/product");

app.use("/api/v2/user", user);
app.use("/api/v2/products", productRoutes); // ✅ Ajout des routes produits


// Gestion des erreurs
app.use(ErrorHandler);

module.exports = app;
