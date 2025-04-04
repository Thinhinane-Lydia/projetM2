const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence à l'utilisateur
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Référence au produit favori
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
