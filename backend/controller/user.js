const express = require("express");
const User = require("../model/user");
const upload = require("../multer");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");

const ErrorHandler = require("../utils/ErrorHandler");

const router = express.Router();

// ✅ Inscription avec envoi d'un email d'activation
router.post("/create-user", upload.single("avatar"), catchAsyncError(async (req, res, next) => {
    try {
        console.log("📥 Requête reçue :", req.body);

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "❌ Tous les champs sont obligatoires !" });
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
            subject: "Activate your account",
            message: `Hello ${name}, please click on the link to activate your account: <a href="${activationUrl}">${activationUrl}</a>`,
        });

        return res.status(201).json({
            success: true,
            message: `✅ Compte créé ! Vérifie ton e-mail (${emailLower}) pour activer ton compte.`,
        });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "❌ Erreur serveur", error: error.message });
    }
}));

// ✅ Fonction pour créer un token d'activation
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "24h" }); // 🔥 Token valide 24h
};

// ✅ Activation du compte
// ✅ Activation du compte
router.get("/activation/:token", catchAsyncError(async (req, res, next) => {
    try {
        console.log("🔄 Requête reçue pour activation :", req.params.token);

        const { token } = req.params;

        if (!token) {
            console.log("❌ Aucun token fourni.");
            return next(new ErrorHandler("Aucun token fourni.", 400));
        }

        let newUser;
        try {
            newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
        } catch (error) {
            console.log("❌ Token invalide ou expiré.");
            return next(new ErrorHandler("Token invalide ou expiré", 400));
        }

        if (!newUser) {
            console.log("❌ Token invalide.");
            return next(new ErrorHandler("Token invalide", 400));
        }

        const existingUser = await User.findOne({ email: newUser.email });

        if (existingUser) {
            console.log("⚠️ L'utilisateur existe déjà, redirection vers login.");
            return res.redirect("http://localhost:3000/login");
        }

        const createdUser = await User.create(newUser);

        console.log("✅ Activation réussie, redirection vers login...");
        return res.redirect("http://localhost:3000/login");

    } catch (error) {
        console.log("❌ Erreur d'activation :", error.message);
        return next(new ErrorHandler(error.message, 500));
    }
}));




// ✅ LOGIN UTILISATEUR (Aucun code supprimé)
router.post("/login-user", catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Veuillez remplir tous les champs !", 400));
        }

        const user = await User.findOne({ email }).select("+password");
console.log("🔍 Utilisateur trouvé :", user);


        if (!user) {
            return next(new ErrorHandler("L'utilisateur n'existe pas !", 400));
        }

        const bcrypt = require("bcryptjs");

const isPasswordValid = await bcrypt.compare(password, user.password);
console.log("🔍 Vérification du mot de passe :", { 
    saisi: password, 
    stocké: user.password, 
    estValide: isPasswordValid 
});

if (!isPasswordValid) {
    return next(new ErrorHandler("Mot de passe incorrect, veuillez vérifier vos identifiants.", 400));
}


       

        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// ✅ Récupération de l'utilisateur connecté
router.get("/getuser", isAuthenticated, catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("Utilisateur introuvable.", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

module.exports = router;
