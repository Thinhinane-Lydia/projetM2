const express = require("express");
const router = express.Router();
const Product = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");

// ✅ Ajouter un produit avec validation des champs
router.post("/add", async (req, res) => {
    
    try {
        console.log(req.body);
        const { name, description, category, subCategory, price, brand, material, size, condition, color, images } = req.body;

        // Vérification des champs obligatoires
        if (!name || !description || !category || !subCategory || !price || !brand || !material || !size || !condition || !color || !images) {
            return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis" });
        }

        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: "Produit ajouté avec succès", product: newProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

// ✅ Récupérer tous les produits
router.get("/all", async (req, res, next) => {
    try {
        const products = await Product.find();

        if (!products || products.length === 0) {
            return next(new ErrorHandler("Aucun produit trouvé", 404));
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
});

// ✅ Récupérer un produit par ID
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Ce produit n'existe pas", 404));
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
