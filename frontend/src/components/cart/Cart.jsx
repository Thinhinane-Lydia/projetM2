

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v2/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Données du panier reçues:", response.data);
      setCart(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement du panier :", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      // Vérifier si le produit est déjà dans le panier
      const existingItem = cart.find(item => item.product?._id === productId);
      
      if (existingItem) {
        // Le produit est déjà dans le panier, pas besoin de l'ajouter à nouveau
        return;
      }
      
      // Ajouter le produit au panier (sans quantité)
      const response = await axios.post(
        "http://localhost:8000/api/v2/cart",
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCart([...cart, response.data]);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au panier :", error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v2/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(cart.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du panier :", error);
    }
  };

  // La fonction de mise à jour de la quantité n'est plus nécessaire, elle peut être supprimée
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};