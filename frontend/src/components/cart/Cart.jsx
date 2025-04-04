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

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/cart",
        { productId, quantity },
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

 
const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    try {
      // First update the local state immediately for better UX
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Then make the API call
      await axios.put(
        `http://localhost:8000/api/v2/cart/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      // Optionally fetch fresh data after API call completes
      // fetchCart();  // Uncomment if you want to refresh from server
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la quantité:", error);
      // Revert the local change on error
      fetchCart(); // Reload the cart to correct state
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};



