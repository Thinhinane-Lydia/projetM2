const express = require("express");
const { createSubCategory, getSubCategoriesByCategory,updateSubCategory,deleteSubCategory } = require("../controller/subcategory");

const router = express.Router();

// ✅ Ajouter une sous-catégorie avec une image
router.post("/", createSubCategory);

// ✅ Récupérer les sous-catégories d'une catégorie
router.get("/:categoryId", getSubCategoriesByCategory);

// Modifier une sous-catégorie
router.put("/:id", updateSubCategory);

// Supprimer une sous-catégorie
router.delete("/:id", deleteSubCategory);
module.exports = router;
