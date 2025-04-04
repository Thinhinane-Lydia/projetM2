
const Category = require("../model/Category");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return next(new ErrorHandler("Nom et image obligatoires", 400));
    }

    const category = await Category.create({ name, image });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
// Modifier une catégorie
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    // Vérifie si la catégorie existe
    const category = await Category.findById(id);
    if (!category) {
      return next(new ErrorHandler("Catégorie non trouvée", 404));
    }

    // Met à jour les champs de la catégorie
    category.name = name || category.name;
    category.image = image || category.image;

    await category.save();

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};
// Supprimer une catégorie
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Recherche la catégorie par son ID
    const category = await Category.findById(id);
    if (!category) {
      return next(new ErrorHandler("Catégorie non trouvée", 404));
    }

    // Supprime la catégorie avec `findByIdAndDelete`
    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Catégorie supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};
