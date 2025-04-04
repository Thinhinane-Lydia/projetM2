
// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000/api/v2";

 
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

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//       console.warn("❌ Aucun token trouvé !");
//   }
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };


// export const fetchCategories = async () => {
//   const response = await axios.get(`${API_BASE_URL}/categories`);
//   return response.data;
// };

// export const fetchSubCategories = async (categoryId) => {
//   const response = await axios.get(`${API_BASE_URL}/subcategories/${categoryId}`);
//   return response.data;
// };

// export const fetchProducts = async () => {
//   const response = await axios.get(`${API_BASE_URL}/products`);
//   return response.data;
// };

// // Récupérer les tailles par sous-catégorie
// export const fetchSizesBySubCategory = async (subCategoryId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/sizes/subcategory/${subCategoryId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Erreur API fetchSizesBySubCategory :", error);
//     return { sizes: [] };
//   }
// };

// // Récupérer les produits filtrés
// export const fetchFilteredProducts = async (filters) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products`, { params: filters });
//     return response.data.products;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des produits filtrés :", error);
//     return [];
//   }
// };

// // Ajouter un produit aux favoris
// export const addToFavorites = async (productId) => {
//   console.log("🔹 Envoi de la requête Favori :", productId);
//   const response = await axios.post(`${API_BASE_URL}/favorites`, 
//       { productId }, 
//       { headers: getAuthHeader() }
//   );
//   return response.data;
// };


// export const removeFromFavorites = async (productId) => {
//   try {
//       console.log("🔹 Suppression favori pour le produit :", productId);
//       const response = await axios.delete(`${API_BASE_URL}/favorites/${productId}`, {
//           headers: getAuthHeader()
//       });
//       return response.data;
//   } catch (error) {
//       console.error("❌ Erreur lors de la suppression des favoris :", error.response?.data || error);
//       throw error;
//   }
// };


// // Vérifier si un produit est en favori
// export const checkIfFavorite = async (productId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/favorites/check/${productId}`, { withCredentials: true });
//     return response.data.isFavorite;
//   } catch (error) {
//     console.error("Erreur lors de la vérification des favoris :", error);
//     return false;
//   }
// };

// // Récupérer tous les favoris de l'utilisateur
// export const fetchFavorites = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/favorites`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors du chargement des favoris", error);
//     return [];
//   }
// };
// export const fetchUserFavorites = async () => {
//   try {
//       const response = await axios.get(`${API_BASE_URL}/favorites`, {
//           headers: getAuthHeader()
//       });
//       console.log("Favoris récupérés:", response.data);
//       return response.data;
//   } catch (error) {
//       console.error("Erreur lors du chargement des favoris", error);
//       throw error;
//   }

// };
// // ✅ Récupérer les articles du panier
// export const fetchCart = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/v2/cart", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur lors du chargement du panier :", error);
//     return [];
//   }
// };


// // ✅ Ajouter un produit au panier
// export const addToCart = async (productId, quantity = 1) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/cart`,
//       { productId, quantity },
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur lors de l'ajout au panier :", error);
//     throw error;
//   }
// };

// // ✅ Supprimer un produit du panier
// export const removeFromCart = async (cartItemId) => {
//   try {
//       const response = await axios.delete(`http://localhost:8000/api/v2/cart/${cartItemId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       return response.data;
//   } catch (error) {
//       console.error("❌ Erreur lors de la suppression du panier :", error);
//       throw error;
//   }
// };


// // ✅ Modifier la quantité d'un produit
// export const updateCartItem = async (cartItemId, quantity) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/cart/${cartItemId}`,
//       { quantity },
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("❌ Erreur lors de la mise à jour du panier :", error);
//     throw error;
//   }
// };

// const api = axios.create({
//   baseURL: '/api'
// });



// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
// const axiosInstance = axios.create({
//   baseURL: '/api'
// });

// axiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );    
// export const fetchConversations = async () => {
//   try {
//     const response = await axiosInstance.get('/messages/conversations');
//     console.log("📩 Réponse API fetchConversations :", response);
    
//     if (!response || !response.data) {
//       console.error("⚠️ Erreur : réponse API invalide :", response);
//       return { data: [] }; // Retourne un tableau vide pour éviter l'erreur
//     }

//     return response;
//   } catch (error) {
//     console.error("❌ Erreur API fetchConversations :", error);
//     return { data: [] }; // Retourne un tableau vide en cas d'erreur
//   }
// };

// export const fetchMessages = (conversationId) => axiosInstance.get(`/messages/conversations/${conversationId}`);
// export const sendMessage = (data) => axiosInstance.post('/messages/send', data);

 
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

// Category and subcategory endpoints
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    return handleApiError(error, { categories: [] }, "Error fetching categories");
  }
};

export const fetchSubCategories = async (categoryId) => {
  try {
    const response = await api.get(`/subcategories/${categoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { subCategories: [] }, "Error fetching subcategories");
  }
};

// Product endpoints
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    return handleApiError(error, { products: [] }, "Error fetching products");
  }
};

export const fetchFilteredProducts = async (filters) => {
  try {
    const response = await api.get("/products", { params: filters });
    return response.data.products || [];
  } catch (error) {
    return handleApiError(error, [], "Error fetching filtered products");
  }
};

// Size endpoints
export const fetchSizesBySubCategory = async (subCategoryId) => {
  try {
    const response = await api.get(`/sizes/subcategory/${subCategoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { sizes: [] }, "Error fetching sizes");
  }
};

// Favorites endpoints
export const addToFavorites = async (productId) => {
  try {
    console.log("🔹 Adding to favorites:", productId);
    const response = await api.post("/favorites", { productId });
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error adding to favorites");
  }
};

export const removeFromFavorites = async (productId) => {
  try {
    console.log("🔹 Removing from favorites:", productId);
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error removing from favorites");
  }
};

export const checkIfFavorite = async (productId) => {
  try {
    const response = await api.get(`/favorites/check/${productId}`);
    return response.data.isFavorite;
  } catch (error) {
    return handleApiError(error, false, "Error checking favorite status");
  }
};

export const fetchUserFavorites = async () => {
  try {
    const response = await api.get("/favorites");
    return response.data;
  } catch (error) {
    return handleApiError(error, [], "Error fetching user favorites");
  }
};

// Cart endpoints
export const fetchCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    return handleApiError(error, [], "Error fetching cart");
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error adding to cart");
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error removing from cart");
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    return handleApiError(error, null, "Error updating cart item");
  }
};

// Messaging endpoints
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


export const createConversation = async (recipientId) => {
  try {
    const response = await api.post("/api/v2/conversations/start", { recipientId }); // ✅ Change ici !
    return response.data;
  } catch (error) {
    return handleApiError(
      error, 
      { success: false, data: null }, 
      "Erreur lors de la création de la conversation"
    );
  }
};



 
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

export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/user/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { success: false, data: [] }, "Erreur lors de la recherche d'utilisateurs");
  }
};
export default api;