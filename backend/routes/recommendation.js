// const express = require("express");
// const { 
//   saveRecommendations, 
//   getUserRecommendations,
//   getAllRecommendations,
//   deleteUserRecommendations
// } = require("../controller/recommendationController");
// const router = express.Router();

// // Route pour recevoir les recommandations depuis Python
// router.post("/recommendations", saveRecommendations);

// // Route pour récupérer les recommandations d'un utilisateur spécifique
// router.get("/user/:userId", getUserRecommendations);

// // Route pour récupérer toutes les recommandations
// router.get("/", getAllRecommendations);

// // Route pour supprimer les recommandations d'un utilisateur
// router.delete("/user/:userId", deleteUserRecommendations);

// module.exports = router;

const express = require("express");
const { 
  saveRecommendations, 
  getUserRecommendations,
  deleteUserRecommendations
} = require("../controller/recommendationController");
const { isAuthenticated } = require("../middleware/auth");  // Importer le middleware

const router = express.Router();

// Route pour recevoir les recommandations depuis Python
router.post("/recommendations", saveRecommendations);  // Ajout de isAuthenticated ici
//route pour recuperer les recommandations d'un utilisateur
router.get("/user/:userId", isAuthenticated, getUserRecommendations); 
// // Route pour récupérer toutes les recommandations
// router.get("/", isAuthenticated, getAllRecommendations);  // Ajout de isAuthenticated ici

// Route pour supprimer les recommandations d'un utilisateur
router.delete("/user/:userId", isAuthenticated, deleteUserRecommendations);  // Ajout de isAuthenticated ici

module.exports = router;
