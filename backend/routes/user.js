const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../multer");
const router = express.Router();

// Importer le contrôleur de profil utilisateur
const { 
    getUserProfile, 
    
} = require("../controller/user");

// Route pour récupérer le profil utilisateur (protégé par l'authentification)
router.get("/profile", isAuthenticated, getUserProfile);



module.exports = router;