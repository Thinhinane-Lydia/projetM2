const Order = require('../model/Order');
const CartItem = require('../model/CartItem');



exports.createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    // Récupérer les articles du panier avec produit + vendeur
    const cartItems = await CartItem.find({ user: req.user._id }).populate('product');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Votre panier est vide" });
    }

    let total = 0;
    const items = [];

    for (const item of cartItems) {
      const product = item.product;

      if (!product) continue;

      // Vérifie si déjà vendu
      if (product.etat === "vendu") {
        return res.status(400).json({ message: `Le produit ${product.name} est déjà vendu.` });
      }

      // Marquer le produit comme vendu
      product.etat = "vendu";
      await product.save();

      // Ajouter à la commande
      items.push({
        product: product._id,
        price: product.price,
        seller: product.seller
      });

      total += product.price;
    }

    const newOrder = new Order({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      status: 'En traitement'
    });

    await newOrder.save();

    // Vider le panier après commande
    await CartItem.deleteMany({ user: req.user._id });

    res.status(201).json({ message: 'Commande passée avec succès', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer les commandes d'un utilisateur
// exports.getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate("items.product") // Cela va inclure les détails des produits dans les commandes
//       .populate("items.seller"); // Cela va inclure les informations sur le vendeur

//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
//   }
// };
exports.getUserOrders = async (req, res) => {
  try {
      // Récupérer les commandes avec les détails des produits et vendeurs
      const orders = await Order.find({ user: req.user.id })
          .populate({
              path: 'items.product',
              select: 'name description price images' // Inclure les images ici
          })
          .populate('items.seller', 'username email profileImage')
          .sort({ createdAt: -1 });

      res.status(200).json({
          success: true,
          orders
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      res.status(500).json({
          success: false,
          message: "Erreur lors de la récupération des commandes",
          error: error.message
      });
  }
};


// Récupérer toutes les commandes (pour l'admin)

exports.getAllOrders = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé. Réservé aux administrateurs."
      });
    }

    // Récupérer toutes les commandes avec les détails des produits, vendeurs et acheteurs
    const orders = await Order.find()
      .populate({
        path: 'items.product',
        select: 'name description price images'
      })
      .populate('items.seller', 'name email avatar')
      .populate('user', 'name email avatar') // Assurez-vous que cette ligne est présente pour récupérer l'acheteur
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
      error: error.message
    });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;  // Récupérer l'ID de la commande
  const { status } = req.body;     // Récupérer le nouveau statut (doit être "Reçu")

  // Vérification que le statut est "Reçu"
  if (status !== 'Reçu') {
    return res.status(400).json({ message: "Statut invalide. Le statut doit être 'Reçu'." });
  }

  try {
    // Chercher la commande par son ID
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    // Vérifier que l'utilisateur connecté est bien celui qui a passé la commande
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier cette commande." });
    }

    // Mettre à jour le statut de la commande
    order.status = status;

    // Mettre à jour le statut des produits dans la commande à "Reçu"
    for (let item of order.items) {
      const product = item.product;
      product.etat = "reçu";  // Marquer le produit comme "Reçu"
      await product.save();
    }

    // Sauvegarder la commande mise à jour
    await order.save();

    res.status(200).json({
      success: true,
      message: "Statut de la commande mis à jour avec succès, produits marqués comme 'Reçu'",
      order
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la commande:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

