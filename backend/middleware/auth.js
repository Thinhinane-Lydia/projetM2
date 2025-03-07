const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError"); // ✅ Correction ici
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

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
