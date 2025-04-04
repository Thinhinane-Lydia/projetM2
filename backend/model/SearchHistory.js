// models/SearchHistory.js
const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Référence à l'utilisateur qui effectue la recherche
  },
  searchTerm: {
    type: String,
    required: true, // Le terme de recherche
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",  // Référence au produit recherché
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Enregistrer la date et l'heure de la recherche
  },
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
