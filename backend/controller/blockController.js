const User = require('../model/user');
const mongoose = require('mongoose');

// Fonction pour valider un ID MongoDB
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Bloque un utilisateur
 * @route POST /api/v2/users/block/:userId
 */
exports.blockUser = async (req, res) => {
  const { userId } = req.params;  // Récupère l'ID de l'utilisateur à bloquer depuis les paramètres de la requête
  const currentUserId = req.user._id; // ID de l'utilisateur connecté (depuis le middleware 'isAuthenticated')

  try {
    // Vérifier si l'ID de l'utilisateur est valide
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur invalide"
      });
    }

    // Vérifier si l'utilisateur à bloquer est déjà dans la liste des bloqués
    const currentUser = await User.findById(currentUserId);
    if (currentUser.blockedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Cet utilisateur est déjà bloqué"
      });
    }

    // Ajouter l'utilisateur à la liste des bloqués
    await User.findByIdAndUpdate(currentUserId, {
      $push: { blockedUsers: userId }
    });

    return res.status(200).json({
      success: true,
      message: "Utilisateur bloqué avec succès"
    });
  } catch (error) {
    console.error("Erreur lors du blocage de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

/**
 * Débloque un utilisateur
 * @route POST /api/v2/users/unblock/:userId
 */
exports.unblockUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  try {
    // Validation des IDs
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID d'utilisateur invalide"
      });
    }

    // Vérifier si l'utilisateur est bloqué
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.blockedUsers || !currentUser.blockedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Cet utilisateur n'est pas bloqué"
      });
    }

    // Retirer l'utilisateur de la liste des bloqués
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: userId }
    });

    return res.status(200).json({
      success: true,
      message: "Utilisateur débloqué avec succès"
    });
  } catch (error) {
    console.error("Erreur lors du déblocage de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

/**
 * Récupère la liste des utilisateurs bloqués
 * @route GET /api/v2/users/blocked
 */
exports.getBlockedUsers = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    // Récupérer l'utilisateur avec la liste des bloqués
    const user = await User.findById(currentUserId).populate('blockedUsers', 'name email avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    return res.status(200).json({
      success: true,
      data: user.blockedUsers || []
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs bloqués:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

/**
 * Vérifie si un utilisateur est bloqué
 * @route GET /api/v2/users/is-blocked/:userId
 */
exports.isUserBlocked = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  try {
    // Validation des IDs
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID d'utilisateur invalide"
      });
    }

    // Vérifier si l'utilisateur est bloqué
    const currentUser = await User.findById(currentUserId);
    const isBlocked = currentUser.blockedUsers && currentUser.blockedUsers.some(id => id.toString() === userId);

    return res.status(200).json({
      success: true,
      isBlocked
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de blocage:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};
// Dans votre contrôleur utilisateur (controllers/userController.js)
exports.checkIfUserIsBlockedBy = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    // Rechercher dans la collection de blocages si targetUser a bloqué currentUser
    const blockRecord = await Block.findOne({ 
      userId: targetUserId,
      blockedUserId: currentUserId
    });

    return res.status(200).json({
      success: true,
      isBlocked: !!blockRecord
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du statut de blocage:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la vérification du statut de blocage",
      error: error.message
    });
  }
};

 // Dans votre contrôleur utilisateur (controllers/userController.js)
// Dans blockController.js, ajoutez cette fonction (pas de définition de router ici)

exports.checkIfUserIsBlockedBy = async (req, res) => {
    try {
      const currentUserId = req.user._id;
      const targetUserId = req.params.userId;
  
      // Rechercher dans la collection de blocages si targetUser a bloqué currentUser
      const blockRecord = await Block.findOne({ 
        userId: targetUserId,
        blockedUserId: currentUserId
      });
  
      return res.status(200).json({
        success: true,
        isBlocked: !!blockRecord
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de blocage:", error);
      return res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la vérification du statut de blocage",
        error: error.message
      });
    }
  };
