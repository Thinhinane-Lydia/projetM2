

// // import axios from "axios";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// // // ✅ Récupérer toutes les catégories avec leurs sous-catégories
// // export const fetchCategories = async () => {
// //   try {
// //     const response = await axios.get(`${API_URL}/categories/all`);
// //     console.log("Catégories reçues :", response.data.categories); // Debug
// //     return response.data.categories;
// //   } catch (error) {
// //     console.error("Erreur lors de la récupération des catégories :", error);
// //     return [];
// //   }
// // };
// // // ✅ Récupérer les sous-catégories d'une catégorie spécifique
// // export const fetchSubCategories = async (categoryId) => {
// //   try {
// //     const response = await axios.get(`${API_URL}/subcategories/${categoryId}`);
// //     console.log("✅ Réponse API sous-catégories :", response.data.subCategories); // ✅ Debug
// //     return response.data.subCategories;
// //   } catch (error) {
// //     console.error("❌ Erreur lors de la récupération des sous-catégories :", error);
// //     return [];
// //   }
// // };


// // // ✅ Récupérer tous les produits
// // export const getAllProducts = async () => {
// //   try {
// //     const response = await axios.get(`${API_URL}/products/all`);
// //     console.log("Produits reçus :", response.data.products); // Debug
// //     return response.data.products;
// //   } catch (error) {
// //     console.error("Erreur lors de la récupération des produits :", error);
// //     return [];
// //   }
// // };

// // // ✅ Ajouter un produit
// // export const addProduct = async (productData) => {
// //   try {
// //     const response = await axios.post(`${API_URL}/products/add`, productData, {
// //       headers: { "Content-Type": "application/json" },
// //     });
// //     console.log("Produit ajouté :", response.data);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Erreur lors de l'ajout du produit :", error);
// //     throw error;
// //   }
// // };

// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000/api/v2";

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

// export const fetchSizesBySubCategory = async (subCategoryId) => {
//   const url = `http://localhost:8000/api/v2/sizes/subcategory/${subCategoryId}`; // 🔥 Vérifie cette URL dans Thunder Client !
  
//   console.log("🔍 Requête envoyée à :", url); // ✅ Vérifie l'URL exacte avant de l'envoyer

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Erreur API: ${response.status} ${response.statusText}`); // ✅ Voir s'il y a une erreur 404 ou 500
//     }

//     const data = await response.json();
//     console.log("✅ Réponse JSON reçue :", data); // ✅ Vérifie que la réponse est bien du JSON
//     return data;
//   } catch (error) {
//     console.error("🚨 Erreur API fetchSizesBySubCategory :", error);
//     return { sizes: [] }; // ✅ Évite les crashs en retournant un tableau vide
//   }
// };
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v2";

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const fetchSubCategories = async (categoryId) => {
  const response = await axios.get(`${API_BASE_URL}/subcategories/${categoryId}`);
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

// Récupérer les tailles par sous-catégorie
export const fetchSizesBySubCategory = async (subCategoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sizes/subcategory/${subCategoryId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur API fetchSizesBySubCategory :", error);
    return { sizes: [] };
  }
};

// Récupérer les produits filtrés
export const fetchFilteredProducts = async (filters) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, { params: filters });
    return response.data.products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits filtrés :", error);
    return [];
  }
};
