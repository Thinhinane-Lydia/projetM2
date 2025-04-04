// const ErrorHandler = require("../utils/ErrorHandler");
// const catchAsyncError = require("../middleware/catchAsyncError"); // ✅ Correction ici
// const jwt = require("jsonwebtoken");
// const User = require("../model/user");

// exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
//     // ✅ Vérifier si le cookie contient bien un token
//     console.log("📌 Vérification des cookies reçus :", req.cookies);

//     const { token } = req.cookies;

//     if (!token) {
//         console.log("⛔ Aucun token trouvé dans les cookies !");
//         return res.status(401).json({ success: false, message: "⛔ Accès refusé. Veuillez vous connecter." });
//     }

//     try {
//         if (!process.env.JWT_SECRET_KEY) {
//             throw new ErrorHandler("⛔ Erreur de configuration : Clé secrète JWT manquante.", 500);
//         }

//         // ✅ Vérification du token JWT
//         console.log("🔑 Vérification du token JWT...");
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log("✅ Token JWT valide pour l'utilisateur ID :", decoded.id);

//         // ✅ Récupérer l'utilisateur depuis la base de données
//         req.user = await User.findById(decoded.id);
//         console.log("👤 Utilisateur trouvé :", req.user ? req.user.email : "❌ Aucun utilisateur trouvé");

//         if (!req.user) {
//             return res.status(404).json({ success: false, message: "⛔ Utilisateur non trouvé. Veuillez vous reconnecter." });
//         }

//         next(); // ✅ Passe au middleware suivant
//     } catch (error) {
//         console.error("❌ Erreur lors de la vérification du JWT :", error.message);
//         return res.status(401).json({ success: false, message: "⛔ Session expirée ou invalide. Veuillez vous reconnecter." });
//     }
// });
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token; // ✅ Récupère le token via les cookies

    if (!token) {
        return next(new ErrorHandler("⛔ Accès refusé. Veuillez vous connecter.", 401));
    }

    try {
        if (!process.env.JWT_SECRET_KEY) {
            throw new ErrorHandler("⛔ Erreur de configuration : Clé secrète JWT manquante.", 500);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("⛔ Utilisateur non trouvé. Veuillez vous reconnecter.", 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("⛔ Session expirée ou invalide. Veuillez vous reconnecter.", 401));
    }
});

// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé. Seul un administrateur peut accéder à cette ressource." });
    }
    next();
};
