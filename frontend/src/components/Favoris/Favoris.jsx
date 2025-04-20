// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Favoris = ({ searchTerm }) => {
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(null);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState(null);

//   useEffect(() => {
//     fetchFavorites();
//   }, []);

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const fetchFavorites = async () => {
//     try {
//       setError(null);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("❌ Aucun token trouvé !");
//         setLoading(false);
//         setError("Veuillez vous connecter pour voir vos favoris.");
//         return;
//       }

//       const response = await axios.get("http://localhost:8000/api/v2/favorites", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setFavorites(response.data.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error("❌ Erreur lors du chargement des favoris:", error);
      
//       if (error.response?.status === 401) {
//         setError("Session expirée. Veuillez vous reconnecter.");
//       } else {
//         setError("Impossible de charger vos favoris. Veuillez réessayer.");
//       }
      
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (favorite) => {
//     const productId = favorite.product?._id;
    
//     if (!productId) {
//       setError("Impossible de supprimer ce favori: ID de produit manquant.");
//       return;
//     }

//     try {
//       setDeleting(favorite._id);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentification requise. Veuillez vous reconnecter.");
//         setDeleting(null);
//         return;
//       }
      
//       await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== favorite._id));
//       setDeleting(null);
      
//       setNotification(`"${favorite.product?.name}" retiré des favoris`);
//     } catch (error) {
//       console.error("❌ Erreur lors de la suppression:", error.response || error);
      
//       if (error.response?.status === 401) {
//         setError("Session expirée. Veuillez vous reconnecter.");
//       } else {
//         setError(error.response?.data?.message || "Impossible de supprimer ce favori. Veuillez réessayer.");
//       }
      
//       setDeleting(null);
//     }
//   };

//   const filteredFavorites = favorites.filter(fav => 
//     fav.product && 
//     (!searchTerm || fav.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       {/* En-tête élégante avec compteur */}
//       <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
//         <div className="flex items-center">
//           <h2 className="text-3xl font-bold text-gray-800">Mes Favoris</h2>
//           <span className="ml-3 bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
//             {filteredFavorites.length}
//           </span>
//         </div>
//       </div>
      
//       {/* Notification toast moderne */}
//       {notification && (
//         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center animate-fade-in-up">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//             </svg>
//             {notification}
//           </div>
//         </div>
//       )}

//       {/* Messages d'erreur */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
//           <div className="flex">
//             <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <p className="font-medium">{error}</p>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-amber-800 mt-4 font-medium">Chargement de vos favoris...</p>
//         </div>
//       ) : filteredFavorites.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-lg">
//           <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
//           </svg>
//           <p className="text-xl font-medium mt-6">Aucun favori trouvé</p>
//           <p className="text-gray-500 mt-2">Ajoutez des produits à vos favoris pour les retrouver ici</p>
//           {!error && (
//             <button 
//               onClick={() => window.location.reload()}
//               className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
//             >
//               Rafraîchir la page
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {filteredFavorites.map((fav) => (
//             <div 
//               key={fav._id} 
//               className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative flex flex-col ${
//                 deleting === fav._id ? "opacity-60" : "opacity-100"
//               }`}
//             >
//               {/* Badge Nouveau avec design amélioré */}
//               {new Date(fav.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
//                 <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
//                   Nouveau
//                 </div>
//               )}
              
//               {/* Image du produit - Amélioration avec aspect-ratio fixe et meilleur traitement des erreurs */}
//               <div className="relative pt-[75%] overflow-hidden bg-gray-100">
//                 <img 
//                   src={fav.product?.images[0]?.url 
//                     ? `http://localhost:8000/${fav.product.images[0].url}` 
//                     : "https://via.placeholder.com/400x300?text=Image+non+disponible"}
//                   alt={fav.product?.name}
//                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//               </div>
              
//               {/* Informations produit - Style amélioré */}
//               <div className="p-5 flex-grow flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">{fav.product?.name}</h3>
//                   {fav.product?.category && (
//                     <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mb-3">
//                       {fav.product.category?.name}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex items-center justify-between mt-4">
//                   <p className="font-bold text-lg text-amber-600">{fav.product?.price} DA</p>
                  
//                   {/* Bouton de suppression plus élégant */}
//                   <button 
//                     onClick={() => handleDelete(fav)}
//                     disabled={deleting === fav._id}
//                     className="flex items-center justify-center text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
//                     title="Retirer des favoris"
//                   >
//                     {deleting === fav._id ? (
//                       <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
//                       </svg>
//                     )}
//                   </button>
//                 </div>

//                 {/* Bouton "Retirer des favoris" en bas de la carte */}
//                 <button 
//                   onClick={() => handleDelete(fav)}
//                   disabled={deleting === fav._id}
//                   className="w-full mt-4 bg-white border border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-500 rounded-lg px-4 py-2 flex items-center justify-center transition-colors duration-300"
//                 >
//                   {deleting === fav._id ? (
//                     <span>Suppression...</span>
//                   ) : (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                         <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
//                       </svg>
//                       Retirer des favoris
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Favoris;


import React, { useEffect, useState } from "react";
import axios from "axios";

const Favoris = ({ searchTerm }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetchFavorites();
    // Déclencher l'animation après le chargement initial
    setTimeout(() => {
      setAnimated(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
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
      
      // Animation de suppression - disparition progressive
      document.getElementById(`card-${favorite._id}`).classList.add('animate-fade-out');
      
      // Attendre que l'animation se termine avant de supprimer
      setTimeout(() => {
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== favorite._id));
        setDeleting(null);
        setNotification(`"${favorite.product?.name}" retiré des favoris`);
      }, 300);
      
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

  const filteredFavorites = favorites.filter(fav => 
    fav.product && 
    (!searchTerm || fav.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Animation de l'en-tête */}
      <div className={`flex items-center justify-between mb-8 border-b border-gray-200 pb-4 transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-gray-800">Mes Favoris</h2>
          <span className="ml-3 bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full transition-all duration-500 hover:bg-amber-200">
            {filteredFavorites.length}
          </span>
        </div>
      </div>
      
      {/* Notification toast avec animation */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center animate-slide-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-400 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {notification}
          </div>
        </div>
      )}

      {/* Messages d'erreur avec animation */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-shake" role="alert">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-800 mt-4 font-medium animate-pulse">Chargement de vos favoris...</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-lg animate-fadeIn">
          <svg className="w-20 h-20 text-gray-400 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <p className="text-xl font-medium mt-6">Aucun favori trouvé</p>
          <p className="text-gray-500 mt-2">Ajoutez des produits à vos favoris pour les retrouver ici</p>
          {!error && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 hover:scale-105"
            >
              Rafraîchir la page
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFavorites.map((fav, index) => (
            <div 
              id={`card-${fav._id}`}
              key={fav._id} 
              className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col 
                ${deleting === fav._id ? "opacity-60" : "opacity-100"}
                ${animated ? "animate-fade-in" : "opacity-0"}
              `}
              style={{ 
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${animated ? '0' : '20px'})`,
                transition: 'transform 0.5s ease, opacity 0.5s ease, box-shadow 0.3s ease',
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Badge Nouveau avec animation */}
              {new Date(fav.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm animate-pulse-slow">
                  Nouveau
                </div>
              )}
              
              {/* Image du produit avec effet de zoom amélioré */}
              <div className="relative pt-[75%] overflow-hidden bg-gray-100 group">
                <img 
                  src={fav.product?.images[0]?.url 
                    ? `http://localhost:8000/${fav.product.images[0].url}` 
                    : "https://via.placeholder.com/400x300?text=Image+non+disponible"}
                  alt={fav.product?.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Informations produit avec animations au survol */}
              <div className="p-5 flex-grow flex flex-col justify-between group">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors duration-300">{fav.product?.name}</h3>
                  {fav.product?.category && (
                    <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mb-3 transition-all duration-300 group-hover:bg-amber-50 group-hover:text-amber-700">
                      {fav.product.category?.name}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="font-bold text-lg text-amber-600 group-hover:scale-110 transition-transform duration-300">{fav.product?.price} DA</p>
                  
                  {/* Bouton coeur animé */}
                  <button 
                    onClick={() => handleDelete(fav)}
                    disabled={deleting === fav._id}
                    className="flex items-center justify-center text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-300 hover:scale-125 transform relative"
                    title="Retirer des favoris"
                  >
                    {deleting === fav._id ? (
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform hover:scale-beat">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Bouton "Retirer des favoris" avec effet de survol */}
                <button 
                  onClick={() => handleDelete(fav)}
                  disabled={deleting === fav._id}
                  className="w-full mt-4 bg-white border border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-500 rounded-lg px-4 py-2 flex items-center justify-center transition-all duration-300 hover:bg-red-50 transform hover:translate-y-px"
                >
                  {deleting === fav._id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform duration-300 group-hover:scale-110">
                        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Retirer des favoris
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Ajouter les styles pour les animations personnalisées */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce-once {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes scale-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-once {
          animation: bounce-once 1s ease;
        }
        
        .hover\\:scale-beat:hover {
          animation: scale-beat 0.7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Favoris;