
const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const upload = require("../multer");
const router = express.Router();

// Importer les contrôleurs de profil utilisateur
const { 
    getUserProfile, 
    getAllUsers,
    deleteUserById,
    
   
} = require("../controller/user");

// Route pour récupérer le profil utilisateur (protégé par l'authentification)
router.get("/profil", isAuthenticated, getUserProfile);

// Route pour récupérer tous les utilisateurs (admin uniquement)
router.get("/all", isAuthenticated, isAdmin, getAllUsers);

// Route pour supprimer un utilisateur et ses produits (admin uniquement)
router.delete("/delete-user/:userId", isAuthenticated, isAdmin, deleteUserById);



// Route pour promouvoir un utilisateur au rôle admin (admin uniquement)
router.put("/promote-to-admin/:userId", isAuthenticated, isAdmin, promoteUserToAdmin);
 



module.exports = router;