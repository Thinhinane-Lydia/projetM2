const express = require("express");
const { getCart, addToCart, removeFromCart, updateCartItem } = require("../controller/cartController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/", isAuthenticated, getCart);  // ✅ Récupérer le panier
router.post("/", isAuthenticated, addToCart);  // ✅ Ajouter au panier
router.delete("/:id", isAuthenticated, removeFromCart);  // ✅ Supprimer un article
router.put("/:id", isAuthenticated, updateCartItem);  // ✅ Modifier quantité

module.exports = router;
