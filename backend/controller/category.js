
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
