const Recommendation = require("../model/Recommendation");
const User = require("../model/user");
const Product = require("../model/Product");
const mongoose = require("mongoose");

/**
 * Sauvegarde les recommandations reçues du service Python dans la base de données MongoDB
 * @param {Object} req - Requête contenant user_id et recommended_products
 * @param {Object} res - Réponse HTTP
 */
exports.saveRecommendations = async (req, res) => {
    try {
      console.log("Données reçues:", req.body);
      const { user_id, recommended_products } = req.body;
      
      // Vérifier que les données requises sont présentes
      if (!user_id || !recommended_products || !Array.isArray(recommended_products)) {
        return res.status(400).json({
          success: false,
          message: "Format de données invalide. user_id et un tableau recommended_products sont requis"
        });
      }
      
      // Vérifier si l'utilisateur existe
      try {
        const userObjectId = new mongoose.Types.ObjectId(user_id);
        const userExists = await User.findById(userObjectId);
        if (!userExists) {
          return res.status(404).json({
            success: false,
            message: `Utilisateur avec l'ID ${user_id} non trouvé`
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `ID utilisateur invalide: ${user_id}`,
          error: error.message
        });
      }
      
      // Convertir les IDs de produits en ObjectId avec le mot-clé 'new'
      const productIds = recommended_products.map(id => {
        try {
          return typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
        } catch (error) {
          console.warn(`ID produit invalide ignoré: ${id}`);
          return null;
        }
      }).filter(id => id !== null); // Filtrer les IDs invalides
      
      // Vérifier si une recommandation existe déjà pour cet utilisateur
      let recommendation = await Recommendation.findOne({ user_id });
      
      if (recommendation) {
        // Mettre à jour les recommandations existantes
        recommendation.recommended_products = productIds;
        recommendation.created_at = Date.now();
        await recommendation.save();
      } else {
        // Créer une nouvelle entrée de recommandation
        recommendation = new Recommendation({
          user_id: new mongoose.Types.ObjectId(user_id),
          recommended_products: productIds
        });
        await recommendation.save();
      }
      
      return res.status(200).json({
        success: true,
        message: "Recommandations sauvegardées avec succès",
        data: recommendation
      });
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des recommandations:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la sauvegarde des recommandations",
        error: error.message
      });
    }
  };
  
  /**
   * Récupère les recommandations pour un utilisateur spécifique
   * @param {Object} req - Requête contenant l'ID de l'utilisateur dans les paramètres
   * @param {Object} res - Réponse HTTP
   */
  // exports.getUserRecommendations = async (req, res) => {
  //   try {
  //     const { userId } = req.params;
      
  //     // Vérifier si l'utilisateur existe
  //     try {
  //       const userObjectId = new mongoose.Types.ObjectId(userId);
  //       const userExists = await User.findById(userObjectId);
  //       if (!userExists) {
  //         return res.status(404).json({
  //           success: false,
  //           message: `Utilisateur avec l'ID ${userId} non trouvé`
  //         });
  //       }
  //     } catch (error) {
  //       return res.status(400).json({
  //         success: false,
  //         message: `ID utilisateur invalide: ${userId}`,
  //         error: error.message
  //       });
  //     }
      
  //     // Récupérer les recommandations avec les détails des produits
  //     const recommendations = await Recommendation.findOne({ user_id: userId })
  //       .populate({
  //         path: 'recommended_products',
  //         select: 'name price images description category subcategory'
  //       });
      
  //     if (!recommendations) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Aucune recommandation trouvée pour cet utilisateur"
  //       });
  //     }
      
  //     return res.status(200).json({
  //       success: true,
  //       data: recommendations
  //     });
      
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des recommandations:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Erreur lors de la récupération des recommandations",
  //       error: error.message
  //     });
  //   }
  // };

  // Récupère les recommandations pour un utilisateur spécifique
// exports.getUserRecommendations = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // Vérifier si l'utilisateur existe
//     const userObjectId = new mongoose.Types.ObjectId(userId);
//     const userExists = await User.findById(userObjectId);
//     if (!userExists) {
//       return res.status(404).json({
//         success: false,
//         message: `Utilisateur avec l'ID ${userId} non trouvé`
//       });
//     }

//     // Récupérer les recommandations avec les détails des produits
//     const recommendations = await Recommendation.findOne({ user_id: userId })
//       .populate({
//         path: 'recommended_products',
//         select: 'name price images description category subcategory' // Sélectionne les informations nécessaires
//       });

//     if (!recommendations) {
//       return res.status(404).json({
//         success: false,
//         message: "Aucune recommandation trouvée pour cet utilisateur"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: recommendations
//     });

//   } catch (error) {
//     console.error("Erreur lors de la récupération des recommandations:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération des recommandations",
//       error: error.message
//     });
//   }
// };
// Récupérer les recommandations pour un utilisateur spécifique
// exports.getUserRecommendations = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const recommendations = await Recommendation.findOne({ user_id: userId })
//       .populate({
//         path: 'recommended_products',
//         select: 'name price images description category subcategory'
//       });

//     if (!recommendations) {
//       return res.status(404).json({
//         success: false,
//         message: "Aucune recommandation trouvée pour cet utilisateur"
//       });
//     }

//     // Assurez-vous que recommendations.recommended_products est bien un tableau
//     return res.status(200).json({
//       success: true,
//       data: recommendations.recommended_products // Cela doit être un tableau
//     });

//   } catch (error) {
//     console.error("Erreur lors de la récupération des recommandations:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération des recommandations",
//       error: error.message
//     });
//   }
// };
// Récupérer les recommandations pour un utilisateur spécifique
exports.getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const recommendations = await Recommendation.findOne({ user_id: userId })
      .populate({
        path: 'recommended_products',
        select: 'name price images description category subCategory brand material color condition size etat seller createdAt',
        populate: [
          { path: 'category', select: 'name _id' },
          { path: 'subCategory', select: 'name _id categoryId' },
          { path: 'size', select: 'name _id' },
          { path: 'seller', select: '_id name email avatar' }
        ]
      });

    if (!recommendations) {
      return res.status(404).json({
        success: false,
        message: "Aucune recommandation trouvée pour cet utilisateur"
      });
    }

    // Filtrer les produits vendus ou ceux du vendeur connecté
    const filteredProducts = recommendations.recommended_products.filter(product => 
      product.etat !== "vendu" && product.seller._id.toString() !== userId
    );

    return res.status(200).json({
      success: true,
      data: filteredProducts
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des recommandations",
      error: error.message
    });
  }
};

  
  /**
   * Supprime les recommandations d'un utilisateur
   * @param {Object} req - Requête contenant l'ID de l'utilisateur dans les paramètres
   * @param {Object} res - Réponse HTTP
   */
  exports.deleteUserRecommendations = async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Convertir l'ID utilisateur en ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      
      // Supprimer les recommandations
      const result = await Recommendation.deleteOne({ user_id: userObjectId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucune recommandation trouvée pour cet utilisateur"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Recommandations supprimées avec succès"
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression des recommandations:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression des recommandations",
        error: error.message
      });
    }
  };