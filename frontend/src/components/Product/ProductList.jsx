import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Icônes
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingCart, HiShoppingCart } from 'react-icons/hi';
import { FaComment, FaStar, FaRegStar, FaStarHalfAlt, FaSort } from "react-icons/fa";
import { FiChevronDown } from 'react-icons/fi'; // Icône pour le bouton "Voir plus"

// Hooks et Utilitaires
import { useCart } from "../../components/cart/Cart";
import {
  fetchProducts,
  fetchCommentsByProduct,
  fetchUser,
  fetchProductFavoriteCount // Importez la fonction qui récupère le nombre de favoris
} from "../../utils/api";

// Composants
import FilterMenu from "./FilterMenu";
import UserRecommendations from "./UserRecommendations";

const ProductList = forwardRef(({ searchTerm, activeCategory, activeSubCategory, isVisible }, ref) => {
  const [products, setProducts] = useState([]);
  const [productsWithRatings, setProductsWithRatings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteCounts, setFavoriteCounts] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [ratings, setRatings] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [animateEntry, setAnimateEntry] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [displayLimit, setDisplayLimit] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  // Nouveau état pour le tri
  const [sortOption, setSortOption] = useState("mostFavorites"); // Par défaut, tri par nombre de favoris
  
  const cartContext = useCart();
  const navigate = useNavigate();

  if (!cartContext) {
    console.error("❌ useCart() est `undefined`. Assurez-vous d'envelopper votre application avec `<CartProvider>`.");
  }

  const { addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart, cart: contextCart } =
    cartContext || { cart: [], addToCart: () => { }, removeFromCart: () => { } };

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

  // Charger les produits
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products);

      const commentsData = {};
      const ratingsData = {};
      const favoriteCountsData = {};

      await Promise.all(
        data.products.map(async (product) => {
          try {
            const comments = await fetchCommentsByProduct(product._id);
            commentsData[product._id] = comments.length;
            ratingsData[product._id] = calculateAverageRating(comments);
            
            // Récupérer le nombre de favoris pour chaque produit
            const favoriteCount = await fetchProductFavoriteCount(product._id);
            favoriteCountsData[product._id] = favoriteCount;
          } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${product._id}:`, error);
            commentsData[product._id] = 0;
            ratingsData[product._id] = 0;
            favoriteCountsData[product._id] = 0;
          }
        })
      );

      setCommentCounts(commentsData);
      setRatings(ratingsData);
      setFavoriteCounts(favoriteCountsData);

      const productsWithRatingsData = data.products.map(product => ({
        ...product,
        rating: ratingsData[product._id] || 0,
        ratingCount: commentsData[product._id] || 0,
        favoriteCount: favoriteCountsData[product._id] || 0
      }));

      setProductsWithRatings(productsWithRatingsData);

      // Relancer l'animation quand les produits sont chargés
      setAnimateEntry(false);
      setTimeout(() => setAnimateEntry(true), 50);

    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Exposer loadProducts via la ref
  useImperativeHandle(ref, () => ({
    loadProducts
  }));

  // Charger l'utilisateur connecté
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setCurrentUser(userData.user);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // Charger tous les produits et favoris
  useEffect(() => {
    loadProducts();

    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/v2/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.data) {
          const favoriteIds = response.data.data
            .filter(fav => fav && fav.product)
            .map(fav => fav.product._id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des favoris:", error.response?.data || error);
      }
    };

    loadFavorites();
  }, [loadProducts]);

  // Initialiser l'état addedToCart en fonction du contexte du panier
  useEffect(() => {
    if (contextCart && contextCart.length > 0) {
      const cartState = {};
      contextCart.forEach(item => {
        if (item.product && item.product._id) {
          cartState[item.product._id] = true;
        }
      });
      setAddedToCart(cartState);
    }
  }, [contextCart]);

  // Réinitialiser les filtres et le displayLimit lors du changement de catégorie
  useEffect(() => {
    setFilters({});
    setDisplayLimit(12);

    // Relancer l'animation lorsque la catégorie change
    setAnimateEntry(false);
    setTimeout(() => setAnimateEntry(true), 50);

  }, [activeCategory]);

  // Relancer l'animation et réinitialiser displayLimit lorsque la sous-catégorie change
  useEffect(() => {
    setDisplayLimit(12);
    setAnimateEntry(false);
    setTimeout(() => setAnimateEntry(true), 50);
  }, [activeSubCategory]);

  // Relancer l'animation et réinitialiser displayLimit lors d'un changement dans le terme de recherche
  useEffect(() => {
    if (searchTerm) {
      setDisplayLimit(12);
      setAnimateEntry(false);
      setTimeout(() => setAnimateEntry(true), 50);
    }
  }, [searchTerm]);

  // Mise à jour du compteur de favoris après l'ajout/suppression d'un favori
  const updateFavoriteCount = async (productId) => {
    try {
      const count = await fetchProductFavoriteCount(productId);
      setFavoriteCounts(prev => ({
        ...prev,
        [productId]: count
      }));
      
      // Mettre à jour aussi dans les produits avec ratings
      setProductsWithRatings(prev => 
        prev.map(product => 
          product._id === productId 
            ? { ...product, favoriteCount: count } 
            : product
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du compteur de favoris:", error);
    }
  };

  // Gestion des favoris
  const toggleFavorite = async (e, productId) => {
    e.stopPropagation();

    // Vérifier si le produit appartient à l'utilisateur connecté
    const product = products.find(p => p._id === productId);
    if (currentUser && product && product.seller?._id === currentUser._id) {
      toast.error("Vous ne pouvez pas ajouter votre propre article aux favoris.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé !");
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
        await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFavorites(prev => prev.filter(id => id !== productId));
        toast.success("Produit retiré des favoris");
      } else {
        // Ajouter aux favoris
        await axios.post("http://localhost:8000/api/v2/favorites",
          { productId },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        setFavorites(prev => [...prev, productId]);
        toast.success("Produit ajouté aux favoris");
      }
      
      // Mettre à jour le compteur de favoris pour ce produit
      await updateFavoriteCount(productId);
      
    } catch (error) {
      console.error("❌ Erreur lors de la gestion des favoris :", error.response?.data || error);
      toast.error("Erreur lors de la gestion des favoris");
    }
  };

  // Gestion du panier
  const handleCartClick = async (e, productId) => {
    e.stopPropagation();

    // Vérifier si le produit appartient à l'utilisateur connecté
    const product = products.find(p => p._id === productId);
    if (currentUser && product && product.seller?._id === currentUser._id) {
      toast.error("Vous ne pouvez pas ajouter votre propre article au panier.");
      return;
    }

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
      setAddedToCart(prev => ({ ...prev, [productId]: !isProductInCart }));

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
      setAddedToCart(prev => ({ ...prev, [productId]: !prev[productId] }));
      toast.error("Erreur lors de la gestion du panier");
    }
  };

  useEffect(() => {
    if (hoveredProductId) {
      const product = products.find(p => p._id === hoveredProductId);
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
  }, [hoveredProductId, products]);

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

  // Appliquer les filtres
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setDisplayLimit(12);
    // Relancer l'animation lorsque les filtres changent
    setAnimateEntry(false);
    setTimeout(() => setAnimateEntry(true), 50);
  };

  // Augmenter la limite d'affichage (fonction "Voir plus")
  const loadMoreProducts = () => {
    setLoadingMore(true);
    // Simule un délai de chargement pour l'animation
    setTimeout(() => {
      setDisplayLimit(prevLimit => prevLimit + 12); // Ajouter 12 produits supplémentaires
      setLoadingMore(false);
    }, 600);
  };

  // Gérer le changement d'option de tri
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // Relancer l'animation lors du changement de tri
    setAnimateEntry(false);
    setTimeout(() => setAnimateEntry(true), 50);
  };

  // Filtrer les produits
  const filteredProducts = productsWithRatings.filter((product) => {
    // Exclure les produits du vendeur connecté et les produits vendus
    const isNotSellerProduct = !currentUser || product.seller?._id !== currentUser._id;
    const isAvailable = product.etat !== "vendu";

    const matchesBasicCriteria =
      isNotSellerProduct &&
      isAvailable && // Exclure les produits vendus
      (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!activeCategory || product.category?._id === activeCategory) &&
      (!activeSubCategory || product.subCategory?._id === activeSubCategory) &&
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

  // Trier les produits selon l'option choisie
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "mostFavorites":
        return (b.favoriteCount || 0) - (a.favoriteCount || 0);
      case "mostComments":
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      case "highestRating":
        return (b.rating || 0) - (a.rating || 0);
      case "priceAsc":
        return (a.price || 0) - (b.price || 0);
      case "priceDesc":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return (b.favoriteCount || 0) - (a.favoriteCount || 0);
    }
  });

  // Limiter le nombre de produits affichés
  const displayedProducts = sortedProducts.slice(0, displayLimit);
  const hasMoreProducts = sortedProducts.length > displayLimit;

  // Rendu du composant
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

  return (
    <div className="bg-white overflow-hidden">
      {/* 1. Menu des filtres */}
      {activeCategory && activeSubCategory && (
        <div className="px-4 py-4 border-b border-amber-200 animate-slideInFromTop">
          <FilterMenu
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            applyFilters={applyFilters}
          />
        </div>
      )}

      {/* 2. Recommandations d'utilisateur */}
      <div className="py-4 border-b border-amber-200 animate-slideInFromRight" style={{ animationDelay: '200ms' }}>
        <div className="px-4">
        </div>
        <UserRecommendations
          initiallyVisible={true}
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          filters={filters}
        />
      </div>

      {/* 3. Catalogue des produits */}
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-amber-800 animate-slideInFromLeft relative">
            Catalogue des produits
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Options de tri */}
            <div className="relative animate-fadeIn">
              <div className="flex items-center space-x-2">
                <FaSort className="text-amber-600" />
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="bg-white border border-amber-300 text-amber-800 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 cursor-pointer appearance-none pr-8"
                >
                  <option value="mostFavorites">Plus populaires</option>
                  <option value="mostComments">Plus commentés</option>
                  <option value="highestRating">Mieux notés</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                  <option value="newest">Plus récents</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            {/* Compteur de produits */}
            <div className="text-sm text-gray-500 animate-fadeIn flex items-center">
              Affichage de {Math.min(displayLimit, sortedProducts.length)} sur {sortedProducts.length} produits
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
          {sortedProducts.length === 0 ? (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <p className="text-neutral-500 text-lg mt-4">Aucun produit trouvé.</p>
              <p className="text-neutral-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
            </div>
          ) : (
            displayedProducts.map((product, index) => {
              const commentCount = commentCounts[product._id] || 0;
              const productRating = product.rating || 0;
              const isInCart = addedToCart[product._id] || false;
              const isFavorite = favorites.includes(product._id);
              const favoriteCount = favoriteCounts[product._id] || 0;

              return (
                <div
                  id={`product-${product._id}`}
                  key={product._id}
                  className={`relative bg-white overflow-hidden rounded-xl shadow-md border border-amber-100 flex flex-col
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
                              className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-600
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
                        <RatingStars rating={productRating} />
                        <span className="ml-1 text-sm text-white font-medium">
                          {productRating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center text-white">
                        <FaComment className="mr-1 text-amber-300" size={12} />
                        <span className="text-xs font-medium">{commentCount} avis</span>
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
                    {/* Prix et nombre de favoris */}
<div className="flex justify-between items-center mt-2">
  <p className="text-amber-700 font-bold text-lg">
    {product.price} DA
  </p>
  
  {/* Affichage du nombre de favoris */}
  <div className="flex items-center text-xs text-gray-500">
    <FiHeart className={`mr-1 ${isFavorite ? "text-red-500" : "text-gray-400"}`} size={12} />
    <span>{favoriteCount}</span>
  </div>
</div>

</div>
</div>
              );
            })
          )}
        </div>

        {/* Bouton "Voir plus" */}
        {hasMoreProducts && (
          <div className="flex justify-center my-8">
            <button 
              onClick={loadMoreProducts}
              className={`flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md transition-all duration-300 transform hover:scale-105 ${loadingMore ? 'animate-pulse' : ''}`}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <div className="inline-flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Chargement...
                </div>
              ) : (
                <>
                  Voir plus
                  <FiChevronDown size={18} className="animate-bounce" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductList;