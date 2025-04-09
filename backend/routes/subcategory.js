const express = require("express");
const { createSubCategory, getSubCategoriesByCategory,updateSubCategory,deleteSubCategory } = require("../controller/subcategory");
const upload = require("../multer");
const router = express.Router();




// ✅ Récupérer les sous-catégories d'une catégorie
router.get("/:categoryId", getSubCategoriesByCategory);



// Supprimer une sous-catégorie
router.delete("/:id", deleteSubCategory);


router.post("/", upload.single("image"), createSubCategory);
router.put("/:id", upload.single("image"), updateSubCategory);
module.exports = router;
