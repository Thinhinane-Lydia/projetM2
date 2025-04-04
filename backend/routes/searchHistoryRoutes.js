// routes/searchHistoryRoutes.js
const express = require("express");
const { saveSearchHistory, getSearchHistory } = require("../controller/searchHistoryController");
const { isAuthenticated } = require("../middleware/auth"); // Middleware pour vérifier l'authentification
const router = express.Router();

// Route pour enregistrer une recherche avec des produits associés
router.post("/add", isAuthenticated, saveSearchHistory);

// Route pour récupérer l'historique des recherches d'un utilisateur
router.get("/history", isAuthenticated, getSearchHistory);

module.exports = router;
