const express = require("express");
const User = require("../model/user");
const upload = require("../multer");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const { deleteProduct } = require("../controller/product");
const Product = require("../model/Product");
const Comment = require("../model/Comment");


const router = express.Router();


// Fonction pour créer un token d'activation
const createActivationToken = (user) => {
    if (!process.env.ACTIVATION_SECRET) {
        throw new Error("❌ Le secret d'activation JWT n'est pas défini !");
    }
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "24h" }); // Token valide 24h
};

// Route : Inscription avec avatar et email d'activation
router.post("/create-user", upload.single("avatar"), catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "❌ Tous les champs obligatoires doivent être remplis !" });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà en base de données !" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "❌ Aucune image reçue !" });
    }

    const filename = req.file.filename;
    const fileUrl = `/uploads/${filename}`;
    const activationToken = createActivationToken({
        name, email: emailLower, password,
        avatar: { public_id: filename, url: fileUrl }
    });

    const activationUrl = `http://localhost:8000/api/v2/user/activation/${encodeURIComponent(activationToken)}`;

    await sendMail({
        email: emailLower,
        subject: "Activation de votre compte",
        message: `Bonjour ${name}, veuillez cliquer sur ce lien pour activer votre compte : <a href="${activationUrl}">${activationUrl}</a>`,
    });

    return res.status(201).json({
        success: true,
        message: `✅ Compte créé ! Vérifie ton e-mail (${emailLower}) pour activer ton compte.`,
    });
}));

// Route : Création d'un administrateur (protégée)
router.post("/create-admin", isAuthenticated, isAdmin, catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "❌ Tous les champs obligatoires doivent être remplis !" });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà en base de données !" });
    }

    // Créer un utilisateur avec le rôle admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
        name,
        email: emailLower,
        password: hashedPassword,
        role: "admin",  // Définir directement le rôle "admin"
    });

    await newAdmin.save();

    res.status(201).json({
        success: true,
        message: `✅ Administrateur créé avec succès : ${name}`,
    });
}));

// Route : Activation du compte
router.get("/activation/:token", catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    if (!token) {
        return next(new ErrorHandler("Aucun token fourni.", 400));
    }

    let newUser;
    try {
        newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
    } catch (error) {
        return next(new ErrorHandler("Token invalide ou expiré", 400));
    }

    if (!newUser) {
        return next(new ErrorHandler("Token invalide", 400));
    }

    const existingUser = await User.findOne({ email: newUser.email });

    if (existingUser) {
        return res.redirect("http://localhost:3000/login");
    }

    await User.create(newUser);

    return res.redirect("http://localhost:3000/login");
}));

// Route : Connexion utilisateur
router.post("/login-user", catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Veuillez remplir tous les champs !", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("L'utilisateur n'existe pas !", 400));
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔍 Vérification du mot de passe :", { 
        saisi: password, 
        stocké: user.password, 
        estValide: isPasswordValid 
    });

    if (!isPasswordValid) {
        return next(new ErrorHandler("Mot de passe incorrect, veuillez vérifier vos identifiants.", 400));
    }
    console.log("Token généré :", jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" }));

    sendToken(user, 201, res);
}));

// ✅ Route : Récupération de l'utilisateur connecté
router.get("/getuser", isAuthenticated, catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorHandler("Utilisateur non authentifié.", 401));
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
        return next(new ErrorHandler("Utilisateur non trouvé.", 404));
    }
    
    res.status(200).json({
        success: true,
        user,
    });
}));

// Route : Déconnexion
router.get("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Déconnexion réussie.",
    });
});

 

router.get("/profil", isAuthenticated, catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return next(new ErrorHandler("Utilisateur introuvable.", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
}));


// Route pour promouvoir un utilisateur en admin
router.put("/promote-to-admin/:userId", isAuthenticated, isAdmin, catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    // Vérifier si l'utilisateur existe
    const userToPromote = await User.findById(userId);
    if (!userToPromote) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier que l'utilisateur n'est pas déjà un admin
    if (userToPromote.role === "admin") {
        return res.status(400).json({ message: "Cet utilisateur est déjà un administrateur." });
    }

    // Promouvoir l'utilisateur
    userToPromote.role = "admin";
    await userToPromote.save();

    res.status(200).json({
        success: true,
        message: `L'utilisateur ${userToPromote.name} a été promu au rôle d'administrateur.`,
    });
}));

router.get("/me", isAuthenticated, catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new ErrorHandler("Utilisateur introuvable.", 404));
    }
  
    res.status(200).json({
      success: true,
      user,
    });
}));

router.get('/search', isAuthenticated, async (req, res) => {
    try {
      const { query } = req.query;
      console.log("🔍 Recherche d'utilisateurs pour:", query);
      
      if (!query) {
        return res.status(400).json({ success: false, message: "Paramètre de recherche manquant" });
      }
      
      const results = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }).select('_id name email avatar');
      
      console.log("✅ Résultats trouvés:", results);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("❌ Erreur lors de la recherche d'utilisateurs:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Route : Récupérer tous les utilisateurs (admin uniquement)
router.get("/all", isAuthenticated, isAdmin, catchAsyncError(async (req, res, next) => {
    const users = await User.find().select("-password");
    
    res.status(200).json({
        success: true,
        users: users,
        userCount: users.length
    });
}));

  
router.delete("/delete-user/:userId", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      // Recherche de l'utilisateur à supprimer
      const userToDelete = await User.findById(userId);
      if (!userToDelete) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
      }
  
      // Supprimer tous les produits associés à cet utilisateur
      await Product.deleteMany({ seller: userId });
  
      // Supprimer tous les commentaires associés à cet utilisateur
      await Comment.deleteMany({ user: userId });
  
      // Suppression de l'utilisateur
      await User.deleteOne({ _id: userId });
  
      res.status(200).json({
        success: true,
        message: "Utilisateur et ses produits et commentaires supprimés avec succès.",
      });
    } catch (error) {
      next(error);
    }
  });



  // Correction de la route update-profile dans le fichier user.js (backend)
router.put("/update-profile", isAuthenticated, upload.single("avatar"), async (req, res, next) => {
    try {
      const { name, phoneNumber, address } = req.body;
      const user = await User.findById(req.user.id);
      
      if (!user) return res.status(404).json({ 
        success: false,
        message: "Utilisateur introuvable" 
      });
      
      let avatarUpdate = user.avatar;
      
      // Traiter l'avatar s'il est fourni
      if (req.file) {
        // Utiliser le fichier téléchargé
        const filename = req.file.filename;
        const fileUrl = `/uploads/${filename}`;
        avatarUpdate = {
          public_id: filename,
          url: fileUrl
        };
      }
  
      // Préparer l'adresse (si elle existe)
      let addressUpdate = user.addresses;
      if (address) {
        // Si l'utilisateur n'a pas encore d'adresses, créer un tableau
        if (!Array.isArray(addressUpdate) || addressUpdate.length === 0) {
          addressUpdate = [{ address1: address }];
        } else {
          // Sinon mettre à jour la première adresse
          addressUpdate[0] = { 
            ...addressUpdate[0],
            address1: address 
          };
        }
      }
  
      // Mise à jour du profil
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { 
          name: name || user.name,
          phoneNumber: phoneNumber || user.phoneNumber,
          addresses: addressUpdate,
          avatar: avatarUpdate
        },
        { new: true }
      );
      
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil:", error);
      next(error);
    }
  });

  

module.exports = router;