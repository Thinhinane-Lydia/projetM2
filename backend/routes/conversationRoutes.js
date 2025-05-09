const express = require('express');
const router = express.Router();
const conversationController = require('../controller/conversationController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, conversationController.getUserConversations);  // Récupérer toutes les conversations
router.get('/:id', isAuthenticated, conversationController.getConversationById); // Récupérer une conversation spécifique
router.post('/start', isAuthenticated, conversationController.startConversation);  // Démarrer une nouvelle conversation
// Route pour récupérer le dernier message d'une conversation
router.get('/:id/last-message',isAuthenticated, conversationController.getLastMessage);
router.get('/search', isAuthenticated, conversationController.searchUsers);
module.exports = router;