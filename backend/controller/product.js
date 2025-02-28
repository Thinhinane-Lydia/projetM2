const Product = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");

// ✅ Ajouter un produit
exports.addProduct = async (req, res, next) => {
  try {
    console.log("Requête reçue :", req.body);
    const { name, description, category, subCategory, price, brand, material, size, condition, color,images } = req.body;

    if (!name || !description || !category || !subCategory || !price || !brand || !material || !size || !condition || !color || !images) {
      return next(new ErrorHandler("Veuillez remplir tous les champs obligatoires", 400));
    }

    const newProduct = new Product({
      name,
      description,
      category,
      subCategory,
      price,
      brand,
      material,
      size,
      condition,
      color,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Récupérer tous les produits
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return next(new ErrorHandler("Aucun produit trouvé", 404));
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Récupérer un produit par ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Ce produit n'existe pas", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};
