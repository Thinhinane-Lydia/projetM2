import React, { useEffect, useState } from "react";
import axios from "axios";

const Favoris = ({ searchTerm }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  // Notification plus subtile en bas de page plutôt qu'en haut à droite
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Effet pour faire disparaître la notification après 2 secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchFavorites = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé !");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/v2/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavorites(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des favoris:", error);
      setError("Impossible de charger vos favoris. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleDelete = async (favorite) => {
    const productId = favorite.product?._id;
    
    if (!productId) {
      setError("Impossible de supprimer ce favori: ID de produit manquant.");
      return;
    }

    try {
      setDeleting(favorite._id);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentification requise. Veuillez vous reconnecter.");
        setDeleting(null);
        return;
      }
      
      await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mise à jour de l'état après suppression réussie
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== favorite._id));
      setDeleting(null);
      
      // Notification minimaliste qui n'interfère pas avec l'interface
      setNotification(`"${favorite.product?.name}" retiré des favoris`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error.response || error);
      setError(error.response?.data?.message || "Impossible de supprimer ce favori. Veuillez réessayer.");
      setDeleting(null);
    }
  };

  // Filtrage par recherche
  const filteredFavorites = favorites.filter(fav => 
    fav.product && 
    (!searchTerm || fav.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec compteur intégré */}
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold text-[#5C4033]">Mes Favoris</h2>
        <span className="ml-3 text-lg bg-[#D2691E]/10 text-[#D2691E] px-3 py-1 rounded-full">
          {filteredFavorites.length}
        </span>
      </div>
      
      {/* Notifications minimalistes en bas de page */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#5C4033] text-white px-4 py-2 rounded-md shadow-lg opacity-90 z-50 text-center">
          {notification}
        </div>
      )}

      {/* Affichage des messages d'erreur */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg className="animate-spin h-10 w-10 text-[#D2691E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[#5C4033] mt-4">Chargement de vos favoris...</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <p className="text-lg mt-4">Aucun favori trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((fav) => (
            <div 
              key={fav._id} 
              className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group ${
                deleting === fav._id ? "opacity-70" : "opacity-100"
              }`}
            >
              {/* Badge Nouveau si ajouté récemment */}
              {new Date(fav.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                <div className="absolute top-3 left-3 bg-[#D2691E] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  Nouveau
                </div>
              )}
              
              {/* Image du produit */}
              <div className="relative overflow-hidden h-56">
                <img 
                  src={fav.product?.images[0]?.url || "https://via.placeholder.com/250"} 
                  alt={fav.product?.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              {/* Informations produit */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{fav.product?.name}</h3>
                {fav.product?.category && (
                 <p className="text-sm text-gray-500 mb-2">{fav.product.category?.name}</p>

                )}
                
                <p className="font-bold text-lg text-[#D2691E] mb-3">{fav.product?.price} DA</p>
                
                {/* Bouton de suppression */}
                <button 
                  onClick={() => handleDelete(fav)}
                  disabled={deleting === fav._id}
                  className="w-full bg-white border border-red-400 text-red-500 hover:bg-red-50 rounded-md px-4 py-2 flex items-center justify-center transition-colors duration-300"
                >
                  {deleting === fav._id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      Retirer des favoris
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoris;