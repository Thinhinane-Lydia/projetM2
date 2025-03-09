const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Size" }], // Tailles associées
  image: { type: String, required: true } // 🔥 Ajout de l'image
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
