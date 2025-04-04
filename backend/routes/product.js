// const express = require("express");
// const { createProduct, getProducts } = require("../controller/product");

// const router = express.Router();
// router.post("/", createProduct);
// router.get("/", getProducts);

// module.exports = router;
const express = require("express");
const { createProduct, getProducts ,deleteProduct,updateProduct} = require("../controller/product");
const { isAuthenticated } = require("../middleware/auth"); // 🔥 Vérification de l'authentification
const upload = require("../multer"); // votre module multer
const router = express.Router();


router.post("/create", isAuthenticated,upload.array("images", 5), createProduct); // 🔥 Seuls les utilisateurs connectés peuvent ajouter un produit
router.get("/", getProducts);
router.delete("/:id", isAuthenticated, deleteProduct);
router.put("/:id", isAuthenticated, upload.array("images", 5), updateProduct);

module.exports = router;
