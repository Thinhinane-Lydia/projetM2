const Size = require("../model/Size");
const ErrorHandler = require("../utils/ErrorHandler");
const SubCategory =require("../model/SubCategory");


exports.createSize = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ErrorHandler("Nom de la taille obligatoire", 400));
    }

    const size = await Size.create({ name });
    res.status(201).json({ success: true, size });
  } catch (error) {
    next(error);
  }
};

exports.getSizes = async (req, res, next) => {
  try {
    const sizes = await Size.find();
    res.status(200).json({ success: true, sizes });
  } catch (error) {
    next(error);
  }
};
exports.getSizesBySubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    if (!subCategoryId) {
      return next(new ErrorHandler("L'ID de la sous-catégorie est requis", 400));
    }

    const subCategory = await SubCategory.findById(subCategoryId).populate("sizes");

    if (!subCategory) {
      return next(new ErrorHandler("Sous-catégorie non trouvée", 404));
    }

    res.status(200).json({ success: true, sizes: subCategory.sizes });
  } catch (error) {
    next(error);
  }
};
exports.deleteSize = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Recherche la taille par son ID
    const size = await Size.findById(id);
    if (!size) {
      return next(new ErrorHandler("Taille non trouvée", 404)); // Si la taille n'existe pas
    }

    // Utilise `findByIdAndDelete` au lieu de `remove`
    await Size.findByIdAndDelete(id);  // Cette méthode supprime directement l'élément par ID

    // Réponse de succès
    res.status(200).json({ success: true, message: "Taille supprimée avec succès" });
  } catch (error) {
    next(error);  // Gère les erreurs éventuelles
  }
};

