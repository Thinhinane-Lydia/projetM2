// import React, { useState, useEffect } from 'react';
// import { fetchSearchHistory, deleteSearchHistoryItem } from '../../utils/api';
// import { useNavigate } from 'react-router-dom';
// import { Trash2, ArrowUpRight } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const SearchResults = () => {
//   const navigate = useNavigate();
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getImageUrl = (product) => {
//     const images = product.images;
  
//     if (!images || images.length === 0) {
//       return "https://via.placeholder.com/250";
//     }
  
//     const firstImage = images[0];
//     const imageUrl = firstImage?.url || firstImage;
  
//     if (imageUrl.startsWith('http')) return imageUrl;
  
//     return `http://localhost:8000/${imageUrl.replace(/^\//, '')}`;
//   };

//   const handleDeleteProduct = async (productId, event) => {
//     event.stopPropagation();
//     try {
//       await deleteSearchHistoryItem(productId);
//       setAllProducts(prevProducts => 
//         prevProducts.filter(product => product._id !== productId)
//       );
//     } catch (err) {
//       console.error("Erreur lors de la suppression du produit:", err);
//     }
//   };

//   useEffect(() => {
//     const loadSearchHistory = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchSearchHistory();
        
//         if (data.success) {
//           const flattenedProducts = data.searchHistory.reduce((acc, historyItem) => {
//             if (historyItem.products && historyItem.products.length > 0) {
//               return [...acc, ...historyItem.products];
//             }
//             return acc;
//           }, []);

//           const uniqueProducts = Array.from(
//             new Map(flattenedProducts.map(product => [product._id, product]))
//             .values()
//           );

//           setAllProducts(uniqueProducts);
//         } else {
//           setError("Aucun historique trouvé.");
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération de l'historique des recherches:", err);
//         setError("Impossible de charger l'historique des recherches.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSearchHistory();
//   }, []);

//   if (loading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex justify-center items-center h-screen bg-amber-50"
//       >
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center py-12 bg-amber-50 h-screen flex flex-col justify-center"
//       >
//         <p className="text-amber-700 text-2xl mb-4">{error}</p>
//         <button 
//           onClick={() => window.location.reload()}
//           className="mx-auto bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
//         >
//           Actualiser
//         </button>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen"
//     >
//       <div className="flex justify-between items-center mb-8">
//         <motion.h2 
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="text-3xl font-bold text-amber-900"
//         >
//           Historique des Recherches
//         </motion.h2>
//         {allProducts.length > 0 && (
//           <motion.button 
//             initial={{ x: 50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
//             onClick={() => setAllProducts([])}
//           >
//             <Trash2 className="mr-2" size={20} />
//             Tout effacer
//           </motion.button>
//         )}
//       </div>

//       {allProducts.length === 0 ? (
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center py-12"
//         >
//           <p className="text-amber-700 text-xl mb-4">
//             Aucun produit dans l'historique
//           </p>
//           <button 
//             className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
//             onClick={() => navigate('/')}
//           >
//             Commencer à rechercher
//           </button>
//         </motion.div>
//       ) : (
//         <AnimatePresence>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {allProducts.map((product, index) => (
//               <motion.div
//                 key={product._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ 
//                   delay: index * 0.1,
//                   duration: 0.3
//                 }}
//                 className="relative group"
//               >
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
//                   <div className="relative">
//                     <img
//                       src={getImageUrl(product)}
//                       alt={product.name}
//                       className="w-full h-64 object-cover"
//                     />
//                     <div className="absolute top-0 right-0 p-2">
//                       <motion.button 
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => handleDeleteProduct(product._id, e)}
//                         className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                       >
//                         <Trash2 size={16} />
//                       </motion.button>
//                     </div>
//                   </div>
//                   <div className="p-4 bg-amber-50">
//                     <h3 className="text-sm font-semibold text-amber-900 truncate mb-2">
//                       {product.name}
//                     </h3>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-amber-700 font-bold">
//                         {product.price} DA
//                       </span>
//                       <motion.div 
//                         whileHover={{ scale: 1.2 }}
//                         onClick={() => navigate(`/InfoProduct/:productId/${product._id}`)}
//                         className="cursor-pointer"
//                       >
//                         <ArrowUpRight 
//                           size={20} 
//                           onClick={() => navigate(`/InfoProduct/:productId/${product._id}`)}
//                           className="text-amber-500 hover:text-amber-700"
//                         />
//                       </motion.div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </AnimatePresence>
//       )}
//     </motion.div>
//   );
// };

// export default SearchResults;

import React, { useState, useEffect } from 'react';
import { fetchSearchHistory, deleteSearchHistoryItem } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (product) => {
    const images = product.images;
  
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/250x250?text=No+Image";
    }
  
    const firstImage = images[0];
    const imageUrl = firstImage?.url || firstImage;
  
    if (imageUrl.startsWith('http')) return imageUrl;
  
    return `http://localhost:8000/${imageUrl.replace(/^\//, '')}`;
  };

  const handleDeleteProduct = async (productId, event) => {
    event.stopPropagation();
    try {
      await deleteSearchHistoryItem(productId);
      setAllProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productId)
      );
    } catch (err) {
      console.error("Erreur lors de la suppression du produit:", err);
    }
  };

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchSearchHistory();
        
        if (data.success) {
          const flattenedProducts = data.searchHistory.reduce((acc, historyItem) => {
            if (historyItem.products && historyItem.products.length > 0) {
              return [...acc, ...historyItem.products];
            }
            return acc;
          }, []);

          const uniqueProducts = Array.from(
            new Map(flattenedProducts.map(product => [product._id, product]))
            .values()
          );

          setAllProducts(uniqueProducts);
        } else {
          setError("Aucun historique trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique des recherches:", err);
        setError("Impossible de charger l'historique des recherches.");
      } finally {
        setLoading(false);
      }
    };

    loadSearchHistory();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen bg-amber-50"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-amber-50 h-screen flex flex-col justify-center"
      >
        <p className="text-amber-700 text-2xl mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mx-auto bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Actualiser
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-amber-900"
        >
          Historique des Recherches
        </motion.h2>
        {allProducts.length > 0 && (
          <motion.button 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            onClick={() => setAllProducts([])}
          >
            <Trash2 className="mr-2" size={20} />
            Tout effacer
          </motion.button>
        )}
      </div>

      {allProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <p className="text-amber-700 text-xl mb-4">
            Aucun produit dans l'historique
          </p>
          <button 
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            onClick={() => navigate('/')}
          >
            Commencer à rechercher
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3
                }}
                className="relative group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-0 right-0 p-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteProduct(product._id, e)}
                        className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50">
                    <h3 className="text-sm font-semibold text-amber-900 truncate mb-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-700 font-bold">
                        {product.price} DA
                      </span>
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        onClick={() => navigate(`/InfoProduct/${product._id}`)}
                        className="cursor-pointer"
                      >
                        <ArrowUpRight 
                          size={20} 
                          className="text-amber-500 hover:text-amber-700"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SearchResults;