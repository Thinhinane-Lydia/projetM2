

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Icônes
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingCart, HiShoppingCart } from 'react-icons/hi';
import { FaComment, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

// Hooks et Utilitaires
import { useCart } from "../../components/cart/Cart";
import { 
  fetchUserRecommendations, 
  fetchCommentsByProduct,
  addToFavorites,
  removeFromFavorites,
  checkIfFavorite
} from "../../utils/api";

const UserRecommendations = ({ 
  initiallyVisible = true, 
  activeCategory = null, 
  activeSubCategory = null,
  filters = {} 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [allRecommendations, setAllRecommendations] = useState([]); // Stocke toutes les recommandations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [animateEntry, setAnimateEntry] = useState(true);
  
  const scrollContainerRef = useRef(null);
  
  const navigate = useNavigate();
  const cartContext = useCart();

  if (!cartContext) {
    console.error("❌ useCart() est `undefined`. Assurez-vous d'envelopper votre application avec `<CartProvider>`.");
  }
  
  const { addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart, cart: contextCart } = 
    cartContext || { cart: [], addToCart: () => {}, removeFromCart: () => {} };

  // Calculer la moyenne des ratings
  const calculateAverageRating = (comments) => {
    if (!comments || comments.length === 0) return 0;
    
    const validRatings = comments.filter(comment => 
      comment.rating !== null && 
      comment.rating !== undefined && 
      !isNaN(comment.rating)
    );
    
    if (validRatings.length === 0) return 0;
    
    const totalRating = validRatings.reduce(
      (acc, comment) => acc + parseFloat(comment.rating), 
      0
    );
    return totalRating / validRatings.length;
  };

  // Vérifier si l'utilisateur est authentifié et obtenir son ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Extraire l'ID utilisateur du token JWT
      try {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        setCurrentUserId(userId);
      } catch (err) {
        console.error("Erreur lors de l'extraction de l'ID utilisateur:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }
  }, []);

  // Sauvegarder la préférence de visibilité dans le localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem("showRecommendations");
    if (savedVisibility !== null) {
      setIsVisible(savedVisibility === "true");
    }
  }, []);

  // Mettre à jour le localStorage quand la visibilité change
  useEffect(() => {
    localStorage.setItem("showRecommendations", isVisible.toString());
  }, [isVisible]);

  // Basculer la visibilité
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // Charger les recommandations
  const loadRecommendations = useCallback(async () => {
    // Ne charger les données que si la section est visible et l'utilisateur est authentifié
    if (!isVisible || !isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setRecommendations([]);
        setError("L'utilisateur doit être connecté pour voir les recommandations");
        setLoading(false);
        return;
      }
      
      // Récupérer l'ID utilisateur depuis le token (JWT)
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      
      // Appel à la fonction API avec l'ID utilisateur
      const response = await fetchUserRecommendations(userId);
      
      if (response.success && response.data) {
        const productsWithRatings = await Promise.all(
          response.data.map(async (product) => {
            try {
              const comments = await fetchCommentsByProduct(product._id);
              const rating = calculateAverageRating(comments);
              return {
                ...product,
                rating: rating,
                ratingCount: comments.length || 0
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération des commentaires pour ${product._id}:`, error);
              return {
                ...product,
                rating: 0,
                ratingCount: 0
              };
            }
          })
        );
        
        // Filtrer pour exclure:
        // 1. Les produits avec état "vendu"
        // 2. Les produits vendus par l'utilisateur connecté
        const filteredProducts = productsWithRatings.filter(product => 
          product.etat !== "vendu" && 
          product.seller?._id !== userId
        );
        
        // Stocker toutes les recommandations
        setAllRecommendations(filteredProducts);
        
        // Relancer l'animation quand les produits sont chargés
        setAnimateEntry(false);
        setTimeout(() => setAnimateEntry(true), 50);
      } else {
        setAllRecommendations([]);
        if (!response.success) {
          setError(response.message || "Erreur lors du chargement des recommandations");
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des recommandations:", err);
      setError("Erreur lors du chargement des recommandations");
    } finally {
      setLoading(false);
    }
  }, [isVisible, isAuthenticated]);

  // Filtrer les recommandations selon la catégorie et sous-catégorie
  useEffect(() => {
    if (allRecommendations.length > 0) {
      // Filtrer les recommandations selon tous les critères
      const filtered = allRecommendations.filter(product => {
        const matchesCategory = !activeCategory || product.category?._id.toString() === activeCategory;
        const matchesSubCategory = !activeSubCategory || product.subCategory?._id.toString() === activeSubCategory;
        
        // Appliquer les mêmes filtres détaillés que dans ProductList
        const matchesBasicCriteria = 
          matchesCategory && 
          matchesSubCategory &&
          (!filters.size || product.size?._id === filters.size) &&
          (!filters.brand || product.brand === filters.brand) &&
          (!filters.material || product.material === filters.material) &&
          (!filters.color || product.color === filters.color) &&
          (!filters.condition || product.condition === filters.condition) &&
          (!filters.minPrice || product.price >= filters.minPrice) &&
          (!filters.maxPrice || product.price <= filters.maxPrice);
        
        const ratingValue = product.rating || 0;
        const matchesMinRating = !filters.minRating || ratingValue >= parseFloat(filters.minRating);
        const matchesMaxRating = !filters.maxRating || ratingValue <= parseFloat(filters.maxRating);
        
        return matchesBasicCriteria && matchesMinRating && matchesMaxRating;
      });
      
      setRecommendations(filtered);
      
      // Relancer l'animation lors du changement de filtres
      setAnimateEntry(false);
      setTimeout(() => setAnimateEntry(true), 50);
    }
  }, [allRecommendations, activeCategory, activeSubCategory, filters]);

  // Charger les favoris de l'utilisateur
  const loadFavorites = useCallback(async () => {
    if (!isVisible || !isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      // Pour chaque produit recommandé, vérifier s'il est dans les favoris
      if (recommendations.length > 0) {
        const favPromises = recommendations.map(async (product) => {
          const isFavorite = await checkIfFavorite(product._id);
          return isFavorite ? product._id : null;
        });
        
        const favIds = (await Promise.all(favPromises)).filter(id => id !== null);
        setFavorites(favIds);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des favoris:", error);
    }
  }, [recommendations, isVisible, isAuthenticated]);

  // Charger les recommandations au chargement du composant ou changement de visibilité/authentification
  useEffect(() => {
    if (isVisible && isAuthenticated) {
      loadRecommendations();
    }
  }, [loadRecommendations, isVisible, isAuthenticated]);

  // Charger les favoris une fois que les recommandations sont chargées
  useEffect(() => {
    if (recommendations.length > 0 && isVisible && isAuthenticated) {
      loadFavorites();
    }
  }, [recommendations, loadFavorites, isVisible, isAuthenticated]);

  // Initialiser l'état addedToCart en fonction du contexte du panier
  useEffect(() => {
    if (contextCart && contextCart.length > 0 && isVisible && isAuthenticated) {
      const cartState = {};
      contextCart.forEach(item => {
        if (item.product && item.product._id) {
          cartState[item.product._id] = true;
        }
      });
      setAddedToCart(cartState);
    }
  }, [contextCart, isVisible, isAuthenticated]);

  // Effet pour le carrousel d'images au survol
  useEffect(() => {
    if (hoveredProductId) {
      const product = recommendations.find(p => p._id === hoveredProductId);
      if (product && product.images && product.images.length > 1) {
        const interval = setInterval(() => {
          setActiveImageIndex(prev => {
            const currentIndex = prev[hoveredProductId] || 0;
            const nextIndex = (currentIndex + 1) % product.images.length;
            return { ...prev, [hoveredProductId]: nextIndex };
          });
        }, 2000); // Changer l'image toutes les 2 secondes

        return () => clearInterval(interval);
      }
    }
  }, [hoveredProductId, recommendations]);

  // Vérifier l'état du défilement pour afficher/masquer les boutons
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Ajouter un écouteur de défilement
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isVisible || !isAuthenticated) return;
    
    container.addEventListener('scroll', checkScrollPosition);
    
    // Vérifier initialement après le chargement des produits
    if (recommendations.length > 0) {
      checkScrollPosition();
    }
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [recommendations, isVisible, isAuthenticated]);

  // Fonctions de défilement
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 256 + 16; // largeur de carte + espacement
      container.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 256 + 16; // largeur de carte + espacement
      container.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
    }
  };

  // Gestion des favoris
  const toggleFavorite = async (e, productId) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vous devez être connecté pour ajouter des favoris");
        return;
      }

      // Animation lors du clic sur le cœur
      const heartBtn = e.currentTarget;
      heartBtn.classList.add('animate-heartbeat');
      setTimeout(() => {
        heartBtn.classList.remove('animate-heartbeat');
      }, 500);

      if (favorites.includes(productId)) {
        // Supprimer des favoris
        await removeFromFavorites(productId);
        setFavorites(prev => prev.filter(id => id !== productId));
        toast.success("Produit retiré des favoris");
      } else {
        // Ajouter aux favoris
        await addToFavorites(productId);
        setFavorites(prev => [...prev, productId]);
        toast.success("Produit ajouté aux favoris");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la gestion des favoris :", error);
      toast.error("Erreur lors de la gestion des favoris");
    }
  };

  // Gestion du panier
  const handleCartClick = async (e, productId) => {
    e.stopPropagation();
    
    try {
      // Vérifier si le produit est déjà dans le panier
      const isProductInCart = addedToCart[productId];
      
      // Animation lors du clic sur le panier
      const cartBtn = e.currentTarget;
      cartBtn.classList.add('animate-bounce');
      setTimeout(() => {
        cartBtn.classList.remove('animate-bounce');
      }, 500);
      
      // Mise à jour optimiste - mettre à jour l'interface immédiatement
      setAddedToCart(prev => ({...prev, [productId]: !isProductInCart}));
      
      if (isProductInCart) {
        // Si l'article est déjà dans le panier, on cherche son ID de cart item
        const cartItem = contextCart.find(item => item.product && item.product._id === productId);
        if (cartItem) {
          await contextRemoveFromCart(cartItem._id);
          toast.success("Produit retiré du panier");
        }
      } else {
        // Sinon on l'ajoute au panier
        await contextAddToCart(productId);
        toast.success("Produit ajouté au panier");
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("❌ Erreur lors de la gestion du panier :", error);
      setAddedToCart(prev => ({...prev, [productId]: !prev[productId]}));
      toast.error("Erreur lors de la gestion du panier");
    }
  };

  // Navigation vers la page de détail du produit
  const handleProductClick = (productId) => {
    navigate(`/InfoProduct/${productId}`);
  };

  // Composant pour afficher les étoiles de notation
  const RatingStars = ({ rating }) => {
    const ratingValue = parseFloat(rating) || 0;
    const roundedRating = Math.round(ratingValue * 2) / 2;
    
    const fullStars = Math.max(0, Math.floor(roundedRating));
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    const fullStarsArray = fullStars > 0 ? Array(fullStars).fill(null) : [];
    const emptyStarsArray = emptyStars > 0 ? Array(emptyStars).fill(null) : [];
    
    return (
      <div className="flex items-center">
        {fullStarsArray.map((_, i) => (
          <FaStar key={`full-${i}`} className="text-amber-500 text-sm transition-all duration-300" />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" className="text-amber-500 text-sm transition-all duration-300" />}
        {emptyStarsArray.map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-amber-300 text-sm transition-all duration-300" />
        ))}
      </div>
    );
  };

  // Si l'utilisateur n'est pas authentifié, ne rien afficher du tout
  if (!isAuthenticated) {
    return null;
  }

  // Si la section est masquée, afficher seulement le bouton pour la montrer
  if (!isVisible) {
    return (
      <div className="px-4 mt-4 bg-white shadow-sm relative">
        <div className="flex justify-between items-center py-4">
         
          <button
            onClick={toggleVisibility}
            className="flex items-center gap-2 px-3 py-1 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50"
            aria-label="Afficher les recommandations"
          >
            <IoEyeOutline size={20} />
            <span>Afficher</span>
          </button>
        </div>
      </div>
    );
  }

  // Affichage du chargement
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

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="px-4 mt-4 bg-white shadow-sm relative">
        <div className="flex justify-between items-center py-2 border-b border-amber-200">
          <h2 className="text-xl font-semibold text-amber-800">
            Produits recommandés
            {(activeCategory || activeSubCategory) && " (Filtrés)"}
          </h2>
          <button
            onClick={toggleVisibility}
            className="flex items-center gap-2 px-3 py-1 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50"
            aria-label="Masquer les recommandations"
          >
            <IoEyeOffOutline size={20} />
            <span>Masquer</span>
          </button>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Affichage si pas de recommandations
  if (recommendations.length === 0) {
    // Message spécifique si le filtrage est actif mais ne donne pas de résultats
    const noResultsMessage = activeCategory || activeSubCategory ? 
      "Aucune recommandation correspondant aux filtres sélectionnés." : 
      "Aucune recommandation disponible pour le moment.";
    
    const suggestionMessage = activeCategory || activeSubCategory ?
      "Essayez de modifier vos critères de filtrage." :
      "Explorez notre catalogue pour découvrir des produits qui pourraient vous plaire.";
      
    return (
      <div className="px-4 mt-4 bg-white shadow-sm relative">
        <div className="flex justify-between items-center py-2 border-b border-amber-200">
          <h2 className="text-xl font-semibold text-amber-800">
            Produits Recommandés
            {(activeCategory || activeSubCategory) && " (Filtrés)"}
          </h2>
          <button
            onClick={toggleVisibility}
            className="flex items-center gap-2 px-3 py-1 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50"
            aria-label="Masquer les recommandations"
          >
            <IoEyeOffOutline size={20} />
            <span>Masquer</span>
          </button>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-neutral-500">{noResultsMessage}</p>
          <p className="text-neutral-400 mt-2">{suggestionMessage}</p>
        </div>
      </div>
    );
  }

  // Affichage des recommandations avec le style de ProductList
  return (
    <div className="bg-white overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-amber-200">
        <h2 className="text-xl font-semibold text-amber-800 animate-slideInFromLeft">
          Produits Recommandés
          {(activeCategory || activeSubCategory) && " (Filtrés)"}
        </h2>
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-2 px-3 py-1 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50"
          aria-label="Masquer les recommandations"
        >
          <IoEyeOffOutline size={20} />
          <span>Masquer</span>
        </button>
      </div>

      {/* Conteneur avec scroll horizontal */}
      <div className="relative">
        {/* Bouton de défilement gauche */}
        {showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-amber-50 transition-colors border border-amber-200"
            aria-label="Défiler vers la gauche"
          >
            <IoIosArrowBack size={24} className="text-amber-800" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto py-6 px-4 hide-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex space-x-4 min-w-max">
            {recommendations.map((product, index) => {
              const isInCart = addedToCart[product._id] || false;
              const isFavorite = favorites.includes(product._id);
              
              return (
                <div
                  key={product._id}
                  className={`relative bg-white overflow-hidden rounded-xl shadow-md border border-amber-100 flex flex-col w-64
                           ${animateEntry ? 'animate-productEntry' : ''}
                           ${hoveredProductId === product._id ? 'z-10 transform scale-105 shadow-2xl' : 'z-0'}`}
                  onClick={() => handleProductClick(product._id)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  {/* Image du produit */}
                  <div className="relative w-full pt-[140%] overflow-hidden">
                    {product.images && product.images.length > 0 && (
                      <>
                        {product.images.map((image, idx) => {
                          const isActive = (activeImageIndex[product._id] || 0) === idx;
                          return (
                            <img
                              key={idx}
                              src={
                                image.url?.startsWith("http")
                                  ? image.url
                                  : image.url
                                    ? `http://localhost:8000/${image.url}`
                                    : "https://via.placeholder.com/400x300?text=Pas+d'image"
                              }
                              alt={`${product.name} - image ${idx + 1}`}
                              className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                                      ${hoveredProductId === product._id ? 'scale-110 filter brightness-110' : 'scale-100'}
                                      ${isActive ? 'opacity-100' : 'opacity-0'}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Pas+d'image";
                              }}
                            />
                          );
                        })}

                        {/* Indicateurs de navigation (points) pour les produits avec plusieurs images */}
                        {product.images.length > 1 && hoveredProductId === product._id && (
                          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1 z-10">
                            {product.images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 
                                        ${(activeImageIndex[product._id] || 0) === idx
                                    ? 'bg-amber-500 w-4'
                                    : 'bg-white/70'}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Overlay au survol */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                              transition-opacity duration-500 
                              ${hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'}`}>
                    </div>

                    {/* Badge prix flottant */}
                    <div className={`absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                              transform transition-all duration-500
                              ${hoveredProductId === product._id ? 'translate-y-0 rotate-0 scale-110' : '-translate-y-20 rotate-12'}`}>
                      {product.price} DA
                    </div>

                    {/* Boutons flottants (coeur et panier) */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      <button
                        onClick={(e) => toggleFavorite(e, product._id)}
                        className={`p-2 rounded-full shadow-md focus:outline-none transition-all duration-300
                              ${isFavorite
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'bg-white hover:bg-gray-100'}`}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <FiHeart
                          size={20}
                          className={`transition duration-300 
                                ${isFavorite
                              ? "text-red-600 fill-red-600"
                              : "text-red-600 hover:fill-red-600"}`}
                        />
                      </button>
                      <button
                        onClick={(e) => handleCartClick(e, product._id)}
                        className={`p-2 rounded-full shadow-md focus:outline-none transition-all duration-300
                              ${isInCart
                            ? 'bg-amber-100 hover:bg-amber-200'
                            : 'bg-white hover:bg-gray-100'}`}
                        aria-label={isInCart ? "Retirer du panier" : "Ajouter au panier"}
                      >
                        {isInCart ? (
                          <HiShoppingCart className="h-5 w-5 text-amber-600" />
                        ) : (
                          <HiOutlineShoppingCart className="h-5 w-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                    {/* Rating et commentaires au bas de l'image au survol */}
                    <div className={`absolute bottom-0 left-0 right-0 flex justify-between items-center p-3 bg-gradient-to-t from-black/80 to-transparent
                              transform transition-all duration-500
                              ${hoveredProductId === product._id ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                      <div className="flex items-center">
                        <RatingStars rating={product.rating} />
                        <span className="ml-1 text-sm text-white font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center text-white">
                        <FaComment className="mr-1 text-amber-300" size={12} />
                        <span className="text-xs font-medium">{product.ratingCount} avis</span>
                      </div>
                    </div>
                  </div>

                  {/* Détails du produit */}
                  <div className={`p-3 flex-grow flex flex-col transition-all duration-300
                               ${hoveredProductId === product._id ? 'bg-amber-50' : 'bg-white'}`}>
                    <h3 className="text-neutral-800 font-semibold text-md truncate transition-all duration-300 relative">
                      {product.name}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform transition-transform duration-300
                                    ${hoveredProductId === product._id ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
                    </h3>
                    <p className="text-amber-700 font-bold text-lg mt-2">
                      {product.price} DA
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Bouton de défilement droit */}
        {showRightButton && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-amber-50 transition-colors border border-amber-200"
            aria-label="Défiler vers la droite"
          >
            <IoIosArrowForward size={24} className="text-amber-800" />
          </button>
        )}
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes productEntry {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateY(10deg) translateY(30px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateY(0) translateY(0);
            filter: blur(0);
          }
        }
        
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
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
        
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-productEntry {
          animation: productEntry 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
        
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        .animate-heartbeat {
          animation: heartbeat 0.5s ease-in-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UserRecommendations;