const express = require("express");
const { createSubCategory, getSubCategoriesByCategory } = require("../controller/subcategory");

const router = express.Router();

// ✅ Ajouter une sous-catégorie avec une image
router.post("/", createSubCategory);

// ✅ Récupérer les sous-catégories d'une catégorie
router.get("/:categoryId", getSubCategoriesByCategory);

module.exports = router;
