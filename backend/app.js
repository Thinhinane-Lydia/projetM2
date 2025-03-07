const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./backend/config/.env" }); // ✅ Charger dotenv dès le début

const app = express();

// ✅ Activer les middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Configuration CORS (ajout de localhost)
app.use(cors({
  origin: 
    "http://localhost:3000", // 🔹 Développement local
     
  
  credentials: true
}));

// ✅ Servir les fichiers statiques
app.use("/uploads", express.static("uploads"));

// ✅ Importation des routes
const user = require("./controller/user");
app.use("/api/v2/user", user);

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
