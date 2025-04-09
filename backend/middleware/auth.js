const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");


exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    // Chercher le token dans les cookies OU dans l'en-tête Authorization
    let token = req.cookies.token || req.header("Authorization");

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
});

// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé. Seul un administrateur peut accéder à cette ressource." });
    }
    next();
};
