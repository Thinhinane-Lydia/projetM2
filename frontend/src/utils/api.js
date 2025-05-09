
import axios from "axios";

// Base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Helper for error handling
const handleApiError = (error, fallbackValue, errorMessage) => {
  console.error(errorMessage || "API Error:", error);
  if (fallbackValue !== undefined) {
    return fallbackValue;
  }
  throw error;
};

// Create a reusable axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add authentication token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * ✅ Récupérer toutes les catégories
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    return handleApiError(error, { categories: [] }, "❌ Erreur fetchCategories");
  }
};

/**
 * ✅ Récupérer les sous-catégories pour une catégorie spécifique
 */
export const fetchSubCategories = async (categoryId) => {
  try {
    const response = await api.get(`/subcategories/${categoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { success: false, subCategories: [] }, '❌ Erreur fetchSubCategories');
  }
};

/**
 * ✅ Récupérer les tailles disponibles pour une sous-catégorie spécifique
 */
export const fetchSizesBySubCategory = async (subCategoryId) => {
  if (!subCategoryId || typeof subCategoryId !== "string") {
    console.error("❌ fetchSizesBySubCategory : subCategoryId invalide !");
    return { sizes: [] };
  }
  try {
    console.log(`🔍 Appel API: ${API_BASE_URL}/sizes/subcategory/${subCategoryId}`);
    const response = await api.get(`/sizes/subcategory/${subCategoryId}`);
    console.log("✅ Réponse des tailles:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, { sizes: [] }, "❌ Erreur fetchSizesBySubCategory");
  }
};

/**
 * ✅ Récupérer tous les produits (avec les infos du vendeur et les ratings moyens)
 */
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products", {
      params: {
        populate: "seller,ratings", // Ajout de ratings pour récupérer les évaluations moyennes
      }
    });
    console.log("📥 Produits reçus:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, { products: [] }, "❌ Erreur fetchProducts");
  }
};

/**
 * ✅ Récupérer les produits avec des filtres (recherche avancée)
 */
export const fetchFilteredProducts = async (filters) => {
  try {
    const response = await api.get("/products", { params: filters });
    return response.data.products || [];
  } catch (error) {
    return handleApiError(error, [], "❌ Erreur fetchFilteredProducts");
  }
};

/**
 * ✅ Récupérer le rating moyen d'un produit
 */
export const fetchProductRating = async (productId) => {
  try {
    if (!productId) {
      console.error("❌ fetchProductRating: productId manquant");
      return { rating: 0, count: 0 };
    }
    
    const response = await api.get(`/comments/rating/${productId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { rating: 0, count: 0 }, "❌ Erreur fetchProductRating");
  }
};

/**
 * ✅ Récupérer les produits d'un utilisateur spécifique
 */
export const fetchUserProducts = async (userId) => {
  try {
    if (!userId) {
      console.error("❌ fetchUserProducts: userId manquant");
      return [];
    }
    
    const response = await api.get("/products", {
      params: { seller: userId }
    });
    
    return response.data.products || [];
  } catch (error) {
    return handleApiError(error, [], "❌ Erreur fetchUserProducts");
  }
};

/**
 * ✅ Ajouter un produit (Uniquement pour les utilisateurs connectés)
 */
export const createProduct = async (productData) => {
  try {
    // Assurez-vous que productData est un FormData
    if (!(productData instanceof FormData)) {
      console.error("❌ createProduct: productData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }
    
    // Vérifiez le contenu du FormData (debug)
    console.log("Contenu du FormData pour création:");
    for (let [key, value] of productData.entries()) {
      if (key === "images") {
        console.log(`${key}: ${value instanceof File ? value.name : value} (${value instanceof File ? value.type : 'non-fichier'})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    const response = await api.post("/products/create", productData, {
      headers: { 
        "Content-Type": "multipart/form-data" // Crucial pour l'envoi de fichiers
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de l'ajout du produit" },
      "❌ Erreur createProduct"
    );
  }
};

/**
 * ✅ Mettre à jour un produit
 */
export const updateProduct = async (productId, updatedData) => {
  try {
    // Assurez-vous que updatedData est un FormData
    if (!(updatedData instanceof FormData)) {
      console.error("❌ updateProduct: updatedData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }
    
    // Vérifiez le contenu du FormData (debug)
    console.log("Contenu du FormData pour mise à jour:");
    for (let [key, value] of updatedData.entries()) {
      if (key === "images") {
        console.log(`${key}: ${value instanceof File ? value.name : value} (${value instanceof File ? value.type : 'non-fichier'})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    const response = await api.put(`/products/${productId}`, updatedData, {
      headers: { 
        "Content-Type": "multipart/form-data" // Crucial pour l'envoi de fichiers
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour du produit" },
      "❌ Erreur updateProduct"
    );
  }
};

/**
 * ✅ Supprimer un produit
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la suppression du produit" },
      "❌ Erreur deleteProduct"
    );
  }
};

/**
 * ✅ Récupérer les informations de l'utilisateur connecté
 */
export const fetchUser = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    return handleApiError(error, { success: false }, "❌ Erreur fetchUser");
  }
};

/**
 * ✅ Déconnexion de l'utilisateur (supprime le cookie JWT)
 */
export const logout = async () => {
  try {
    const response = await api.get("/user/logout");
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la déconnexion" },
      "❌ Erreur logout"
    );
  }
};
/**
 * ✅ Mettre à jour le profil de l'utilisateur connecté (hors email)
 * @param {FormData} profileData - Données du profil à mettre à jour
 * @returns {Promise<Object>} - Résultat de l'API
 */
export const updateUserProfile = async (profileData) => {
  try {
    if (!(profileData instanceof FormData)) {
      console.error("❌ updateUserProfile: profileData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }
    
    console.log("🔄 Mise à jour du profil avec :", Object.fromEntries(profileData.entries()));
    
    const response = await api.put("/user/update-profile", profileData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la mise à jour du profil" },
      "❌ Erreur updateUserProfile"
    );
  }
};



// COMMENTAIRES
/**
 * ✅ Ajouter un commentaire
 */
export const createComment = async (commentData) => {
  try {
    console.log("Envoi du commentaire:", commentData);
    const response = await api.post("/comments/create", commentData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de l'ajout du commentaire" },
      "❌ Erreur createComment"
    );
  }
};

/**
 * ✅ Récupérer les commentaires d'un produit
 */
export const fetchCommentsByProduct = async (productId) => {
  try {
    if (!productId) {
      console.error("❌ fetchCommentsByProduct: productId manquant");
      return [];
    }
    
    console.log(`🔍 Récupération des commentaires pour le produit: ${productId}`);
    const response = await api.get(`/comments/${productId}`);
    
    console.log("Commentaires reçus:", response.data.comments);
    return response.data.comments || [];
  } catch (error) {
    return handleApiError(error, [], "❌ Erreur fetchCommentsByProduct");
  }
};

/**
 * ✅ Supprimer un commentaire
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la suppression du commentaire" },
      "❌ Erreur deleteComment"
    );
  }
};

// RECHERCHE
/**
 * ✅ Enregistrer une recherche dans l'historique
 */
export const saveSearchHistory = async (data) => {
  try {
    const response = await api.post("/search-history/add", data);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.message },
      "Erreur lors de l'enregistrement de la recherche"
    );
  }
};

/**
 * ✅ Récupérer l'historique des recherches d'un utilisateur
 */
export const fetchSearchHistory = async () => {
  try {
    const response = await api.get("/search-history/history");
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.message },
      "Erreur lors de la récupération de l'historique des recherches"
    );
  }
};

// CATÉGORIES
/**
 * ✅ Créer une catégorie
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la création de la catégorie" },
      "❌ Erreur createCategory"
    );
  }
};

/**
 * ✅ Modifier une catégorie
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour de la catégorie" },
      "❌ Erreur updateCategory"
    );
  }
};

/**
 * ✅ Supprimer une catégorie
 */
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de la catégorie" },
      "❌ Erreur deleteCategory"
    );
  }
};

// SOUS-CATÉGORIES
/**
 * ✅ Créer une sous-catégorie
 */
// export const createSubCategory = async (subCategoryData) => {
//   try {
//     const response = await api.post("/subcategories", subCategoryData);
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error,
//       { success: false, message: error.response?.data?.message || 'Erreur lors de la création de la sous-catégorie' },
//       '❌ Erreur createSubCategory'
//     );
//   }
// };
export const createSubCategory = async (subCategoryData) => {
  try {
    // Vérifier que subCategoryData est bien un FormData
    if (!(subCategoryData instanceof FormData)) {
      console.error("❌ createSubCategory: subCategoryData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }
    
    const response = await api.post("/subcategories", subCategoryData, {
      headers: { 
        "Content-Type": "multipart/form-data"  // Crucial pour l'envoi de fichiers
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la création de la sous-catégorie" },
      "❌ Erreur createSubCategory"
    );
  }
};


/**
 * ✅ Modifier une sous-catégorie
 */
// export const updateSubCategory = async (id, subCategoryData) => {
//   try {
//     const response = await api.put(`/subcategories/${id}`, subCategoryData);
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error,
//       { success: false, message: error.response?.data?.message || 'Erreur lors de la mise à jour de la sous-catégorie' },
//       '❌ Erreur updateSubCategory'
//     );
//   }
// };
export const updateSubCategory = async (id, subCategoryData) => {
  try {
    // Vérifier que subCategoryData est bien un FormData
    if (!(subCategoryData instanceof FormData)) {
      console.error("❌ updateSubCategory: subCategoryData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }
    
    const response = await api.put(`/subcategories/${id}`, subCategoryData, {
      headers: { 
        "Content-Type": "multipart/form-data"  // Crucial pour l'envoi de fichiers
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour de la sous-catégorie" },
      "❌ Erreur updateSubCategory"
    );
  }
};

/**
 * ✅ Supprimer une sous-catégorie
 */
export const deleteSubCategory = async (id) => {
  try {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || 'Erreur lors de la suppression de la sous-catégorie' },
      '❌ Erreur deleteSubCategory'
    );
  }
};

// TAILLES
/**
 * ✅ Récupérer toutes les tailles
 */
export const fetchSizes = async () => {
  try {
    const response = await api.get("/sizes");
    return response.data;
  } catch (error) {
    return handleApiError(error, { sizes: [] }, "❌ Erreur fetchSizes");
  }
};

/**
 * ✅ Créer une taille
 */
export const createSize = async (sizeData) => {
  try {
    const response = await api.post("/sizes", sizeData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la création de la taille" },
      "❌ Erreur createSize"
    );
  }
};

/**
 * ✅ Supprimer une taille
 */
export const deleteSize = async (id) => {
  try {
    const response = await api.delete(`/sizes/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de la taille" },
      "❌ Erreur deleteSize"
    );
  }
};

// FAVORIS
/**
 * ✅ Ajouter un produit aux favoris
 */
export const addToFavorites = async (productId) => {
  try {
    console.log("🔹 Adding to favorites:", productId);
    const response = await api.post("/favorites", { productId });
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error adding to favorites");
  }
};

/**
 * ✅ Supprimer un produit des favoris
 */
export const removeFromFavorites = async (productId) => {
  try {
    console.log("🔹 Removing from favorites:", productId);
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error removing from favorites");
  }
};

/**
 * ✅ Vérifier si un produit est dans les favoris
 */
export const checkIfFavorite = async (productId) => {
  try {
    const response = await api.get(`/favorites/check/${productId}`);
    return response.data.isFavorite;
  } catch (error) {
    return handleApiError(error, false, "Error checking favorite status");
  }
};

/**
 * ✅ Récupérer les favoris de l'utilisateur
 */
export const fetchUserFavorites = async () => {
  try {
    const response = await api.get("/favorites");
    return response.data;
  } catch (error) {
    return handleApiError(error, [], "Error fetching user favorites");
  }
};

// PANIER
/**
 * ✅ Récupérer le panier
 */
export const fetchCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return handleApiError(error, [], "Error fetching cart");
  }
};

/**
 * ✅ Ajouter au panier
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart", { productId});
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error adding to cart");
  }
};

/**
 * ✅ Supprimer du panier
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error removing from cart");
  }
};

/**
 * ✅ Mettre à jour un élément du panier
 */
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await api.put(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error updating cart item");
  }
};

// MESSAGERIE
/**
 * ✅ Récupérer les conversations
 */
// export const fetchConversations = async () => {
//   try {
//     const response = await api.get("/api/v2/conversations");
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error, 
//       { success: false, data: [] }, 
//       "Erreur lors de la récupération des conversations"
//     );
//   }
// };
// Récupérer les conversations de l'utilisateur
export const fetchConversations = async () => {
  try {
    const response = await api.get("/conversations");
    
    // Vérifier que le champ data contient les conversations
    if (response.data && response.data.success) {
      console.log("Données conversations reçues:", response.data.data);
      return response.data;
    } else {
      console.error("Format de réponse inattendu:", response.data);
      return { success: false, data: [] };
    }
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: [] }, 
      "Erreur lors de la récupération des conversations"
    );
  }
};
/**
 * ✅ Récupérer une conversation par ID
 */
export const fetchConversationById = async (conversationId) => {
  try {
    const response = await api.get(`/api/v2/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: null }, 
      `Erreur lors de la récupération de la conversation ${conversationId}`
    );
  }
};

/**
 * ✅ Créer une conversation
 */
export const createConversation = async (recipientId) => {
  try {
    const response = await api.post("/api/v2/conversations/start", { recipientId });
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: null }, 
      "Erreur lors de la création de la conversation"
    );
  }
};

/**
 * ✅ Récupérer les messages d'une conversation
 */
export const fetchMessages = async (conversationId) => {
  if (!conversationId) {
    console.error("⚠️ fetchMessages appelé sans conversationId !");
    return { success: false, data: [] };
  }

  try {
    const response = await api.get(`/api/v2/messages/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: [] }, 
      `Erreur lors de la récupération des messages pour la conversation ${conversationId}`
    );
  }
};

/**
 * ✅ Envoyer un message
 */
export const sendMessage = async (conversationId, text, recipientId) => {
  try {
    const response = await api.post("/api/v2/messages", { 
      conversationId, 
      text,
      recipientId
    });
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: null }, 
      "Erreur lors de l'envoi du message"
    );
  }
};

/**
 * ✅ Rechercher des utilisateurs
 */
// export const searchUsers = async (query) => {
//   try {
//     const response = await api.get(`/user/search?query=${encodeURIComponent(query)}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { success: false, data: [] }, "Erreur lors de la recherche d'utilisateurs");
//   }
// };
// Fonction pour rechercher des utilisateurs
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/user/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la recherche d'utilisateurs:", error);
    return handleApiError(error, { success: false, data: [] }, "Erreur lors de la recherche d'utilisateurs");
  }
};

export const checkout = async (shippingAddress) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/order/checkout`,
      { shippingAddress },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du passage de la commande', error);
    throw error;
  }
};

// api.js

// Fonction pour récupérer les détails d'une conversation avec les participants
export const fetchConversationDetails = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await axios.get(`${API_BASE_URL}/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Vérifie si la réponse contient la réussite et renvoie les données de la conversation
    if (response.data.success) {
      return response.data.data; // Renvoie les détails de la conversation, y compris les participants
    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement des détails de la conversation');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la conversation:', error);
    throw error; // Renvoyer l'erreur pour pouvoir la gérer dans MessageChat.jsx
  }
};

// Mise à jour de la fonction fetchAllUsers dans api.js pour corriger les erreurs potentielles
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/user/all");
    console.log("Réponse fetchAllUsers:", response.data); // Ajouter pour le débogage
    
    // S'assurer que la structure est correcte pour UserList.jsx
    if (!response.data.users && Array.isArray(response.data)) {
      // Si l'API renvoie directement un tableau au lieu d'un objet {users: [...]}
      return { users: response.data, userCount: response.data.length };
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur détaillée fetchAllUsers:", error.response || error);
    return handleApiError(error, { users: [], userCount: 0 }, "❌ Erreur fetchAllUsers");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/delete-user/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la suppression de l'utilisateur" },
      "❌ Erreur deleteUser"
    );
  }
};





export const deleteSearchHistoryItem = async (productId) => {
  try {
    const response = await api.delete(`/search-history/delete/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique de recherche:", error);
    throw error;
  }
};
export const markMessagesAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentification requise");
    
    const response = await axios.put(`${API_BASE_URL}/messages/read/${conversationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Erreur lors du marquage des messages comme lus");
    }
  } catch (error) {
    console.error("API Error - markMessagesAsRead:", error);
    throw error;
  }
};

/**
 * Bloquer un utilisateur
 */
// Dans api.js

/**
 * Bloque un utilisateur par ID
 * @param {string} userId
 * @returns {Promise<Object>} Réponse de l'API
 */
export const blockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await axios.post(`${API_BASE_URL}/users/block/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors du blocage de l'utilisateur", error);
    throw error;
  }
};

/**
 * Débloquer un utilisateur
 */
export const unblockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Non authentifié" };
    }

    // Changed from DELETE to POST to match your router definition
    const response = await api.post(`/users/unblock/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false }, 
      "Erreur lors du déblocage de l'utilisateur"
    );
  }
};
/**
 * Vérifier si un utilisateur est bloqué
 */
export const isUserBlocked = async (userId) => {
  try {
    const response = await api.get(`/users/is-blocked/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, isBlocked: false }, 
      "Erreur lors de la vérification du statut de blocage"
    );
  }
};

/**
 
 * Récupérer la liste des utilisateurs bloqués
 */
export const getBlockedUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Non authentifié", data: [] };
    }

    const response = await api.get(`/users/blocked`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: [] }, 
      "Erreur lors de la récupération des utilisateurs bloqués"
    );
  }
};

/**
 * Vérifier si un utilisateur est bloqué
 */
export const checkIfUserIsBlocked = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Non authentifié", isBlocked: false };
    }

    const response = await api.get(`/users/is-blocked/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, isBlocked: false }, 
      "Erreur lors de la vérification du statut de blocage"
    );
  }
};

// Dans src/utils/api.js, ajoutez cette fonction
export const checkIfUserIsBlockedBy = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isBlocked: false, error: "Non authentifié" };
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:8000/api/v2"}/blocks/blocked-by/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { 
      isBlocked: response.data.isBlocked, 
      success: response.data.success 
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du statut de blocage:", error);
    return { isBlocked: false, error: error.message };
  }
};

// Dans api.js

/**
 * Récupère le profil utilisateur par ID
 * @param {string} userId
 * @returns {Promise<Object>} Détails de l'utilisateur
 */
export const fetchUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await axios.get(`${API_BASE_URL}/user/profil/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur", error);
    throw error;
  }
};

/**
 * Récupère les commandes de l'utilisateur connecté
 * @returns {Array} Liste des commandes avec les détails des produits incluant les images
 */
export const fetchUserOrders = async () => {
  try {
    // Utiliser le bon chemin d'API
    const response = await api.get("/order/user-orders");
    console.log("API response for orders:", response.data);
    
    // Vérifier la structure de la réponse
    if (response.data && response.data.success) {
      return response.data.orders || [];
    }
    
    // Si la structure est différente
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des commandes:", error.response || error);
    return [];
  }
};

/**
 * ✅ Supprimer une conversation
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: "Erreur lors de la suppression de la conversation" },
      "❌ Erreur deleteConversation"
    );
  }
};
/**
 * ✅ Récupérer toutes les commandes (pour l'admin)
 */
export const fetchAllOrders = async () => {
  try {
    const response = await api.get("/order/all");
    return response.data;
  } catch (error) {
    return handleApiError(error, { orders: [] }, "❌ Erreur fetchAllOrders");
  }
};

// Fonction pour mettre à jour le statut de la commande
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`/api/v2/orders/update-status/${orderId}`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est présent
      }
    });

    console.log("Réponse de la mise à jour de statut:", response.data);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la commande:", error);
  }
};

/**
 * ✅ Récupérer les recommandations d'un utilisateur
 * @param {string} userId - L'ID de l'utilisateur pour récupérer ses recommandations
 */
export const fetchUserRecommendations = async (userId) => {
  try {
    const response = await api.get(`/recommendations/user/${userId}`);
    return response.data; // Retourne les données des recommandations
  } catch (error) {
    return handleApiError(error, { success: false, message: "Erreur lors de la récupération des recommandations" }, "❌ Erreur fetchUserRecommendations");
  }
};
export const fetchProductFavoriteCount = async (productId) => {
  try {
    const response = await api.get(`/favorites/count/${productId}`);
    return response.data.favoriteCount;
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de favoris", error);
    return 0;
  }
};

// Ajoutez cette fonction dans votre fichier api.js

/**
 * Récupère le dernier message d'une conversation
 * @param {string} conversationId - ID de la conversation
 * @returns {Promise} - Objet contenant le dernier message
 */
export const fetchLastMessage = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}/last-message`);
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: null }, 
      `Erreur lors de la récupération du dernier message pour la conversation ${conversationId}`
    );
  }
};

export default api;