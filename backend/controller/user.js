

// const express = require("express");
// const User = require("../model/user");
// const upload = require("../multer");
// const jwt = require("jsonwebtoken");
// const sendMail = require("../utils/sendMail");
// const sendToken = require("../utils/jwtToken");
// const catchAsyncError = require("../middleware/catchAsyncError");
// const { isAuthenticated } = require("../middleware/auth");
// const ErrorHandler = require("../utils/ErrorHandler");
// const bcrypt = require("bcryptjs"); // ✅ Ajout de bcrypt

// const router = express.Router();

// // ✅ Fonction pour créer un token d'activation
// const createActivationToken = (user) => {
//     if (!process.env.ACTIVATION_SECRET) {
//         throw new Error("❌ Le secret d'activation JWT n'est pas défini !");
//     }
//     return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "24h" }); // 🔥 Token valide 24h
// };

// // ✅ Route : Inscription avec envoi d'un email d'activation
// router.post("/create-user", upload.single("avatar"), catchAsyncError(async (req, res, next) => {
//     console.log("📥 Requête reçue :", req.body);

//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//         return res.status(400).json({ message: "❌ Tous les champs sont obligatoires !" });
//     }

//     const emailLower = email.toLowerCase();
//     const existingUser = await User.findOne({ email: emailLower });

//     if (existingUser) {
//         return res.status(400).json({ message: "L'utilisateur existe déjà en base de données !" });
//     }

//     if (!req.file) {
//         return res.status(400).json({ message: "❌ Aucune image reçue !" });
//     }

//     const filename = req.file.filename;
//     const fileUrl = `/uploads/${filename}`;
//     const activationToken = createActivationToken({
//         name, email: emailLower, password, 
//         avatar: { public_id: filename, url: fileUrl }
//     });

//     const activationUrl = `http://localhost:8000/api/v2/user/activation/${encodeURIComponent(activationToken)}`;

//     await sendMail({
//         email: emailLower,
//         subject: "Activate your account",
//         message: `Hello ${name}, please click on the link to activate your account: <a href="${activationUrl}">${activationUrl}</a>`,
//     });

//     return res.status(201).json({
//         success: true,
//         message: `✅ Compte créé ! Vérifie ton e-mail (${emailLower}) pour activer ton compte.`,
//     });
// }));

// // ✅ Route : Activation du compte
// router.get("/activation/:token", catchAsyncError(async (req, res, next) => {
//     console.log("🔄 Requête reçue pour activation :", req.params.token);

//     const { token } = req.params;

//     if (!token) {
//         return next(new ErrorHandler("Aucun token fourni.", 400));
//     }

//     let newUser;
//     try {
//         newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
//     } catch (error) {
//         return next(new ErrorHandler("Token invalide ou expiré", 400));
//     }

//     if (!newUser) {
//         return next(new ErrorHandler("Token invalide", 400));
//     }

//     const existingUser = await User.findOne({ email: newUser.email });

//     if (existingUser) {
//         return req.xhr
//             ? res.status(400).json({ message: "L'utilisateur existe déjà. Connecte-toi !" })
//             : res.redirect("http://localhost:3000/login");
//     }

//     await User.create(newUser);

//     return req.xhr
//         ? res.status(200).json({ message: "Activation réussie, connecte-toi !" })
//         : res.redirect("http://localhost:3000/login");
// }));

// // ✅ Route : Connexion utilisateur
// router.post("/login-user", catchAsyncError(async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return next(new ErrorHandler("Veuillez remplir tous les champs !", 400));
//         }

//         const user = await User.findOne({ email }).select("+password");

//         if (!user) {
//             return next(new ErrorHandler("L'utilisateur n'existe pas !", 400));
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return next(new ErrorHandler("Mot de passe incorrect, veuillez vérifier vos identifiants.", 400));
//         }
//         const bcrypt = require("bcryptjs"); // Assure-toi d'importer bcrypt au début

// // Vérification du mot de passe dans la route /login-user
// const isPasswordValid = await bcrypt.compare(password, user.password);
// console.log("🔍 Vérification du mot de passe :", { 
//     saisi: password, 
//     stocké: user.password, 
//     estValide: isPasswordValid 
// });

// // Vérification du mot de passe
// if (!isPasswordValid) {
//     return next(new ErrorHandler("Mot de passe incorrect, veuillez vérifier vos identifiants.", 400));
// }



       

//         sendToken(user, 201, res);
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// }));

// // ✅ Route : Récupération de l'utilisateur connecté
// router.get("/getuser", isAuthenticated, catchAsyncError(async (req, res, next) => {
//     if (!req.user || !req.user.id) {
//         return next(new ErrorHandler("Utilisateur non authentifié.", 401));
//     }

//     const user = await User.findById(req.user.id);

//     if (!user) {
//         return next(new ErrorHandler("Utilisateur introuvable.", 400));
//     }

//     res.status(200).json({
//         success: true,
//         user,
//     });
// }));


const express = require("express");
const User = require("../model/user");
const upload = require("../multer");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs"); // ✅ Assure-toi que bcrypt est bien importé une seule fois

const router = express.Router();

// ✅ Fonction pour créer un token d'activation
const createActivationToken = (user) => {
    if (!process.env.ACTIVATION_SECRET) {
        throw new Error("❌ Le secret d'activation JWT n'est pas défini !");
    }
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "24h" }); // 🔥 Token valide 24h
};

// ✅ Route : Inscription avec envoi d'un email d'activation
router.post("/create-user", upload.single("avatar"), catchAsyncError(async (req, res, next) => {
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
}));

// ✅ Route : Activation du compte
router.get("/activation/:token", catchAsyncError(async (req, res, next) => {
    console.log("🔄 Requête reçue pour activation :", req.params.token);

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
        return req.xhr
            ? res.status(400).json({ message: "L'utilisateur existe déjà. Connecte-toi !" })
            : res.redirect("http://localhost:3000/login");
    }

    await User.create(newUser);

    return req.xhr
        ? res.status(200).json({ message: "Activation réussie, connecte-toi !" })
        : res.redirect("http://localhost:3000/login");
}));

// ✅ Route : Connexion utilisateur
router.post("/login-user", catchAsyncError(async (req, res, next) => {
    try {
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

        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// ✅ Route : Récupération de l'utilisateur connecté
router.get("/getuser", isAuthenticated, catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorHandler("Utilisateur non authentifié.", 401));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("Utilisateur introuvable.", 400));
    }

    res.status(200).json({
        success: true,
        user,
    });
}));

module.exports = router;
