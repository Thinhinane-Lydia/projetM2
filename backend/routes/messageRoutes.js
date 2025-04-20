const express = require('express');
const router = express.Router();
const Message = require('../model/Message');
const messageController = require('../controller/messageController');
const { isAuthenticated } = require('../middleware/auth');


// ✅ Récupérer les messages d'une conversation
router.get('/conversation/:conversationId', isAuthenticated, messageController.getConversationMessages);



// ✅ Envoyer un message
router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { conversationId, text, recipientId, productId } = req.body;
        console.log("📩 Message reçu :", req.body);

        // Correction: Renommer `text` en `content` pour correspondre au modèle
        const content = text; 

        // Vérifier que toutes les données requises sont bien présentes
        if (!conversationId || !content || !recipientId) {
            return res.status(400).json({ success: false, message: "Données manquantes" });
        }

        // Création du message
        const message = new Message({
            conversation: conversationId, // Ajoutez cette ligne !
            senderId: req.user._id,// Utiliser l'utilisateur connecté
            receiverId: recipientId,
            content,
            productId: productId || null
        });

        // Sauvegarde du message
        await message.save();

        // Peupler les informations du sender
        const populatedMessage = await Message.findById(message._id).populate("senderId", "name username email avatar") .populate("receiverId", "name username email avatar");

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        console.error("❌ Erreur serveur lors de l'envoi du message :", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

// ✅ Supprimer un message
router.delete('/:messageId', isAuthenticated, messageController.deleteMessageForUser);

// Supprimer une conversation
router.delete('/conversation/:conversationId', isAuthenticated, messageController.deleteConversation);

module.exports = router;
