// const Product = require("../model/Product");
// const ErrorHandler = require("../utils/ErrorHandler");

// exports.createProduct = async (req, res, next) => {
//   try {
//     const { name, description, category, subCategory, price, brand, material, size, condition, color, images } = req.body;

//     if (!name || !description || !category || !subCategory || !price || !brand || !material || !condition || !color || !images) {
//       return next(new ErrorHandler("Tous les champs obligatoires doivent être remplis", 400));
//     }

//     const newProduct = await Product.create({
//       name, description, category, subCategory, price, brand, material, size, condition, color, images
//     });

//     res.status(201).json({ success: true, product: newProduct });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find().populate("category subCategory size");
//     res.status(200).json({ success: true, products });
//   } catch (error) {
//     next(error);
//   }
// };
const Product = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, subCategory, price, brand, material, size, condition, color, images } = req.body;

    if (!name || !description || !category || !subCategory || !price || !brand || !material || !condition || !color || !images) {
      return next(new ErrorHandler("Tous les champs obligatoires doivent être remplis", 400));
    }

    const newProduct = await Product.create({
      name, description, category, subCategory, price, brand, material, size, condition, color, images
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    let query = {};

    // Appliquer les filtres selon les paramètres reçus
    if (req.query.category) query.category = req.query.category;
    if (req.query.subCategory) query.subCategory = req.query.subCategory;
    if (req.query.size) query.size = req.query.size;
    if (req.query.brand) query.brand = req.query.brand;
    if (req.query.material) query.material = req.query.material;
    if (req.query.color) query.color = req.query.color;
    if (req.query.condition) query.condition = req.query.condition;

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(query).populate("category subCategory size");

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
