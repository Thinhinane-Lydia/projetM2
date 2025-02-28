import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Utilisation de l'URL du backend

// ✅ Fonction pour récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/all`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw error;
  }
};

// ✅ Fonction pour ajouter un produit
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products/add`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    throw error;
  }
};
