
// import axios from "axios";

// // Base URL configuration
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// <<<<<<< HEAD
// /**
//  * ✅ Récupérer toutes les catégories
//  */
// export const fetchCategories = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/categories`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur fetchCategories :", error);
//     return { categories: [] };
//   }
// };


// /**
//  * ✅ Récupérer les tailles disponibles pour une sous-catégorie spécifique
//  */
// export const fetchSizesBySubCategory = async (subCategoryId) => {
//   if (!subCategoryId || typeof subCategoryId !== "string") {
//     console.error("❌ fetchSizesBySubCategory : subCategoryId invalide !");
//     return { sizes: [] };
//   }
//   try {
//     console.log(`🔍 Appel API: ${API_BASE_URL}/sizes/subcategory/${subCategoryId}`);
//     const response = await axios.get(`${API_BASE_URL}/sizes/subcategory/${subCategoryId}`);
//     console.log("✅ Réponse des tailles:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur fetchSizesBySubCategory :", error);
//     return { sizes: [] };
//   }
// };

// /**
//  * ✅ Récupérer les produits avec des filtres (recherche avancée)
//  */
// export const fetchFilteredProducts = async (filters) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products`, { 
//       params: filters,
//       withCredentials: true, // 🔥 Assure que les cookies d'authentification sont envoyés
//     });
//     return response.data.products;
//   } catch (error) {
//     console.error("❌ Erreur fetchFilteredProducts :", error);
//     return [];
//   }
// };

// /**
//  * ✅ Récupérer les informations de l'utilisateur connecté
//  */
// export const fetchUser = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/user/me`, {
//       method: "GET",
//       credentials: "include", // 🔥 Envoie les cookies d'authentification
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     if (!data.success) throw new Error(data.message || "Échec de la récupération de l'utilisateur");
//     return data;
//   } catch (error) {
//     console.error("❌ Erreur fetchUser:", error);
//     return { success: false };
//   }
// };

// /**
//  * ✅ Ajouter un produit (Uniquement pour les utilisateurs connectés)
//  */
// export const createProduct = async (productData) => {
//   try {
//     // Assurez-vous que productData est un FormData
//     if (!(productData instanceof FormData)) {
//       console.error("❌ createProduct: productData n'est pas un FormData");
//       return { success: false, message: "Format de données incorrect" };
//     }
    
//     // Vérifiez le contenu du FormData (debug)
//     console.log("Contenu du FormData pour création:");
//     for (let [key, value] of productData.entries()) {
//       if (key === "images") {
//         console.log(`${key}: ${value instanceof File ? value.name : value} (${value instanceof File ? value.type : 'non-fichier'})`);
//       } else {
//         console.log(`${key}: ${value}`);
//       }
//     }
    
//     const response = await axios.post(`${API_BASE_URL}/products/create`, productData, {
//       withCredentials: true,
//       headers: { 
//         "Content-Type": "multipart/form-data" // Crucial pour l'envoi de fichiers
//       }
//     });

//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur createProduct:", error);
//     return { 
//       success: false, 
//       message: error.response?.data?.message || "Erreur lors de l'ajout du produit" 
//     };
//   }
// };

// /**
//  * ✅ Récupérer tous les produits (avec les infos du vendeur et les ratings moyens)
//  */
// export const fetchProducts = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products`, {
//       params: {
//         populate: "seller,ratings", // Ajout de ratings pour récupérer les évaluations moyennes
//       },
//       withCredentials: true,
//     });
//     console.log("📥 Produits reçus:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur fetchProducts:", error);
//     return { products: [] };
//   }
// };

// /**
//  * ✅ Récupérer le rating moyen d'un produit
//  */
// export const fetchProductRating = async (productId) => {
//   try {
//     if (!productId) {
//       console.error("❌ fetchProductRating: productId manquant");
//       return { rating: 0, count: 0 };
//     }
    
//     const response = await axios.get(`${API_BASE_URL}/comments/rating/${productId}`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur fetchProductRating:", error);
//     return { rating: 0, count: 0 };
//   }
// };

// export const fetchUserProducts = async (userId) => {
//   try {
//     if (!userId) {
//       console.error("❌ fetchUserProducts: userId manquant");
//       return [];
//     }
    
//     const response = await axios.get(`${API_BASE_URL}/products`, {
//       params: { seller: userId },
//       withCredentials: true, // Assure que les cookies d'authentification sont envoyés
//     });
    
//     return response.data.products || [];
//   } catch (error) {
//     console.error("❌ Erreur fetchUserProducts:", error);
//     return [];
//   }
// };

// export const deleteProduct = async (productId) => {
//   try {
//     const response = await fetch(`http://localhost:8000/api/v2/products/${productId}`, {
//       method: "DELETE",
//       credentials: "include", // ✅ Envoie les cookies pour vérifier l'authentification
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("❌ Erreur deleteProduct :", error);
//     return { success: false, message: "Erreur lors de la suppression du produit" };
//   }
// };

// export const updateProduct = async (productId, updatedData) => {
//   try {
//     // Assurez-vous que updatedData est un FormData
//     if (!(updatedData instanceof FormData)) {
//       console.error("❌ updateProduct: updatedData n'est pas un FormData");
//       return { success: false, message: "Format de données incorrect" };
//     }
    
//     // Vérifiez le contenu du FormData (debug)
//     console.log("Contenu du FormData pour mise à jour:");
//     for (let [key, value] of updatedData.entries()) {
//       if (key === "images") {
//         console.log(`${key}: ${value instanceof File ? value.name : value} (${value instanceof File ? value.type : 'non-fichier'})`);
//       } else {
//         console.log(`${key}: ${value}`);
//       }
//     }
    
//     const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updatedData, {
//       withCredentials: true,
//       headers: { 
//         "Content-Type": "multipart/form-data" // Crucial pour l'envoi de fichiers
//       }
//     });

//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur updateProduct:", error);
//     return { 
//       success: false, 
//       message: error.response?.data?.message || "Erreur lors de la mise à jour du produit" 
//     };
//   }
// };

// /**
//  * ✅ Déconnexion de l'utilisateur (supprime le cookie JWT)
//  */
// export const logout = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/user/logout`, {
//       method: "GET",
//       credentials: "include", // 🔥 Important pour les cookies
//     });
    
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("❌ Erreur logout:", error);
//     return { success: false, message: "Erreur lors de la déconnexion" };
//   }
// };

// // Ajouter un commentaire
// export const createComment = async (commentData) => {
//   try {
//     console.log("Envoi du commentaire:", commentData);
//     const response = await axios.post(`${API_BASE_URL}/comments/create`, commentData, {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur createComment :", error.response?.data || error.message);
//     return { success: false, message: "Erreur lors de l'ajout du commentaire" };
//   }
// };

// // Récupérer les commentaires d'un produit
// export const fetchCommentsByProduct = async (productId) => {
//   try {
//     if (!productId) {
//       console.error("❌ fetchCommentsByProduct: productId manquant");
//       return [];
//     }
    
//     console.log(`🔍 Récupération des commentaires pour le produit: ${productId}`);
//     const response = await axios.get(`${API_BASE_URL}/comments/${productId}`, {
//       withCredentials: true // Pour obtenir les informations sur l'utilisateur courant
//     });
    
//     console.log("Commentaires reçus:", response.data.comments);
//     return response.data.comments || [];
//   } catch (error) {
//     console.error("❌ Erreur fetchCommentsByProduct :", error);
//     return [];
//   }
// };

// // Supprimer un commentaire
// export const deleteComment = async (commentId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur deleteComment :", error);
//     return { success: false, message: "Erreur lors de la suppression du commentaire" };
//   }
// };
// /**
//  * Enregistrer une recherche dans l'historique
//  * @param {Object} data - Les données de la recherche, y compris le terme et les produits associés.
//  * @returns {Promise} La réponse de l'API.
//  */
// export const saveSearchHistory = async (data) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/search-history/add`,
//       data,
//       { withCredentials: true } // Assure que les cookies sont envoyés
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de l'enregistrement de la recherche", error);
//     return { success: false, message: error.message };
//   }
// };

// /**
//  * Récupérer l'historique des recherches d'un utilisateur
//  * @returns {Promise} Les données de l'historique des recherches.
//  */
// export const fetchSearchHistory = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/search-history/history`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de la récupération de l'historique des recherches", error);
//     return { success: false, message: error.message };
//   }
// };

// /**
//  * ✅ Mettre à jour le profil utilisateur
//  * @param {FormData} profileData - Données du profil à mettre à jour (peut inclure avatar, nom, email, etc.)
//  * @returns {Promise} Réponse de l'API avec le profil mis à jour
//  */
// export const updateUserProfile = async (profileData) => {
//   try {
//     // Vérifier que profileData est un FormData
//     if (!(profileData instanceof FormData)) {
//       console.error("❌ updateUserProfile: profileData n'est pas un FormData");
//       return { success: false, message: "Format de données incorrect" };
//     }

//     // Debug: Afficher le contenu du FormData
//     console.log("Contenu du FormData pour mise à jour du profil:");
//     for (let [key, value] of profileData.entries()) {
//       console.log(`${key}: ${value instanceof File ? value.name : value}`);
//     }

//     const response = await axios.put(`${API_BASE_URL}/user/update-profile`, profileData, {
//       withCredentials: true,
//       headers: { 
//         "Content-Type": "multipart/form-data" 
//       }
//     });

//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur updateUserProfile:", error);
//     return { 
//       success: false, 
//       message: error.response?.data?.message || "Erreur lors de la mise à jour du profil" 
//     };
//   }
// };
// /**
//  * Créer une catégorie
//  */
// export const createCategory = async (categoryData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur createCategory:", error);
//     return { success: false, message: error.response?.data?.message || "Erreur lors de la création de la catégorie" };
//   }
// };
// // Modifier une catégorie
// export const updateCategory = async (id, categoryData) => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur updateCategory:", error);
//     return { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour de la catégorie" };
//   }
// };
// // Supprimer une catégorie
// export const deleteCategory = async (id) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
//     return response.data; // Assure-toi que la réponse contient { success: true }
//   } catch (error) {
//     console.error("❌ Erreur deleteCategory:", error);
//     return { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de la catégorie" };
//   }
// };

// export const createSize = async (sizeData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/sizes`, sizeData);
//     return response.data;  // Retourne la réponse de l'API
//   } catch (error) {
//     console.error("❌ Erreur createSize:", error);
//     return { success: false, message: error.response?.data?.message || "Erreur lors de la création de la taille" };
//   }
// };
// export const deleteSize = async (id) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/sizes/${id}`);  // URL avec l'ID de la taille
//     return response.data;  // Retourne la réponse de l'API
//   } catch (error) {
//     console.error("❌ Erreur deleteSize:", error);
//     return { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de la taille" };
//   }
// };
// export const fetchSizes = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/sizes`);
//     return response.data; // La réponse doit contenir { success: true, sizes }
//   } catch (error) {
//     console.error("❌ Erreur fetchSizes:", error);
//     return { sizes: [] };  // Retourne un tableau vide en cas d'erreur
//   }
// };

// // Récupérer les sous-catégories pour une catégorie spécifique
// export const fetchSubCategories = async (categoryId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/subcategories/${categoryId}`);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Erreur fetchSubCategories:', error);
//     return { success: false, subCategories: [] };
//   }
// };

// // Créer une sous-catégorie
// export const createSubCategory = async (subCategoryData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/subcategories`, subCategoryData);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Erreur createSubCategory:', error);
//     return { success: false, message: error.response?.data?.message || 'Erreur lors de la création de la sous-catégorie' };
//   }
// };

// // Modifier une sous-catégorie
// export const updateSubCategory = async (id, subCategoryData) => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/subcategories/${id}`, subCategoryData);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Erreur updateSubCategory:', error);
//     return { success: false, message: error.response?.data?.message || 'Erreur lors de la mise à jour de la sous-catégorie' };
//   }
// };

// // Supprimer une sous-catégorie
// export const deleteSubCategory = async (id) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/subcategories/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Erreur deleteSubCategory:', error);
//     return { success: false, message: error.response?.data?.message || 'Erreur lors de la suppression de la sous-catégorie' };
//   }
// };
// =======

// // Helper for error handling
// const handleApiError = (error, fallbackValue, errorMessage) => {
//   console.error(errorMessage || "API Error:", error);
//   if (fallbackValue !== undefined) {
//     return fallbackValue;
//   }
//   throw error;
// };

// // Create a reusable axios instance with common configuration
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true
// });

// // Add authentication token to all requests
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // Category and subcategory endpoints
// export const fetchCategories = async () => {
//   try {
//     const response = await api.get("/categories");
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { categories: [] }, "Error fetching categories");
//   }
// };

// export const fetchSubCategories = async (categoryId) => {
//   try {
//     const response = await api.get(`/subcategories/${categoryId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { subCategories: [] }, "Error fetching subcategories");
//   }
// };

// // Product endpoints
// export const fetchProducts = async () => {
//   try {
//     const response = await api.get("/products");
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { products: [] }, "Error fetching products");
//   }
// };

// export const fetchFilteredProducts = async (filters) => {
//   try {
//     const response = await api.get("/products", { params: filters });
//     return response.data.products || [];
//   } catch (error) {
//     return handleApiError(error, [], "Error fetching filtered products");
//   }
// };

// // Size endpoints
// export const fetchSizesBySubCategory = async (subCategoryId) => {
//   try {
//     const response = await api.get(`/sizes/subcategory/${subCategoryId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { sizes: [] }, "Error fetching sizes");
//   }
// };

// // Favorites endpoints
// export const addToFavorites = async (productId) => {
//   try {
//     console.log("🔹 Adding to favorites:", productId);
//     const response = await api.post("/favorites", { productId });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, null, "Error adding to favorites");
//   }
// };

// export const removeFromFavorites = async (productId) => {
//   try {
//     console.log("🔹 Removing from favorites:", productId);
//     const response = await api.delete(`/favorites/${productId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, null, "Error removing from favorites");
//   }
// };

// export const checkIfFavorite = async (productId) => {
//   try {
//     const response = await api.get(`/favorites/check/${productId}`);
//     return response.data.isFavorite;
//   } catch (error) {
//     return handleApiError(error, false, "Error checking favorite status");
//   }
// };

// export const fetchUserFavorites = async () => {
//   try {
//     const response = await api.get("/favorites");
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, [], "Error fetching user favorites");
//   }
// };

// // Cart endpoints
// export const fetchCart = async () => {
//   try {
//     const response = await api.get("/cart");
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, [], "Error fetching cart");
//   }
// };

// export const addToCart = async (productId, quantity = 1) => {
//   try {
//     const response = await api.post("/cart", { productId, quantity });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, null, "Error adding to cart");
//   }
// };

// export const removeFromCart = async (cartItemId) => {
//   try {
//     const response = await api.delete(`/cart/${cartItemId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, null, "Error removing from cart");
//   }
// };

// export const updateCartItem = async (cartItemId, quantity) => {
//   try {
//     const response = await api.put(`/cart/${cartItemId}`, { quantity });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, null, "Error updating cart item");
//   }
// };

// // Messaging endpoints
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

// export const fetchConversationById = async (conversationId) => {
//   try {
//     const response = await api.get(`/api/v2/conversations/${conversationId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error, 
//       { success: false, data: null }, 
//       `Erreur lors de la récupération de la conversation ${conversationId}`
//     );
//   }
// };


// export const createConversation = async (recipientId) => {
//   try {
//     const response = await api.post("/api/v2/conversations/start", { recipientId }); // ✅ Change ici !
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error, 
//       { success: false, data: null }, 
//       "Erreur lors de la création de la conversation"
//     );
//   }
// };



 
// export const fetchMessages = async (conversationId) => {
//   if (!conversationId) {
//     console.error("⚠️ fetchMessages appelé sans conversationId !");
//     return { success: false, data: [] };
//   }

//   try {
//     const response = await api.get(`/api/v2/messages/conversation/${conversationId}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error, 
//       { success: false, data: [] }, 
//       `Erreur lors de la récupération des messages pour la conversation ${conversationId}`
//     );
//   }
// };



// export const sendMessage = async (conversationId, text, recipientId) => {
//   try {
//     const response = await api.post("/api/v2/messages", { 
//       conversationId, 
//       text,
//       recipientId
//     });
//     return response.data;
//   } catch (error) {
//     return handleApiError(
//       error, 
//       { success: false, data: null }, 
//       "Erreur lors de l'envoi du message"
//     );
//   }
// };

// export const searchUsers = async (query) => {
//   try {
//     const response = await api.get(`/user/search?query=${encodeURIComponent(query)}`);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, { success: false, data: [] }, "Erreur lors de la recherche d'utilisateurs");
//   }
// };
// export default api;
// >>>>>>> nom-de-ta-branche


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
 * ✅ Mettre à jour le profil utilisateur
 */
export const updateUserProfile = async (profileData) => {
  try {
    // Vérifier que profileData est un FormData
    if (!(profileData instanceof FormData)) {
      console.error("❌ updateUserProfile: profileData n'est pas un FormData");
      return { success: false, message: "Format de données incorrect" };
    }

    // Debug: Afficher le contenu du FormData
    console.log("Contenu du FormData pour mise à jour du profil:");
    for (let [key, value] of profileData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const response = await api.put("/user/update-profile", profileData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      }
    });

    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour du profil" },
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
export const createSubCategory = async (subCategoryData) => {
  try {
    const response = await api.post("/subcategories", subCategoryData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || 'Erreur lors de la création de la sous-catégorie' },
      '❌ Erreur createSubCategory'
    );
  }
};

/**
 * ✅ Modifier une sous-catégorie
 */
export const updateSubCategory = async (id, subCategoryData) => {
  try {
    const response = await api.put(`/subcategories/${id}`, subCategoryData);
    return response.data;
  } catch (error) {
    return handleApiError(
      error,
      { success: false, message: error.response?.data?.message || 'Erreur lors de la mise à jour de la sous-catégorie' },
      '❌ Erreur updateSubCategory'
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
    const response = await api.post("/cart", { productId, quantity });
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
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error updating cart item");
  }
};

// MESSAGERIE
/**
 * ✅ Récupérer les conversations
 */
export const fetchConversations = async () => {
  try {
    const response = await api.get("/api/v2/conversations");
    return response.data;
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
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/user/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { success: false, data: [] }, "Erreur lors de la recherche d'utilisateurs");
  }
};

export default api;