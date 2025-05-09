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
  const [animateOrder, setAnimateOrder] = useState(null);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userResponse = await fetchUser();
        
        if (userResponse.success && userResponse.user) {
          setUser(userResponse.user);
          
          const userOrders = await fetchUserOrders();
          const ordersArray = Array.isArray(userOrders) ? userOrders : [];
          
          setOrders(ordersArray);
          setFilteredOrders(ordersArray);
        } else {
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      setAnimateOrder(orderId);
      setTimeout(() => setAnimateOrder(null), 700);
    }
  };

  const getImageUrl = (product) => {
    if (!product || !product.images) return null;
    
    if (product.images.length > 0 && product.images[0].url) {
      return `http://localhost:8000/${product.images[0].url}`;
    }
    
    return "/placeholder-product.png";
  };
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-amber-100 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-12 text-center shadow-lg border-l-4 border-red-500 max-w-2xl mx-auto my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-800 text-xl font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-amber-50 p-8 rounded-2xl shadow-lg text-center max-w-2xl mx-auto my-12 border border-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-center text-xl font-bold text-emerald-800 mb-3">Veuillez vous connecter pour voir vos achats</p>
        <p className="text-gray-600 mb-6">Découvrez l'historique de vos achats et suivez vos commandes en cours</p>
        <button 
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête stylisé */}
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl shadow-lg p-8 mb-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#pattern)" />
            </svg>
            <defs>
              <pattern id="pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5 M5,0 L5,10" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Mes Achats</h2>
              <p className="text-amber-100">Bienvenue dans votre espace personnel, {user.username || user.email.split('@')[0]}</p>
            </div>
            <div className="hidden md:block h-20 w-20 bg-white bg-opacity-20 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {(!filteredOrders || filteredOrders.length === 0) ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center relative overflow-hidden border border-amber-100">
            <div className="absolute inset-0 bg-opacity-5 bg-amber-500 pattern-diagonal-lines-sm"></div>
            <div className="relative z-10">
              <div className="inline-block p-6 bg-amber-50 rounded-full mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-orange-800 mb-4">
                {searchTerm ? "Aucun achat ne correspond à votre recherche" : "Votre carnet d'achats est vide"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? "Essayez avec d'autres termes ou consultez tous vos achats en effaçant votre recherche." 
                  : "C'est le moment parfait pour découvrir nos trésors et commencer votre collection de merveilles!"}
              </p>
              <button 
                onClick={() => navigate("/produits")}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Découvrir nos produits
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {filteredOrders.map((order, idx) => (
              <div 
                key={order._id} 
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100 transform transition-all duration-500 ${animateOrder === order._id ? 'scale-105' : ''} ${idx % 2 === 0 ? 'hover:shadow-amber-200' : 'hover:shadow-orange-200'} hover:shadow-2xl`}
              >
                <div className="p-8">
                  {/* En-tête de la commande */}
                  <div className={`flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6 border-b ${idx % 2 === 0 ? 'border-amber-200' : 'border-orange-200'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx % 2 === 0 ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Commande #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </h3>
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    {/* Badge de statut */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      order.status === 'delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : order.status === 'shipped' 
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-500' 
                          : order.status === 'shipped' 
                            ? 'bg-blue-500'
                            : order.status === 'processing'
                              ? 'bg-amber-500'
                              : 'bg-gray-500'
                      }`}></span>
                      {order.status === 'delivered' 
                        ? 'Livré' 
                        : order.status === 'shipped' 
                          ? 'En cours de livraison'
                          : order.status === 'processing'
                            ? 'En préparation'
                            : 'En attente'}
                    </div>
                  </div>
                  
                  {/* Informations de la commande */}
                  <div className="py-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                        <p className="text-gray-800 font-medium flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {order.shippingAddress}
                        </p>
                      </div>
                      <div className="md:border-l md:border-gray-200 md:pl-6">
                        <p className="text-sm text-gray-500 mb-1">Méthode de paiement</p>
                        <p className="text-gray-800 font-medium flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          {order.paymentMethod || "Paiement à la livraison"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${idx % 2 === 0 ? 'bg-amber-50' : 'bg-orange-50'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${idx % 2 === 0 ? 'text-amber-600' : 'text-orange-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Articles</p>
                          <p className="text-gray-800 font-medium">{order.items?.length || 0} produit(s)</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className={`text-2xl font-bold ${idx % 2 === 0 ? 'text-amber-600' : 'text-orange-600'}`}>
                          {order.total} DA
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <button 
                        className={`group relative overflow-hidden ${idx % 2 === 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-orange-500 hover:bg-orange-600'} text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {expandedOrder === order._id ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              Masquer les détails
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Voir les détails
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white opacity-10 transition-all duration-300 group-hover:scale-100"></span>
                      </button>
                    </div>
                  </div>

                  {/* Détails des produits */}
                  {expandedOrder === order._id && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 animate-fadeIn">
                      <h4 className="font-semibold text-lg text-gray-800 mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${idx % 2 === 0 ? 'text-amber-500' : 'text-orange-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Détails des produits
                      </h4>
                      <div className="space-y-6">
                        {order.items && Array.isArray(order.items) ? (
                          order.items.map((item, index) => {
                            const imageUrl = getImageUrl(item.product);
                            
                            return (
                              <div key={index} className={`bg-gradient-to-r ${idx % 2 === 0 ? 'from-amber-50 to-white' : 'from-orange-50 to-white'} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}>
                                <div className="flex flex-col md:flex-row gap-6">
                                  {/* Image du produit */}
                                  <div className="flex-shrink-0">
                                    <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-white">
                                      {imageUrl ? (
                                        <img
                                          src={imageUrl}
                                          alt={item.product?.name || "Image du produit"}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      )}
                                      <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-700">
                                        {item.quantity || 1}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Détails du produit */}
                                  <div className="flex-grow">
                                    <h5 className="text-lg font-medium text-gray-800 mb-2">
                                      {item.product?.name || `Produit #${index + 1}`}
                                    </h5>
                                    {item.product?.description && (
                                      <p className="text-sm text-gray-600 mb-3">
                                        {item.product.description.length > 120 
                                          ? `${item.product.description.substring(0, 120)}...` 
                                          : item.product.description}
                                      </p>
                                    )}
                                    {item.seller && (
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Vendu par: {item.seller.username || item.seller.email || "Vendeur inconnu"}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Prix */}
                                  <div className="md:text-right flex-shrink-0 mt-4 md:mt-0">
                                    <div className="text-sm text-gray-500 mb-1">Prix unitaire</div>
                                    <p className={`text-xl font-bold ${idx % 2 === 0 ? 'text-amber-600' : 'text-orange-600'}`}>
                                      {item.price} DA
                                    </p>
                                    {item.quantity > 1 && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {item.quantity} × {Math.round(item.price / item.quantity)} DA
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center p-8 bg-gray-50 rounded-xl">
                            <p className="text-gray-600 italic">Aucun détail disponible pour cette commande</p>
                          </div>
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
      
      {/* Styles supplémentaires pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .pattern-diagonal-lines-sm {
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H0V0h5z'/%3E%3Cpath d='M0 0h1v1H0V0zm0 2h1v1H0V2zm0 2h1v1H0V4zm0 2h1v1H0V6zM2 0h1v1H2V0zm0 2h1v1H2V2zm0 2h1v1H2V4zm0 2h1v1H2V6zM4 0h1v1H4V0zm0 2h1v1H4V2zm0 2h1v1H4V4zm0 2h1v1H4V6z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default MesAchats;