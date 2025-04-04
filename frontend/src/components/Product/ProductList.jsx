import { FiHeart} from "react-icons/fi";
import { fetchProducts, sendMessage } from "../../utils/api";  // Assurez-vous d'importer sendMessage
import FilterMenu from "./FilterMenu";
import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { HiOutlineShoppingBag } from "react-icons/hi";
import { addToCart, removeFromCart } from "../../utils/api";
import { useCart } from "../../components/cart/Cart";
import { useNavigate } from "react-router-dom";

const ProductList = ({ searchTerm, activeCategory, activeSubCategory, isVisible }) => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const cartContext = useCart();
    const navigate = useNavigate();
    
    if (!cartContext) {
      console.error("❌ useCart() est `undefined`. Assurez-vous d'envelopper votre application avec `<CartProvider>`.");
    }
    
    const { cart, addToCart, removeFromCart } = cartContext || { cart: [], addToCart: () => {}, removeFromCart: () => {} };
    
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            setProducts(data.products);
        };
        getProducts();

        // Charger les favoris existants
        const loadFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
        
                const response = await axios.get("http://localhost:8000/api/v2/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.data.success && response.data.data) {
                    // Vérifiez que chaque favori et sa propriété product existent avant d'accéder à _id
                    const favoriteIds = response.data.data
                        .filter(fav => fav && fav.product) // Filtrer les objets null ou sans produit
                        .map(fav => fav.product._id);
                    setFavorites(favoriteIds);
                }
            } catch (error) {
                console.error("❌ Erreur lors du chargement des favoris:", error.response?.data || error);
            }
        };

        loadFavorites();
    }, []);

    const toggleFavorite = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé !");
                return;
            }

            if (favorites.includes(productId)) {
                // Supprimer des favoris
                await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFavorites(prev => prev.filter(id => id !== productId));
                console.log("✅ Produit retiré des favoris");
            } else {
                // Ajouter aux favoris
                await axios.post("http://localhost:8000/api/v2/favorites",
                    { productId },
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );

                setFavorites(prev => [...prev, productId]);
                console.log("✅ Produit ajouté aux favoris");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la gestion des favoris :", error.response?.data || error);
        }
    };

    const handleCartClick = async (productId) => {
        try {
            const cartItem = cart.find(item => item.product?._id === productId);
            
            if (cartItem) {
                await removeFromCart(cartItem._id);
            } else {
                await addToCart(productId, 1);
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout/suppression du panier", error);
        }
    };
    
   

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const filteredProducts = products.filter((product) =>
        (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!activeCategory || product.category._id === activeCategory) &&
        (!activeSubCategory || product.subCategory._id === activeSubCategory) &&
        (!filters.size || product.size?._id === filters.size) &&
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.material || product.material === filters.material) &&
        (!filters.color || product.color === filters.color) &&
        (!filters.condition || product.condition === filters.condition) &&
        (!filters.minPrice || product.price >= filters.minPrice) &&
        (!filters.maxPrice || product.price <= filters.maxPrice)
    );
    const handleContactSeller = async (sellerId, productId) => {
        if (!sellerId || !productId) {
            console.error("❌ Erreur: sellerId ou productId est manquant !");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v2/conversations/start", // ✅ Assure-toi que c'est le bon endpoint
                { userId: sellerId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
    
            if (response.data.success) {
                navigate(`/messages/${response.data.conversationId}`); // ✅ Redirige vers la conversation
            } else {
                console.error("❌ Erreur lors de la création de la conversation:", response.data.message);
            }
        } catch (error) {
            console.error("❌ Erreur API contact vendeur :", error.response?.data || error);
        }
    };
    
    
    
    return (
        <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-neutral-100 shadow-sm`}>
            {activeCategory && activeSubCategory && (
                <div className="mb-6 pt-4">
                    <FilterMenu activeCategory={activeCategory} activeSubCategory={activeSubCategory} applyFilters={applyFilters} />
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
                        <p className="text-neutral-500 text-lg">Aucun produit trouvé.</p>
                        <p className="text-neutral-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="relative bg-white p-4 rounded-xl shadow-md border-2 border-neutral-300 transition duration-300 hover:shadow-lg transform hover:-translate-y-1"
                        >
                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                                <button
                                    onClick={() => toggleFavorite(product._id)}
                                    className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-shadow"
                                >
                                    <FiHeart
                                        size={20}
                                        className={`transition duration-300 ${favorites.includes(product._id)
                                            ? "text-red-800 fill-red-800"
                                            : "text-red-800 hover:fill-red-700"
                                            }`}
                                    />
                                </button>
                                
                                
                                
                                <button
                                    onClick={() => handleCartClick(product._id)}
                                    className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-all duration-300 active:bg-green-50"
                                >
                                    <HiOutlineShoppingBag
                                        size={20}
                                        className={`transition duration-300 ${
                                        cart.some(item => item.product?._id === product._id)
                                            ? "text-green-600 fill-green-600"
                                            : "text-gray-600 hover:text-green-600 active:text-green-600 active:fill-green-600"
                                        }`}
                                    />
                                </button>

                                <button 
  onClick={() => {
    console.log("🔍 Produit sélectionné :", product);
    console.log("📢 seller trouvé :", product?.seller);

    if (product.seller) { // ✅ Correction ici
      handleContactSeller(product.seller, product._id); // ✅ On envoie directement product.seller
    } else {
      console.error("❌ Erreur: Ce produit n'a pas de vendeur défini !");
    }
  }}
  className="bg-blue-600 text-white p-2 mt-2 rounded hover:bg-blue-700 transition"
>
  Contacter le vendeur
</button>






                            </div>

                            <div className="w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mb-4">
                                <img
                                    src={product.images[0]?.url || "https://via.placeholder.com/250"}
                                    alt={product.name}
                                    className="w-full h-full object-contain hover:scale-105 transition duration-300"
                                />
                            </div>

                            <div className="mt-2 text-center">
                                <h3 className="text-neutral-800 font-semibold text-md truncate">{product.name}</h3>
                                <p className="text-amber-800 font-bold text-lg mt-1">{product.price} DA</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;