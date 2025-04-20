const express = require('express');
const router = express.Router();
const conversationController = require('../controller/conversationController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, conversationController.getUserConversations);
 
router.get('/:id', isAuthenticated, conversationController.getConversationById);
router.post('/start', isAuthenticated, conversationController.startConversation);

router.get('/search', isAuthenticated, conversationController.searchUsers);
module.exports = router;