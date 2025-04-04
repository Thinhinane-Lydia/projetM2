const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth'); // ✅ Importation correcte
const { 
  addFavorite, 
  getUserFavorites, 
  removeFavorite,
  checkFavorite
} = require('../controller/favoriteController');

// Toutes ces routes nécessitent une authentification
router.post('/', isAuthenticated, (req, res, next) => {
  console.log("🔹 Requête reçue pour ajouter aux favoris, utilisateur:", req.user?.id);
  next();
}, addFavorite);

router.get('/', isAuthenticated, (req, res, next) => {
  console.log("🔹 Requête reçue pour récupérer les favoris, utilisateur:", req.user?.id);
  next();
}, getUserFavorites);

router.delete('/:productId', isAuthenticated, (req, res, next) => {
  console.log("🔹 Requête reçue pour supprimer un favori, utilisateur:", req.user?.id, "Produit:", req.params.productId);
  next();
}, removeFavorite);

router.get('/check/:productId', isAuthenticated, checkFavorite);

module.exports = router;
