const CartItem = require("../model/CartItem");

// 📌 Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ user: req.user._id, product: productId, quantity });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 Récupérer les articles du panier
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 Modifier la quantité d'un produit
exports.updateCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Article non trouvé" });

    cartItem.quantity = req.body.quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
        user: req.user._id,
        _id: req.params.id,
    });
    if (!cartItem) {
        return res.status(404).json({ message: "Article introuvable dans le panier" });
    }
    res.status(200).json({ message: "Article supprimé du panier" });
    
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
