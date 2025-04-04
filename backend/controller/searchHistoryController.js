// controllers/searchHistoryController.js
const SearchHistory = require("../model/SearchHistory");
const Product = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");

// ✅ Enregistrer une recherche avec les produits associés
exports.saveSearchHistory = async (req, res, next) => {
  try {
    const { searchTerm, productIds } = req.body;

    if (!searchTerm) {
      return next(new ErrorHandler("Le terme de recherche est requis.", 400));
    }

    // Vérifier que les produits associés existent
    const products = await Product.find({ '_id': { $in: productIds } });

    if (products.length !== productIds.length) {
      return next(new ErrorHandler("Certains produits n'ont pas été trouvés.", 404));
    }

    // Créer un nouvel enregistrement pour l'historique des recherches
    const searchHistory = new SearchHistory({
      user: req.user.id, // Utilisateur connecté
      searchTerm,
      products: productIds, // Lier les produits à la recherche
    });

    // Sauvegarder dans la base de données
    await searchHistory.save();

    res.status(201).json({
      success: true,
      message: "Recherche enregistrée avec succès",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Récupérer l'historique des recherches d'un utilisateur avec les produits associés
exports.getSearchHistory = async (req, res, next) => {
  try {
    const searchHistory = await SearchHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Trier par date, les recherches les plus récentes en premier
      .limit(10) // Limiter à 10 recherches récentes
      .populate("products", "name description price"); // Récupérer les informations des produits recherchés

    res.status(200).json({
      success: true,
      searchHistory,
    });
  } catch (error) {
    next(error);
  }
};
