const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({ path: "./backend/config/.env" }); // ✅ Charger dotenv dès le début

const app = express();

// ✅ Activer les middlewares
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

// app.use("/",express.static("uploads"));
app.use("/uploads", express.static("uploads"));

// ✅ Configuration CORS (ajout de localhost)
app.use(
  cors({
    origin: "http://localhost:3000", // Autorise uniquement ton frontend
    credentials: true, // Autorise l'envoi des cookies (JWT, sessions, etc.)
    methods: "GET,POST,PUT,DELETE", // Autorise ces méthodes HTTP
    allowedHeaders: "Content-Type,Authorization", // Autorise ces headers
  })
);



// ✅ Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur détectée :", err.message);
  console.error("🔍 Détails :", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur serveur. Veuillez réessayer plus tard.",
  });
});

// Import routes
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");
const sizeRoutes = require("./routes/size");
const user = require("./controller/user");

app.use("/api/v2/user", user);
app.use("/api/v2/categories", categoryRoutes); //  Ajout des routes cat
app.use("/api/v2/subcategories", subCategoryRoutes); //  Ajout des routes subcat
app.use("/api/v2/products", productRoutes); //  Ajout des routes produits
app.use("/api/v2/sizes", sizeRoutes);

// Gestion des erreurs
const errorMiddleware = require("./middleware/Error");

app.use(errorMiddleware);

module.exports = app;
