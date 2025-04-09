
const Product = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
// const { sendNotification } = require("../utils/notificationService");



// exports.createProduct = catchAsyncError(async (req, res, next) => {
//   if (!req.user || !req.user.id) {
//     return next(new ErrorHandler("Vous devez être connecté pour ajouter un produit", 401));
//   }

//   const { name, description, category, subCategory, price, brand, material, size, condition, color } = req.body;

//   if (!req.files || req.files.length === 0) {
//     return next(new ErrorHandler("Au moins une image est requise", 400));
//   }

//   // ✅ Correction ici : Remplacement des `\` par `/`
//   const images = req.files.map(file => ({ url: file.path.replace(/\\/g, "/") }));

//   // ✅ Création d'un objet `productData` sans `size` par défaut
//   const productData = {
//     name,
//     description,
//     category,
//     subCategory,
//     price,
//     brand,
//     material,
//     condition,
//     color,
//     images,
//     seller: req.user.id,
//   };

//   // ✅ Ajout de `size` seulement s'il est défini et valide
//   if (size) {
//     productData.size = size;
//   }

//   // ✅ Enregistrement du produit dans MongoDB
//   const product = await Product.create(productData);

//   res.status(201).json({ success: true, product });
// });
exports.createProduct = catchAsyncError(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new ErrorHandler("Vous devez être connecté pour ajouter un produit", 401));
  }

  const { name, description, category, subCategory, price, brand, material, size, condition, color } = req.body;

  // Vérifiez que des images ont été envoyées
  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("Au moins une image est requise", 400));
  }

  // Débogage
  console.log("Fichiers reçus:", req.files.length);
  console.log("Premier fichier:", req.files[0]);

  // Création du tableau d'images avec le bon format de chemin
  const images = req.files.map(file => ({ 
    url: file.path.replace(/\\/g, "/") 
  }));

  // Création de l'objet produit
  const productData = {
    name,
    description,
    category,
    subCategory,
    price,
    brand,
    material,
    condition,
    color,
    images,
    seller: req.user.id,
  };

  // Ajout de size seulement si défini
  if (size) {
    productData.size = size;
  }

  // Création du produit dans la base de données
  const product = await Product.create(productData);

  res.status(201).json({ success: true, product });
});


// ✅ Récupérer tous les produits avec filtres (y compris l'utilisateur vendeur)
exports.getProducts = catchAsyncError(async (req, res, next) => {
  try {
    let query = {};

    // ✅ Ajout de cette ligne pour filtrer par vendeur
    if (req.query.seller) query.seller = req.query.seller;

    // ✅ Vérification et application des filtres (évite undefined)
    if (req.query.category) query.category = req.query.category;
    if (req.query.subCategory) query.subCategory = req.query.subCategory;
    if (req.query.size) query.size = req.query.size;
    if (req.query.brand) query.brand = req.query.brand;
    if (req.query.material) query.material = req.query.material;
    if (req.query.color) query.color = req.query.color;
    if (req.query.condition) query.condition = req.query.condition;

    // ✅ Vérification et application du filtre de prix
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // ✅ Récupérer les produits avec leurs relations (catégorie, sous-catégorie, taille, vendeur)
    const products = await Product.find(query)
      .populate("category subCategory size seller", "name email avatar");

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
});

// ✅ Supprimer un produit (seulement par son propriétaire)
// exports.deleteProduct = catchAsyncError(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//       return next(new ErrorHandler("Produit non trouvé", 404));
//   }

//   // Vérifie si l'utilisateur connecté est le propriétaire du produit
//   if (product.seller.toString() !== req.user.id) {
//       return next(new ErrorHandler("Vous n'avez pas l'autorisation de supprimer ce produit", 403));
//   }

//   await product.deleteOne();
//   res.status(200).json({ success: true, message: "Produit supprimé avec succès" });
// });
// ✅ Supprimer un produit (par son propriétaire ou un admin)
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Produit non trouvé", 404));
  }

  // Vérifie si l'utilisateur connecté est le propriétaire du produit OU un administrateur
  if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorHandler("Vous n'avez pas l'autorisation de supprimer ce produit", 403));
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Produit supprimé avec succès" });
});
// // ✅ Supprimer un produit (par son propriétaire ou un admin)
// exports.deleteProduct = catchAsyncError(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHandler("Produit non trouvé", 404));
//   }

//   // Vérifier si l'utilisateur connecté est le propriétaire du produit ou un administrateur
//   // On ne va pas le vérifier ici car la vérification sera effectuée au niveau du contrôleur utilisateur
//   // (lorsque l'utilisateur supprime tous les produits associés).

//   await product.deleteOne();  // Suppression du produit

//   console.log(`Produit supprimé : ${product.name}`);
//   res.status(200).json({ success: true, message: `Produit ${product.name} supprimé avec succès` });
// });


exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Produit non trouvé", 404));
  }

  // Vérifie si l'utilisateur connecté est le propriétaire du produit
  if (product.seller.toString() !== req.user.id) {
    return next(new ErrorHandler("Vous n'avez pas l'autorisation de modifier ce produit", 403));
  }

  // Mise à jour des champs du produit
  const { name, description, price, category, subCategory, brand, material, size, condition, color } = req.body;

  // Si des images ont été envoyées
  if (req.files && req.files.length > 0) {
    // Débogage
    console.log("Fichiers reçus lors de la mise à jour:", req.files.length);
    console.log("Premier fichier:", req.files[0]);
    
    // Mise à jour des images
    product.images = req.files.map(file => ({ 
      url: file.path.replace(/\\/g, "/") 
    }));
  }

  // Mise à jour des autres champs
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (subCategory) product.subCategory = subCategory;
  if (brand) product.brand = brand;
  if (material) product.material = material;
  if (size) product.size = size;
  if (condition) product.condition = condition;
  if (color) product.color = color;

  await product.save();
  res.status(200).json({ success: true, message: "Produit mis à jour avec succès", product });
});