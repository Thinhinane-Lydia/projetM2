// const SubCategory = require("../model/SubCategory");
// const ErrorHandler = require("../utils/ErrorHandler");

// // ✅ Ajouter une sous-catégorie avec une image
// exports.createSubCategory = async (req, res, next) => {
//   try {
//     const { name, category, sizes, image } = req.body;

//     if (!name || !category || !image) {
//       return next(new ErrorHandler("Nom, catégorie et image sont obligatoires", 400));
//     }

//     const subCategory = await SubCategory.create({ name, category, sizes, image });

//     res.status(201).json({ success: true, subCategory });
//   } catch (error) {
//     next(error);
//   }
// };

// // ✅ Récupérer les sous-catégories par catégorie
// exports.getSubCategoriesByCategory = async (req, res, next) => {
//   try {
//     const subCategories = await SubCategory.find({ category: req.params.categoryId }).populate("sizes");
//     res.status(200).json({ success: true, subCategories });
//   } catch (error) {
//     next(error);
//   }
// };
// // Modifier une sous-catégorie
// exports.updateSubCategory = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, category, sizes, image } = req.body;

//     const subCategory = await SubCategory.findById(id);
//     if (!subCategory) {
//       return next(new ErrorHandler("Sous-catégorie non trouvée", 404));
//     }

//     subCategory.name = name || subCategory.name;
//     subCategory.category = category || subCategory.category;
//     subCategory.sizes = sizes || subCategory.sizes;
//     subCategory.image = image || subCategory.image;

//     await subCategory.save();
//     res.status(200).json({ success: true, subCategory });
//   } catch (error) {
//     next(error);
//   }
// };

// // Supprimer une sous-catégorie
// exports.deleteSubCategory = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const subCategory = await SubCategory.findById(id);
//     if (!subCategory) {
//       return next(new ErrorHandler("Sous-catégorie non trouvée", 404));
//     }

//     await SubCategory.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Sous-catégorie supprimée avec succès" });
//   } catch (error) {
//     next(error);
//   }
// };

const SubCategory = require("../model/SubCategory");
const Category = require("../model/Category");
const Size = require("../model/Size");
const ErrorHandler = require("../utils/ErrorHandler");

// Ajouter une sous-catégorie avec une catégorie et des tailles
exports.createSubCategory = async (req, res, next) => {
  try {
    const { name, category, sizes, image } = req.body;

    // Vérifier si la catégorie et les tailles existent
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return next(new ErrorHandler("Catégorie non trouvée", 404));
    }

    const foundSizes = await Size.find({ '_id': { $in: sizes } });
    if (sizes && foundSizes.length !== sizes.length) {
      return next(new ErrorHandler("Une ou plusieurs tailles sont invalides", 400));
    }

    // Créer la sous-catégorie
    const subCategory = await SubCategory.create({ name, category, sizes, image });

    res.status(201).json({ success: true, subCategory });
  } catch (error) {
    next(error);
  }
};

// Récupérer les sous-catégories par catégorie
exports.getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId }).populate("sizes");
    res.status(200).json({ success: true, subCategories });
  } catch (error) {
    next(error);
  }
};

// Modifier une sous-catégorie
exports.updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, sizes, image } = req.body;

    // Vérifie si la sous-catégorie existe
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return next(new ErrorHandler("Sous-catégorie non trouvée", 404));
    }

    // Vérifie si la catégorie existe
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return next(new ErrorHandler("Catégorie non trouvée", 404));
    }

    // Vérifie si les tailles existent
    const foundSizes = await Size.find({ '_id': { $in: sizes } });
    if (sizes && foundSizes.length !== sizes.length) {
      return next(new ErrorHandler("Une ou plusieurs tailles sont invalides", 400));
    }

    // Mise à jour de la sous-catégorie
    subCategory.name = name || subCategory.name;
    subCategory.category = category || subCategory.category;
    subCategory.sizes = sizes || subCategory.sizes;
    subCategory.image = image || subCategory.image;

    await subCategory.save();
    res.status(200).json({ success: true, subCategory });
  } catch (error) {
    next(error);
  }
};

// Supprimer une sous-catégorie
exports.deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Recherche la sous-catégorie par son ID
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return next(new ErrorHandler("Sous-catégorie non trouvée", 404));
    }

    // Supprimer la sous-catégorie
    await SubCategory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Sous-catégorie supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};
