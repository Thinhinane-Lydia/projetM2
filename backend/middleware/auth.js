const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError"); // ✅ Correction ici
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorHandler("⛔ Accès refusé. Veuillez vous connecter.", 401));
//     }

//     try {
//         if (!process.env.JWT_SECRET_KEY) {
//             throw new ErrorHandler("⛔ Erreur de configuration : Clé secrète JWT manquante.", 500);
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         req.user = await User.findById(decoded.id);

//         if (!req.user) {
//             return next(new ErrorHandler("⛔ Utilisateur non trouvé. Veuillez vous reconnecter.", 404));
//         }

//         next();
//     } catch (error) {
//         return next(new ErrorHandler("⛔ Session expirée ou invalide. Veuillez vous reconnecter.", 401));
//     }
// });
exports.isAuthenticated = async (req, res, next) => {
    let token = req.headers.authorization || req.cookies.token;
    
    console.log("🔍 Token brut reçu :", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "⛔ Accès refusé. Aucun token reçu." });
    }

    // Supprimer "Bearer " si présent
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    console.log("🚀 Token après nettoyage :", token);

    try {
        console.log("🔑 Clé JWT utilisée pour vérification :", process.env.JWT_SECRET_KEY);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("✅ Token décodé avec succès :", decoded);

        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(404).json({ success: false, message: "⛔ Utilisateur non trouvé. Veuillez vous reconnecter." });
        }

        console.log("✅ Utilisateur authentifié :", req.user.email);
        next();
    } catch (error) {
        console.error("⛔ Erreur lors de la validation du token :", error.message);
        return res.status(401).json({ success: false, message: "⛔ Session expirée ou invalide. Veuillez vous reconnecter." });
    }
};
