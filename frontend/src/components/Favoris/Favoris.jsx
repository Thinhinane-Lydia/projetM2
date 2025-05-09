import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Favoris = ({ searchTerm = "" }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [animateEntry, setAnimateEntry] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Effet pour filtrer les produits quand searchTerm change
  useEffect(() => {
    if (favorites.length > 0) {
      // Redémarrer l'animation quand les résultats de recherche changent
      setAnimateEntry(false);
      setTimeout(() => setAnimateEntry(true), 50);
    }
  }, [searchTerm, favorites]);

  const fetchFavorites = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé !");
        setLoading(false);
        setError("Veuillez vous connecter pour voir vos favoris.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/v2/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavorites(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des favoris:", error);
      
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else {
        setError("Impossible de charger vos favoris. Veuillez réessayer.");
      }
      
      setLoading(false);
    }
  };

  const handleDelete = async (e, favorite) => {
    // Empêcher la navigation lors du clic sur le bouton supprimer
    e.stopPropagation();
    
    const productId = favorite.product?._id;
    
    if (!productId) {
      setError("Impossible de supprimer ce favori: ID de produit manquant.");
      return;
    }

    if (!window.confirm("Voulez-vous vraiment retirer ce produit des favoris ?")) return;

    try {
      setDeleting(favorite._id);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentification requise. Veuillez vous reconnecter.");
        setDeleting(null);
        return;
      }
      
      const response = await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const updatedFavorites = favorites.filter(fav => fav._id !== favorite._id);
        setFavorites(updatedFavorites);
        setNotification(`"${favorite.product?.name}" retiré des favoris`);
      } else {
        setError("Erreur lors de la suppression du favori !");
      }
      
      setDeleting(null);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error.response || error);
      
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else {
        setError(error.response?.data?.message || "Impossible de supprimer ce favori. Veuillez réessayer.");
      }
      
      setDeleting(null);
    }
  };

  // Navigation vers la page de détail du produit
  const handleProductClick = (productId) => {
    navigate(`/InfoProduct/${productId}`);
  };

  const filteredFavorites = favorites.filter(fav => 
    fav.product && 
    (!searchTerm || fav.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="relative">
          <div className="animate-ping absolute h-16 w-16 rounded-full bg-amber-400 opacity-75"></div>
          <div className="animate-spin relative h-16 w-16 rounded-full border-4 border-transparent border-t-amber-600 border-b-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 rounded-xl p-6 text-amber-800">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 overflow-hidden">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6 animate-slideInFromTop">
        <h2 className="text-2xl font-bold text-amber-800 relative">
          Mes Favoris
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
        </h2>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
          {filteredFavorites.length} {filteredFavorites.length <= 1 ? 'produit' : 'produits'}
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center animate-slideUp">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {notification}
          </div>
        </div>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="bg-amber-50 rounded-xl p-12 text-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-amber-800">
            {searchTerm ? "Aucun produit ne correspond à votre recherche" : "Vous n'avez pas encore de favoris"}
          </h3>
          <p className="mt-2 text-gray-600">
            {searchTerm ? "Essayez avec d'autres termes" : "Ajoutez des produits à vos favoris pour les retrouver ici"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((favorite, index) => (
            <div 
              id={`favorite-${favorite._id}`}
              key={favorite._id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 cursor-pointer flex flex-col
                        ${animateEntry ? 'animate-productEntry' : ''}
                        ${hoveredProductId === favorite._id ? 'z-10 transform scale-105 shadow-2xl' : 'z-0'}`}
              onClick={() => handleProductClick(favorite.product._id)}
              style={{
                animationDelay: `${index * 120}ms`,
                transformOrigin: 'center'
              }}
              onMouseEnter={() => setHoveredProductId(favorite._id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="relative w-full pt-[140%] overflow-hidden">
                {favorite.product?.images && favorite.product.images.length > 0 ? (
                  <img
                    src={`http://localhost:8000/${favorite.product.images[0].url}`}
                    alt={favorite.product.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                             ${hoveredProductId === favorite._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-product.png";
                    }}
                  />
                ) : (
                  <img
                    src="/placeholder-product.png"
                    alt="Placeholder"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                             ${hoveredProductId === favorite._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                  />
                )}
                
                {/* Overlay au survol avec effet de gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                             transition-opacity duration-300 
                             ${hoveredProductId === favorite._id ? 'opacity-100' : 'opacity-0'}`}>
                </div>
                
                {/* Badge prix flottant */}
                <div className={`absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                              transform transition-all duration-500
                              ${hoveredProductId === favorite._id ? 'translate-y-0 rotate-0 scale-110' : '-translate-y-20 rotate-12'}`}>
                  {favorite.product.price} DA
                </div>

                {/* Nouveau badge si applicable */}
                {new Date(favorite.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                  <div className={`absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                                transform transition-all duration-500
                                ${hoveredProductId === favorite._id ? 'translate-y-0 rotate-0' : '-translate-y-20 rotate-12'}`}>
                    Nouveau
                  </div>
                )}

                {/* Actions au survol en bas de l'image */}
                <div className={`absolute bottom-0 left-0 right-0 flex justify-center p-3
                              transform transition-all duration-500
                              ${hoveredProductId === favorite._id ? 'translate-y-0' : 'translate-y-16'}`}>
                  <button
                    onClick={(e) => handleDelete(e, favorite)}
                    className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="Retirer des favoris"
                    disabled={deleting === favorite._id}
                  >
                    {deleting === favorite._id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={`p-4 flex-grow flex flex-col transition-all duration-300
                          ${hoveredProductId === favorite._id ? 'bg-amber-50' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-all duration-300
                           relative group overflow-hidden">
                  {favorite.product.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform transition-transform duration-300
                                ${hoveredProductId === favorite._id ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{favorite.product.description}</p>
                
                {favorite.product?.category && (
                  <div className={`inline-block px-2 py-1 text-xs rounded-md mb-1 transition-all duration-300
                                ${hoveredProductId === favorite._id ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                    {favorite.product.category.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes productEntry {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(10deg) translateY(50px);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0) translateY(0);
            filter: blur(0);
          }
        }
        
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 30px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-productEntry {
          animation: productEntry 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Favoris;