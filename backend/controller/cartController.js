 

const CartItem = require("../model/CartItem");

// 📌 Ajouter un produit au panier (sans gestion de quantité)
exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  try {
    // Vérifier si le produit existe déjà dans le panier
    let cartItem = await CartItem.findOne({ user: req.user._id, product: productId });
    
    if (cartItem) {
      // Si le produit existe déjà, on ne fait rien et on renvoie l'article existant
      res.status(200).json(cartItem);
    } else {
      // Si le produit n'existe pas, on le crée sans quantité
      cartItem = new CartItem({ user: req.user._id, product: productId });
      await cartItem.save();
      res.status(201).json(cartItem);
    }
    
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

// 📌 Nous n'avons plus besoin de modifier la quantité, cette fonction peut être supprimée
// ou conservée pour une future utilisation, mais sans la logique de quantité
exports.updateCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Article non trouvé" });
    
    // Plus de mise à jour de quantité ici
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
