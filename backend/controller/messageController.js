// const Message = require('../model/Message'); // Ajoute .js

// const Conversation = require('../model/Conversation');



 
// exports.getConversationMessages = async (req, res) => {
//   try { 
//     const { conversationId } = req.params;
//     const userId = req.user._id;

//     console.log(`📩 Récupération des messages pour la conversation: ${conversationId}`);

//     // Vérifier si la conversation existe
//     const conversation = await Conversation.findById(conversationId);
//     if (!conversation) {
//       console.error("❌ ERREUR: Conversation non trouvée !");
//       return res.status(404).json({ success: false, message: "Conversation non trouvée" });
//     }

//     console.log("✅ Conversation trouvée :", conversation);

//     // Vérifier si l'utilisateur est dans la conversation
//     if (!conversation.participants.includes(userId.toString())) {
//       console.error("❌ ERREUR: Utilisateur non autorisé à voir cette conversation !");
//       return res.status(403).json({ success: false, message: "Accès non autorisé à cette conversation" });
//     }

//     // Récupérer les messages
//     const messages = await Message.find({ conversation: conversationId })
//       .sort({ createdAt: 1 }) // Trier par date
//       .populate('senderId', 'username firstName lastName avatar');

//     console.log("📥 Messages récupérés :", messages);

//     return res.status(200).json({ success: true, data: messages });
//   } catch (error) {
//     console.error("❌ ERREUR lors de la récupération des messages :", error);
//     return res.status(500).json({ success: false, message: "Erreur serveur" });
//   }
// };


 

// // Envoyer un nouveau message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { conversationId, text, recipientId } = req.body;
//     const senderId = req.user._id;
    
//     // Validations
//     if (!text || text.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Le message ne peut pas être vide'
//       });
//     }
    
//     if (!isValidObjectId(conversationId) || !isValidObjectId(recipientId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'IDs de conversation ou destinataire invalides'
//       });
//     }
    
//     // Vérifier si la conversation existe
//     const conversation = await Conversation.findById(conversationId);
//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Conversation non trouvée'
//       });
//     }
    
//     // Vérifier si l'expéditeur et le destinataire font partie de la conversation
//     const participantIds = conversation.participants.map(p => p.toString());
//     if (!participantIds.includes(senderId.toString()) || !participantIds.includes(recipientId.toString())) {
//       return res.status(403).json({
//         success: false,
//         message: 'Vous n\'êtes pas autorisé à envoyer un message dans cette conversation'
//       });
//     }
    
//     // Créer et sauvegarder le message
//     const newMessage = new Message({
//       conversation: conversationId,
//       senderId: senderId,
//       receiverId: recipientId,
//       content: text
//     });
    
//     const savedMessage = await newMessage.save();
    
//     // Mettre à jour le dernier message et la date de mise à jour de la conversation
//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastMessage: savedMessage._id,
//       updatedAt: new Date()
//     });
    
//     // Peupler les données de l'expéditeur pour la réponse
//     const populatedMessage = await Message.findById(savedMessage._id)
//       .populate('senderId', 'username firstName lastName avatar');
    
//     return res.status(201).json({
//       success: true,
//       data: populatedMessage
//     });
//   } catch (error) {
//     console.error("❌ Erreur lors de l'envoi du message:", error);
//     return res.status(500).json({
//       success: false,
//       message: 'Erreur serveur'
//     }); 
//   }
// };

// // Supprimer un message avec vérifications supplémentaires
// exports.deleteMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const userId = req.user._id;

//     if (!isValidObjectId(messageId)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "ID de message invalide" 
//       });
//     }

//     // Trouver le message
//     const message = await Message.findById(messageId);
    
//     if (!message) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Message non trouvé" 
//       });
//     }

//     // Vérifier si l'utilisateur est l'expéditeur du message
//     if (message.senderId.toString() !== userId.toString()) {
//       return res.status(403).json({ 
//         success: false, 
//         message: "Vous n'êtes pas autorisé à supprimer ce message" 
//       });
//     }

//     // Vérifier si c'est le dernier message de la conversation
//     const conversation = await Conversation.findById(message.conversation);
//     if (conversation && conversation.lastMessage && 
//         conversation.lastMessage.toString() === messageId) {
//       // Trouver le nouveau dernier message
//       const newLastMessage = await Message.find({ 
//         conversation: message.conversation,
//         _id: { $ne: messageId }  
//       })
//       .sort({ createdAt: -1 })
//       .limit(1);
      
//       // Mettre à jour la référence au dernier message
//       if (newLastMessage.length > 0) {
//         await Conversation.findByIdAndUpdate(message.conversation, {
//           lastMessage: newLastMessage[0]._id
//         });
//       } else {
//         // Aucun autre message, mettre à null
//         await Conversation.findByIdAndUpdate(message.conversation, {
//           lastMessage: null
//         });
//       }
//     }

//     // Supprimer le message
//     await Message.findByIdAndDelete(messageId);
    
//     return res.status(200).json({ 
//       success: true, 
//       message: "Message supprimé avec succès" 
//     });
//   }
//   catch (error) {
//     console.error("❌ Erreur lors de la suppression du message:", error);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Erreur serveur" 
//     });
//   }
// };




// exports.deleteMessageForUser = async (req, res  ) => {
//   try {
//     const { messageId } = req.params;
//     const userId = req.user._id;

//     const message = await Message.findById(messageId);
//     if (!message) {
//       return res.status(404).json({ success: false, message: "Message non trouvé." });
//     }

//     if (message.senderId.toString() === userId.toString()) {
//       message.deletedBySender = true;
//     } else if (message.receiverId.toString  () === userId.toString()) {
//       message.deletedByReceiver = true;
//     } else {
//       return res.status(403).json({ success: false, message: "Vous ne pouvez pas supprimer ce message." });
//     }

//     await message.save();
//     res.status(200).json({ success: true, message: "Message supprimé pour vous." });
//   } catch (error) {
//     console.error("Erreur suppression message:", error);
//     res.status(500).json({ success: false, message: "Erreur serveur." });
//   }
// };
const mongoose = require('mongoose');
const Message = require('../model/Message');
const Conversation = require('../model/Conversation');

/**
 * Valide un ID MongoDB
 * @param {string} id - ID à valider
 * @returns {boolean} - Vrai si l'ID est valide
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Récupère tous les messages d'une conversation
 * @route GET /api/v2/messages/conversation/:conversationId
 */
exports.getConversationMessages = async (req, res) => {
  try { 
    const { conversationId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de conversation invalide" 
      });
    }

    // Vérifier si la conversation existe
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: "Conversation non trouvée" 
      });
    }

    // Vérifier si l'utilisateur est dans la conversation
    const isParticipant = conversation.participants.some(
      p => p.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({ 
        success: false, 
        message: "Accès non autorisé à cette conversation" 
      });
    }

    // Récupérer les messages
    const messages = await Message.find({ 
      conversation: conversationId,
      // N'afficher que les messages non supprimés par l'utilisateur
      $or: [
        { senderId: userId, deletedBySender: { $ne: true } },
        { receiverId: userId, deletedByReceiver: { $ne: true } }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'username firstName lastName avatar');

    // Marquer les messages non lus comme lus
    await Message.updateMany(
      { 
        conversation: conversationId,
        receiverId: userId,
        read: false
      },
      { read: true }
    );

    return res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des messages:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

/**
 * Envoie un nouveau message
 * @route POST /api/v2/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, recipientId } = req.body;
    const senderId = req.user._id;
    
    // Validations
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas être vide'
      });
    }
    
    if (!isValidObjectId(conversationId) || !isValidObjectId(recipientId)) {
      return res.status(400).json({
        success: false,
        message: 'IDs de conversation ou destinataire invalides'
      });
    }
    
    // Vérifier si la conversation existe
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation non trouvée'
      });
    }
    
    // Vérifier si l'expéditeur et le destinataire font partie de la conversation
    const participantIds = conversation.participants.map(p => p.toString());
    if (!participantIds.includes(senderId.toString()) || !participantIds.includes(recipientId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à envoyer un message dans cette conversation'
      });
    }
    
    // Créer et sauvegarder le message
    const newMessage = new Message({
      conversation: conversationId,
      senderId: senderId,
      receiverId: recipientId,
      content: text,
      read: false
    });
    
    const savedMessage = await newMessage.save();
    
    // Mettre à jour le dernier message et la date de mise à jour de la conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id,
      updatedAt: new Date()
    });
    
    // Peupler les données de l'expéditeur pour la réponse
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('senderId', 'username firstName lastName avatar');
    
    return res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    }); 
  }
};

/**
 * Supprime un message
 * @route DELETE /api/v2/messages/:messageId
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de message invalide" 
      });
    }

    // Trouver le message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message non trouvé" 
      });
    }

    // Vérifier si l'utilisateur est l'expéditeur du message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Vous n'êtes pas autorisé à supprimer ce message" 
      });
    }

    // Vérifier si c'est le dernier message de la conversation
    const conversation = await Conversation.findById(message.conversation);
    if (conversation && conversation.lastMessage && 
        conversation.lastMessage.toString() === messageId) {
      // Trouver le nouveau dernier message
      const newLastMessage = await Message.find({ 
        conversation: message.conversation,
        _id: { $ne: messageId }  
      })
      .sort({ createdAt: -1 })
      .limit(1);
      
      // Mettre à jour la référence au dernier message
      if (newLastMessage.length > 0) {
        await Conversation.findByIdAndUpdate(message.conversation, {
          lastMessage: newLastMessage[0]._id
        });
      } else {
        // Aucun autre message, mettre à null
        await Conversation.findByIdAndUpdate(message.conversation, {
          lastMessage: null
        });
      }
    }

    // Supprimer le message
    await Message.findByIdAndDelete(messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: "Message supprimé avec succès" 
    });
  }
  catch (error) {
    console.error("❌ Erreur lors de la suppression du message:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

/**
 * Supprime un message uniquement pour l'utilisateur courant
 * @route PUT /api/v2/messages/:messageId/delete-for-me
 */
exports.deleteMessageForUser = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de message invalide" 
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message non trouvé" 
      });
    }

    const senderIdStr = message.senderId.toString();
    const receiverIdStr = message.receiverId.toString();
    const userIdStr = userId.toString();

    if (senderIdStr === userIdStr) {
      message.deletedBySender = true;
    } else if (receiverIdStr === userIdStr) {
      message.deletedByReceiver = true;
    } else {
      return res.status(403).json({ 
        success: false, 
        message: "Vous ne pouvez pas supprimer ce message" 
      });
    }

    await message.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Message supprimé pour vous" 
    });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du message:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

/**
 * Marque un message comme lu
 * @route PUT /api/v2/messages/:messageId/read
 */
exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de message invalide" 
      });
    }

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message non trouvé" 
      });
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Accès non autorisé" 
      });
    }

    // Marquer comme lu
    message.read = true;
    await message.save();

    return res.status(200).json({ 
      success: true, 
      message: "Message marqué comme lu" 
    });
  } catch (error) {
    console.error("❌ Erreur lors du marquage du message:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};