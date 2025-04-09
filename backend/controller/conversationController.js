
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

/**
 * Récupère toutes les conversations d'un utilisateur
 * @route GET /api/v2/conversations
 */
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

    const conversations = await Conversation.find({
      participants: userIdObj
    })
    .populate('participants', 'name username firstName lastName avatar email')
    .populate({
      path: 'lastMessage',
      select: 'content createdAt sender'
    })
    .sort({ updatedAt: -1 });
    
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

/**
 * Démarre une nouvelle conversation ou récupère une existante
 * @route POST /api/v2/conversations/start
 */
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

        // Vérifier si l'utilisateur n'essaie pas de démarrer une conversation avec lui-même
        if (userId.toString() === currentUserId.toString()) {
            return res.status(400).json({ 
                success: false, 
                message: "Impossible de démarrer une conversation avec soi-même" 
            });
        }

        const targetUserId = new mongoose.Types.ObjectId(userId);

        // Vérifier si l'utilisateur existe
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ 
                success: false, 
                message: "Utilisateur introuvable" 
            });
        }

        // Vérifier si la conversation existe déjà
        let conversation = await Conversation.findOne({ 
            participants: { 
                $all: [currentUserId, targetUserId],
                $size: 2  // Assure qu'il n'y a que 2 participants
            } 
        });

        if (!conversation) {
            conversation = new Conversation({ 
              participants: [currentUserId, targetUserId] 
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
      .populate('participants', 'username firstName lastName avatar isOnline');

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