const mongoose = require("mongoose");
const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const User = require('../model/user');

/**
 * Valide un ID MongoDB
 * @param {string} id - ID à valider
 * @returns {boolean} - Vrai si l'ID est valide
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur invalide"
      });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await Conversation.find({
      participants: userIdObj
    })
    .populate('participants', 'name username firstName lastName avatar email isOnline')
    .populate({
      path: 'lastMessage',
      select: 'content senderId receiverId createdAt read' // Populer les détails du dernier message
      // Note : `lastMessage` est une référence vers le modèle `Message`
    })
    .sort({ updatedAt: -1 });  // Tri par date de mise à jour de la conversation

    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des conversations:", error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des conversations'
    });
  }
};


exports.startConversation = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user._id;

  if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID utilisateur requis" 
      });
  }

  try {
      if (!isValidObjectId(userId)) {
          return res.status(400).json({ 
            success: false, 
            message: "ID utilisateur invalide" 
          });
      }

      if (userId.toString() === currentUserId.toString()) {
          return res.status(400).json({ 
            success: false, 
            message: "Impossible de démarrer une conversation avec soi-même" 
          });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
          return res.status(404).json({ 
            success: false, 
            message: "Utilisateur introuvable" 
          });
      }

      let conversation = await Conversation.findOne({ 
          participants: { $all: [currentUserId, userId], $size: 2 }
      });

      if (!conversation) {
          conversation = new Conversation({ 
            participants: [currentUserId, userId] 
          });
          await conversation.save();
      }

      return res.status(200).json({ 
        success: true, 
        conversationId: conversation._id 
      });
  } catch (error) {
      console.error("❌ Erreur lors du démarrage de la conversation:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
      });
  }
};


/**
 * Récupère une conversation par son ID
 * @route GET /api/v2/conversations/:id
 */
exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "ID de conversation invalide" 
        });
    }

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name username firstName lastName avatar isOnline');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation non trouvée'
      });
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    if (!conversation.participants.some(p => p._id.toString() === userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation'
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la conversation:", error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Fonction de recherche d'utilisateurs
exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "La requête de recherche est vide",
    });
  }

  try {
    // Recherche d'utilisateurs dont le nom ou le prénom correspond à la requête
    const users = await User.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { firstName: new RegExp(query, 'i') },
        { lastName: new RegExp(query, 'i') },
      ]
    })
      .select("name firstName lastName avatar email _id")  // Sélectionner les champs nécessaires
      .limit(10);  // Limiter à 10 résultats maximum

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la recherche d'utilisateurs:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recherche d'utilisateurs",
    });
  }
};
exports.sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.body.receiverId;

  // Vérifier si l'utilisateur est bloqué
  const sender = await User.findById(senderId);
  if (sender.blockedUsers.includes(receiverId)) {
    return res.status(403).json({
      success: false,
      message: "Vous avez bloqué cet utilisateur, vous ne pouvez pas lui envoyer de message"
    });
  }

  // Créer et envoyer le message
  const message = new Message({
    sender: senderId,
    receiver: receiverId,
    content: req.body.content
  });

  await message.save();
  res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
};

/**
 * Récupère le dernier message d'une conversation
 * @route GET /api/v2/conversations/:id/last-message
 */

// exports.getLastMessage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "ID de conversation invalide" 
//       });
//     }

//     // Vérifier si la conversation existe
//     const conversation = await Conversation.findById(id);
//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Conversation non trouvée'
//       });
//     }

//     // Vérifier si l'utilisateur fait partie de la conversation
//     if (!conversation.participants.some(p => p.toString() === userId.toString())) {
//       return res.status(403).json({
//         success: false,
//         message: 'Accès non autorisé à cette conversation'
//       });
//     }

//     // Si la conversation a déjà un lastMessage référencé
//     if (conversation.lastMessage) {
//       const lastMessage = await Message.findById(conversation.lastMessage)
//         .populate('senderId', 'name username firstName lastName avatar')
//         .populate('receiverId', 'name username firstName lastName avatar');

//       if (lastMessage) {
//         return res.status(200).json({
//           success: true,
//           data: lastMessage
//         });
//       }
//     }

//     // Si aucun dernier message n'est référencé ou s'il n'existe plus,
//     // on récupère le message le plus récent de la conversation
//     const latestMessage = await Message.findOne({ conversation: id })
//       .sort({ createdAt: -1 })
//       .populate('senderId', 'name username firstName lastName avatar')
//       .populate('receiverId', 'name username firstName lastName avatar');

//     if (!latestMessage) {
//       return res.status(200).json({
//         success: true,
//         data: null  // Aucun message dans la conversation
//       });
//     }

//     // Mettre à jour la référence au dernier message
//     await Conversation.findByIdAndUpdate(id, {
//       lastMessage: latestMessage._id
//     });

//     return res.status(200).json({
//       success: true,
//       data: latestMessage
//     });
//   } catch (error) {
//     console.error("❌ Erreur lors de la récupération du dernier message:", error);
//     return res.status(500).json({
//       success: false,
//       message: 'Erreur serveur'
//     });
//   }
// };
// Amélioration de la fonction getLastMessage dans conversationController.js

exports.getLastMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log(`Récupération du dernier message pour la conversation ${id}`);

    if (!isValidObjectId(id)) {
      console.error("ID de conversation invalide:", id);
      return res.status(400).json({
        success: false,
        message: "ID de conversation invalide"
      });
    }

    // Vérifier si la conversation existe
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      console.error("Conversation non trouvée:", id);
      return res.status(404).json({
        success: false,
        message: 'Conversation non trouvée'
      });
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      console.error(`Utilisateur ${userId} non autorisé pour la conversation ${id}`);
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation'
      });
    }

    console.log(`Conversation ${id} trouvée, lastMessage:`, conversation.lastMessage);

    // Si la conversation a déjà un lastMessage référencé
    if (conversation.lastMessage) {
      try {
        const lastMessage = await Message.findById(conversation.lastMessage)
          .populate('senderId', 'name username firstName lastName avatar')
          .populate('receiverId', 'name username firstName lastName avatar');

        if (lastMessage) {
          console.log(`Dernier message trouvé:`, lastMessage);
          return res.status(200).json({
            success: true,
            data: lastMessage
          });
        } else {
          console.log(`Message référencé non trouvé:`, conversation.lastMessage);
        }
      } catch (msgError) {
        console.error(`Erreur lors de la récupération du message ${conversation.lastMessage}:`, msgError);
      }
    }

    console.log(`Recherche du dernier message de la conversation ${id}`);

    // Si aucun dernier message n'est référencé ou s'il n'existe plus,
    // on récupère le message le plus récent de la conversation
    const latestMessage = await Message.findOne({ conversation: id })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name username firstName lastName avatar')
      .populate('receiverId', 'name username firstName lastName avatar');

    if (!latestMessage) {
      console.log(`Aucun message trouvé pour la conversation ${id}`);
      return res.status(200).json({
        success: true,
        data: { content: "Pas encore de messages" }
      });
    }

    console.log(`Dernier message trouvé par requête:`, latestMessage);

    // Mettre à jour la référence au dernier message
    await Conversation.findByIdAndUpdate(id, {
      lastMessage: latestMessage._id
    });

    return res.status(200).json({
      success: true,
      data: latestMessage
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du dernier message:", error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};