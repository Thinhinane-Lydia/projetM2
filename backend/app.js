const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
 
require("dotenv").config({ path: "./backend/config/.env" }); // ✅ Charger dotenv dès le début

const app = express();

app.use(express.json());
 
app.use(cookieParser());


// app.use("/",express.static("uploads"));
app.use("/uploads", express.static("uploads"));



// ✅ Configuration CORS (ajout de localhost)
app.use(cors({
  origin: "http://localhost:3000",  // Autorise uniquement ton frontend
  credentials: true,  // Autorise l'envoi des cookies (JWT, sessions, etc.)
  methods: "GET,POST,PUT,DELETE",  // Autorise ces méthodes HTTP
  allowedHeaders: "Content-Type,Authorization" // Autorise ces headers
}));

// Import routes
const user = require("./controller/user");
const product=require("./controller/product");
const productRoutes = require("./routes/product");
app.use("/api/v2/user", user);
app.use("/api/v2/products", productRoutes); // ✅ Ajout des routes produits


// Gestion des erreurs
app.use(ErrorHandler);

// ✅ Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur détectée :", err.message);
  console.error("🔍 Détails :", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur serveur. Veuillez réessayer plus tard."
  });
});

module.exports = app;
