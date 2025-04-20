import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchUserOrders } from "../../utils/api";

const MesAchats = ({ searchTerm = "" }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const getUserOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Vérifier si l'utilisateur est connecté
                const userResponse = await fetchUser();
                console.log("User response:", userResponse);
                
                if (userResponse.success && userResponse.user) {
                    setUser(userResponse.user);
                    
                    // Récupérer les commandes
                    console.log("Fetching orders...");
                    const userOrders = await fetchUserOrders();
                    console.log("Orders received:", userOrders);
                    
                    // S'assurer que userOrders est un tableau
                    const ordersArray = Array.isArray(userOrders) ? userOrders : [];
                    
                    setOrders(ordersArray);
                    setFilteredOrders(ordersArray);
                } else {
                    console.log("User not authenticated, redirecting to login");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Erreur complète:", error);
                setError("Une erreur est survenue lors du chargement de vos achats");
            } finally {
                setIsLoading(false);
            }
        };

        getUserOrders();
    }, [navigate]);

    // Effet pour filtrer les commandes quand searchTerm change
    useEffect(() => {
        if (!orders || orders.length === 0) {
            setFilteredOrders([]);
            return;
        }
        
        if (searchTerm.trim() === "") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => 
                order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.status?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        }
    }, [searchTerm, orders]);

    // Formatage de la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Fonction pour afficher/masquer les détails d'une commande
    const toggleOrderDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    // Fonction pour obtenir l'URL de l'image
    const getImageUrl = (product) => {
        if (!product || !product.images) return null;
        
        // Vérifie si l'URL de l'image existe
        if (product.images.length > 0 && product.images[0].url) {
          return `http://localhost:8000/${product.images[0].url}`; // Ajouter le chemin complet de l'image
        }
        
        return "/placeholder-product.png"; // Image de remplacement si aucune image n'est disponible
    };
      
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-xl p-6 text-center">
                <p className="text-red-800">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-amber-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-emerald-800 bg-amber-50 p-4 rounded-lg">Veuillez vous connecter pour voir vos achats</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-800">Mes Achats</h2>
            </div>

            {(!filteredOrders || filteredOrders.length === 0) ? (
                <div className="bg-amber-50 rounded-xl p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-orange-800">
                        {searchTerm ? "Aucun achat ne correspond à votre recherche" : "Vous n'avez pas encore effectué d'achats"}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {searchTerm ? "Essayez avec d'autres termes" : "Parcourez notre catalogue pour trouver des articles qui vous plaisent"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => (
                        <div 
                            key={order._id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-amber-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            Commande
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Passée le {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                   
                                </div>
                                
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <p className="text-sm text-gray-700 mb-2">
                                        <span className="font-medium">Adresse de livraison:</span> {order.shippingAddress}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-4">
                                        <span className="font-medium">Articles:</span> {order.items?.length || 0} produit(s)
                                    </p>
                                    
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-xl font-bold text-orange-700">Total: {order.total} DA</p>
                                        <button 
                                            className="bg-amber-600 hover:bg-amber-400 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                            onClick={() => toggleOrderDetails(order._id)}
                                        >
                                            {expandedOrder === order._id ? "Masquer les détails" : "Voir les détails"}
                                        </button>
                                    </div>
                                </div>

                                {/* Détails des produits - s'affiche uniquement si cette commande est développée */}
                                {expandedOrder === order._id && (
                                    <div className="mt-6 border-t border-gray-200 pt-4">
                                        <h4 className="font-semibold text-lg text-emerald-800 mb-3">Détails des produits</h4>
                                        <div className="space-y-4">
                                            {order.items && Array.isArray(order.items) ? (
                                                order.items.map((item, index) => {
                                                    // Récupère l'URL de l'image si elle existe
                                                    const imageUrl = getImageUrl(item.product);
                                                    
                                                    return (
                                                        <div key={index} className="bg-amber-50 p-4 rounded-lg flex items-center">
                                                            {/* Image du produit */}
                                                            <div className="flex-shrink-0 mr-4">
                                                                {imageUrl ? (
                                                                   <img
                                                                   src={getImageUrl(item.product)} // Utilisation de la fonction pour obtenir l'URL de l'image
                                                                   alt={item.product?.name || "Image du produit"}
                                                                   className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                 />
                                                                 
                                                                ) : (
                                                                    <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                                                                        <span className="text-gray-400 text-xs">Pas d'image</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Détails du produit */}
                                                            <div className="flex-grow">
                                                                <h5 className="font-medium">
                                                                    {item.product?.name || `Produit #${index + 1}`}
                                                                </h5>
                                                                {item.product?.description && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {item.product.description.length > 100 
                                                                            ? `${item.product.description.substring(0, 100)}...` 
                                                                            : item.product.description}
                                                                    </p>
                                                                )}
                                                                {item.seller && (
                                                                    <p className="text-xs text-gray-500 mt-2">
                                                                        Vendu par: {item.seller.username || item.seller.email || "Vendeur inconnu"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Prix */}
                                                            <div className="text-right flex-shrink-0 ml-4">
                                                                <p className="font-bold text-orange-700">{item.price} DA</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-600 italic">Aucun détail disponible pour cette commande</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MesAchats;
