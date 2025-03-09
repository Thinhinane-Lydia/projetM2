const SubCategory = require("../model/SubCategory");
const ErrorHandler = require("../utils/ErrorHandler");

// ✅ Ajouter une sous-catégorie avec une image
exports.createSubCategory = async (req, res, next) => {
  try {
    const { name, category, sizes, image } = req.body;

    if (!name || !category || !image) {
      return next(new ErrorHandler("Nom, catégorie et image sont obligatoires", 400));
    }

    const subCategory = await SubCategory.create({ name, category, sizes, image });

    res.status(201).json({ success: true, subCategory });
  } catch (error) {
    next(error);
  }
};

// ✅ Récupérer les sous-catégories par catégorie
exports.getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId }).populate("sizes");
    res.status(200).json({ success: true, subCategories });
  } catch (error) {
    next(error);
  }
};
