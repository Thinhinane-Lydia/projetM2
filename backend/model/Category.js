const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true } // URL de l'image
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;


