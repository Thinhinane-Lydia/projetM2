const express = require('express');
const { createOrder } = require('../controller/orderController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Route pour passer une commande
router.post('/checkout', isAuthenticated, createOrder);

module.exports = router;
