import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:8000";

/**
 * Component to display similar products based on category and subcategory
 * with enhanced animations and styling based on MaBoutique component
 * 
 * - Filtre les produits avec état "vendu"
 * - Filtre les produits de l'utilisateur connecté
 */
const SimilarProducts = ({ currentProductId, category, subCategory, currentUserId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid ou carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [animateEntry, setAnimateEntry] = useState(true);
  const carouselRef = useRef(null);

  // Limite initiale d'affichage
  const initialLimit = 10;

  // Fonction pour obtenir l'URL d'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}/${imageUrl}`;
  };

  useEffect(() => {
    const getSimilarProducts = async () => {
      try {
        setLoading(true);
        
        // Récupération de tous les produits
        const data = await fetchProducts();
        
        if (!data.success) {
          throw new Error("Failed to fetch products");
        }
        
        // Filtrer les produits par catégorie et sous-catégorie
        // En excluant:
        // 1. Le produit courant
        // 2. Les produits vendus
        // 3. Les produits de l'utilisateur connecté
        const filtered = data.products.filter(product => {
          return product._id !== currentProductId && 
                 product.category?._id === category?._id &&
                 (subCategory ? product.subCategory?._id === subCategory?._id : true) &&
                 product.etat !== "vendu" &&
                 product.seller !== currentUserId;
        });
        
        setSimilarProducts(filtered);
        setDisplayedProducts(filtered.slice(0, initialLimit));
        
        // Réinitialiser l'animation d'entrée
        setAnimateEntry(false);
        setTimeout(() => setAnimateEntry(true), 50);
      } catch (err) {
        console.error("Error loading similar products:", err);
        setError("Impossible de charger les produits similaires");
      } finally {
        setLoading(false);
      }
    };

    // Récupération uniquement si on a les infos de catégorie
    if (category?._id) {
      getSimilarProducts();
    } else {
      setLoading(false);
    }
  }, [currentProductId, category, subCategory, currentUserId]);

  // Gestion du bouton "Afficher tout"
  const handleToggleShowAll = () => {
    if (showAll) {
      // Retour à la vue limitée
      setShowAll(false);
      setDisplayedProducts(similarProducts.slice(0, initialLimit));
    } else {
      // Afficher tous les produits avec animation
      setShowAll(true);
      setDisplayedProducts(similarProducts);
      
      // Réinitialiser l'animation d'entrée
      setAnimateEntry(false);
      setTimeout(() => setAnimateEntry(true), 50);
    }
  };

  // Basculer entre vue grille et vue carousel
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "carousel" : "grid");
    // Réinitialiser l'animation d'entrée lors du changement de mode
    setAnimateEntry(false);
    setTimeout(() => setAnimateEntry(true), 50);
  };

  // Gestion du défilement du carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Défilement vers une page spécifique du carousel
  const scrollToPage = (pageIndex) => {
    if (carouselRef.current) {
      const itemWidth = 280; // Largeur de chaque élément avec marge
      const scrollPosition = pageIndex * itemWidth * 4; // 4 éléments par page
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentSlide(pageIndex);
    }
  };

  // Si aucun produit similaire trouvé
  if (!loading && similarProducts.length === 0) {
    return null; // Ne rien afficher si pas de produits similaires
  }

  return (
    <div className="py-10 bg-gradient-to-br from-amber-50 to-white w-full overflow-hidden">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto animate-slideInFromTop">
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center relative">
            <span className="w-1.5 h-6 bg-amber-500 rounded-sm mr-3"></span>
            Produits Similaires
            <span className="ml-2 text-amber-500 text-sm font-normal">
              ({similarProducts.length} articles)
            </span>
            <span className="absolute -bottom-1 left-8 right-0 w-4/5 h-1 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
          </h2>
          
          <div className="flex gap-3">
            <button 
              onClick={toggleViewMode} 
              className="text-amber-600 hover:text-amber-800 transition-colors flex items-center text-sm group"
            >
              {viewMode === "grid" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="relative">
                    Carrousel
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                  </span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="relative">
                    Grille
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8 h-64">
            <div className="relative">
              <div className="animate-ping absolute h-16 w-16 rounded-full bg-amber-400 opacity-75"></div>
              <div className="animate-spin relative h-16 w-16 rounded-full border-4 border-transparent border-t-amber-600 border-b-amber-600"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-6 bg-red-50 rounded-xl">{error}</div>
        ) : viewMode === "grid" ? (
          // Vue en grille améliorée avec animations comme MaBoutique
          <div className="space-y-8 max-w-full">
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
            >
              {displayedProducts.map((product, index) => (
                <Link 
                  to={`/InfoProduct/${product._id}`}
                  key={product._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 cursor-pointer flex flex-col
                            ${animateEntry ? 'animate-productEntry' : ''}
                            ${hoveredProductId === product._id ? 'z-10 transform scale-105 shadow-2xl' : 'z-0'}`}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <div className="relative w-full pt-[140%] overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getImageUrl(product.images[0]?.url)} 
                        alt={product.name}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                                 ${hoveredProductId === product._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay au survol avec effet de gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                               transition-opacity duration-300 
                               ${hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'}`}>
                    </div>
                    
                    {/* Badge prix flottant */}
                    <div className={`absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                                transform transition-all duration-500
                                ${hoveredProductId === product._id ? 'translate-y-0 rotate-0 scale-110' : '-translate-y-20 rotate-12'}`}>
                      {product.price} DA
                    </div>
                  </div>
                  
                  <div className={`p-4 flex-grow flex flex-col transition-all duration-300
                              ${hoveredProductId === product._id ? 'bg-amber-50' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-all duration-300
                               relative group overflow-hidden">
                      {product.name}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform transition-transform duration-300
                                    ${hoveredProductId === product._id ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.brand && `${product.brand} • `}
                      {product.condition}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {similarProducts.length > initialLimit && (
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={handleToggleShowAll}
                  className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute w-0 h-0 rounded-full bg-white opacity-10 transform scale-0 group-hover:scale-100 group-hover:w-96 group-hover:h-96 transition-all duration-700"></span>
                  <span className="relative z-10">
                    {showAll ? (
                      <>
                        Réduire
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 inline transition-transform duration-300 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Afficher tout ({similarProducts.length})
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 inline transition-transform duration-300 group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          // Vue en carousel améliorée
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="relative">
              {/* Bouton de défilement gauche */}
              <motion.button 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 ml-1 backdrop-blur-sm"
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollCarousel('left')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div 
                id="carousel-container"
                ref={carouselRef}
                className="overflow-x-auto pb-6 flex space-x-6 snap-x scrollbar-hide scroll-smooth"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none' 
                }}
                onScroll={(e) => {
                  // Mise à jour de l'index de slide basé sur la position de défilement
                  if (carouselRef.current) {
                    const scrollPos = carouselRef.current.scrollLeft;
                    const itemWidth = 280; // Largeur approximative d'un élément + marge
                    const newSlide = Math.round(scrollPos / (itemWidth * 4));
                    if (newSlide !== currentSlide) {
                      setCurrentSlide(newSlide);
                    }
                  }
                }}
              >
                {displayedProducts.map((product, index) => (
                  <Link
                    to={`/InfoProduct/${product._id}`}
                    key={product._id}
                    className={`flex-none w-64 snap-start overflow-hidden
                             ${animateEntry ? 'animate-productEntry' : ''}
                             ${hoveredProductId === product._id ? 'z-10 scale-105 shadow-2xl rounded-xl' : 'z-0 rounded-xl shadow-md'}`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      transformOrigin: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setHoveredProductId(product._id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <div className="relative w-full pt-[140%] overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={getImageUrl(product.images[0]?.url)} 
                          alt={product.name}
                          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                                   ${hoveredProductId === product._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Overlay au survol avec effet de gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                                 transition-opacity duration-300 
                                 ${hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'}`}>
                      </div>
                      
                      {/* Badge prix flottant */}
                      <div className={`absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                                  transform transition-all duration-500
                                  ${hoveredProductId === product._id ? 'translate-y-0 rotate-0 scale-110' : '-translate-y-20 rotate-12'}`}>
                        {product.price} DA
                      </div>
                    </div>
                    
                    <div className={`p-4 flex-grow flex flex-col transition-all duration-300
                                ${hoveredProductId === product._id ? 'bg-amber-50' : 'bg-white'}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-all duration-300
                                 relative group overflow-hidden">
                        {product.name}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform transition-transform duration-300
                                      ${hoveredProductId === product._id ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.brand && `${product.brand} • `}
                        {product.condition}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bouton de défilement droit */}
              <motion.button 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 mr-1 backdrop-blur-sm"
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollCarousel('right')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
              
              {/* Indicateurs de défilement/pagination améliorés */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(displayedProducts.length / 4) }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                      i === currentSlide ? 'bg-amber-500 w-12' : 'bg-amber-200 w-8 hover:bg-amber-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToPage(i)}
                  />
                ))}
              </div>
            </div>

            {similarProducts.length > initialLimit && (
              <div className="flex justify-center mt-4">
                <motion.button
                  onClick={handleToggleShowAll}
                  className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute w-0 h-0 rounded-full bg-white opacity-10 transform scale-0 group-hover:scale-100 group-hover:w-96 group-hover:h-96 transition-all duration-700"></span>
                  <span className="relative z-10">
                    {showAll ? "Voir moins" : `Afficher tout (${similarProducts.length})`}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS pour les animations */}
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
        
        .animate-productEntry {
          animation: productEntry 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        /* Cacher la barre de défilement tout en permettant le scrolling */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SimilarProducts;