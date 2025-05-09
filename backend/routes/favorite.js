
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { 
  addFavorite, 
  getUserFavorites, 
  removeFavorite,
  checkFavorite,
  countFavoritesByProduct // Importez la fonction de comptage
} = require('../controller/favoriteController');

// Routes existantes
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


// Route pour récupérer le nombre de favoris pour un produit
router.get('/count/:productId', async (req, res) => {
  try {
    const { productId } = req.params;  // Récupère l'ID du produit depuis les paramètres
    const count = await countFavoritesByProduct(productId);  // Appelle la fonction pour compter les favoris
    res.status(200).json({ success: true, favoriteCount: count });  // Renvoie le nombre de favoris
  } catch (error) {
    console.error("Erreur lors du comptage des favoris :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
});


module.exports = router;