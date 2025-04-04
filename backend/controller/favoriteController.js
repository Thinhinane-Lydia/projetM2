const Favorite = require("../model/Favorite");

// ✅ Ajouter un produit aux favoris
exports.addFavorite = async (req, res) => {
    console.log("🛠 Requête reçue pour ajouter un favori :", req.body);

    try {
        console.log("🔹 Requête reçue : UserID =", req.user?.id, " ProductID =", req.body.productId);
        
        if (!req.user?.id || !req.body.productId) {
            return res.status(400).json({ success: false, message: "Données invalides" });
        }

        console.log("🛠 Vérification du favori existant...");
        const existingFavorite = await Favorite.findOne({ user: req.user.id, product: req.body.productId });

        if (!existingFavorite) {
            console.log("🆕 Création du favori :", { user: req.user.id, product: req.body.productId });
            const newFavorite = new Favorite({ user: req.user.id, product: req.body.productId });
            await newFavorite.save();
            console.log("✅ Favori enregistré en base !");
            return res.status(201).json({ success: true, message: "✅ Produit ajouté aux favoris" });
        } else {
            console.log("⚠ Ce produit est déjà un favori.");
            return res.status(200).json({ success: true, message: "Ce produit est déjà dans vos favoris" });
        }

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};
// ✅ Supprimer un produit des favoris
exports.removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "❌ Utilisateur non authentifié" });
        }

        const result = await Favorite.findOneAndDelete({ user: userId, product: productId });

        if (!result) {
            console.log("⚠ Favori non trouvé :", productId);
            return res.status(404).json({ success: false, message: "❌ Favori non trouvé" });
        }

        console.log("✅ Produit retiré des favoris :", productId);
        return res.json({ success: true, message: "✅ Produit retiré des favoris" });
    } catch (error) {
        console.error("❌ Erreur serveur dans removeFavorite :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// ✅ Obtenir les favoris d'un utilisateur
exports.getUserFavorites = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "❌ Utilisateur non authentifié" });
        }

        const userId = req.user.id;
        const favorites = await Favorite.find({ user: userId }).populate("product");

        console.log(`✅ Favoris trouvés pour User ${userId} : ${favorites.length}`);
        return res.json({ success: true, data: favorites });
    } catch (error) {
        console.error("❌ Erreur serveur dans getUserFavorites :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};


// ✅ Vérifier si un produit est dans les favoris
exports.checkFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "❌ Utilisateur non authentifié" });
        }

        const favorite = await Favorite.findOne({ user: userId, product: productId });

        console.log(`🔍 Vérification du favori (User: ${userId}, Produit: ${productId}) :`, favorite ? "✅ Oui" : "❌ Non");
        return res.json({ success: true, isFavorite: !!favorite });
    } catch (error) {
        console.error("❌ Erreur serveur dans checkFavorite :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};
