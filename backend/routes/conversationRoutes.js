const express = require('express');
const router = express.Router();
const conversationController = require('../controller/conversationController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, conversationController.getUserConversations);  // Récupérer toutes les conversations
router.get('/:id', isAuthenticated, conversationController.getConversationById); // Récupérer une conversation spécifique
router.post('/start', isAuthenticated, conversationController.startConversation);  // Démarrer une nouvelle conversation


module.exports = router;