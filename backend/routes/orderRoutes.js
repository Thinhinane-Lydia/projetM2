const express = require('express');
const { createOrder ,getUserOrders,getAllOrders,updateOrderStatus} = require('../controller/orderController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Route pour passer une commande
router.post('/checkout', isAuthenticated, createOrder);
//Route pour recuperer les commandes 
router.get("/user-orders", isAuthenticated, getUserOrders);
// Route pour récupérer toutes les commandes pour l'admin
router.get("/all", isAuthenticated, getAllOrders);
// Dans orderRoutes.js
router.put('/update-status/:orderId', isAuthenticated, updateOrderStatus);

module.exports = router;
