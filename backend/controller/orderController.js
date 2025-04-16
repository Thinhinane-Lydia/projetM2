const Order = require('../model/Order');
const CartItem = require('../model/CartItem');

exports.createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    // Récupérer les articles du panier
    const cartItems = await CartItem.find({ user: req.user._id }).populate('product');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Votre panier est vide" });
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price  , 0);

    // Créer une nouvelle commande
    const newOrder = new Order({
      user: req.user._id,
      items: cartItems.map(item => ({
        product: item.product._id,
       
        price: item.product.price
      })),
      total,
      shippingAddress,
      status: 'En traitement'
    });

    await newOrder.save();

    // Vider le panier après la commande
    await CartItem.deleteMany({ user: req.user._id });

    res.status(201).json({ message: 'Commande passée avec succès', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
