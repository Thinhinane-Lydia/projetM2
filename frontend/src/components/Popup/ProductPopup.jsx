import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../components/cart/Cart";
import Popup from "../Popup/Popup";
import { toast } from "react-toastify";
import axios from "axios";

// Icons from Heroicons
import { 
  HeartIcon, 
  XMarkIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  SwatchIcon,
  UserCircleIcon,
  CheckCircleIcon,
  StarIcon,
  CameraIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:8000";

/**
 * Enhanced Product Popup component with modern UI and animations
 */
const ProductPopup = ({ productId, onClose, onProductLoaded }) => {
  const navigate = useNavigate();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loadingState, setLoadingState] = useState({
    product: true,
    favorite: true,
  });
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [userState, setUserState] = useState({
    currentUser: null,
    isOwner: false,
    isAdmin: false,
  });
  
  // Cart integration
  const cartContext = useCart();
  const { addToCart, removeFromCart, cart = [] } = cartContext || {};
  const [inCart, setInCart] = useState(false);
  
  // Fetch current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setUserState({
            currentUser: userData.user,
            isAdmin: userData.user.role === 'admin',
            isOwner: false, // Will be updated when product is loaded
          });
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch product data
  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoadingState(prev => ({ ...prev, product: true }));
        const data = await fetchProducts();
        const foundProduct = data.products.find(p => p._id === productId);

        if (!foundProduct) {
          setError("Product not found");
        } else {
          setProduct(foundProduct);
          if (onProductLoaded) {
            onProductLoaded(foundProduct);
          }

          // Check if current user is the seller
          if (userState.currentUser && foundProduct.seller &&
              userState.currentUser._id === foundProduct.seller._id) {
            setUserState(prev => ({ ...prev, isOwner: true }));
          }
        }
      } catch (err) {
        setError("Error loading product");
        console.error("Error loading product:", err);
      } finally {
        setLoadingState(prev => ({ ...prev, product: false }));
      }
    };

    if (productId) {
      getProductData();
    }
  }, [productId, userState.currentUser, onProductLoaded]);

  // Check if product is favorite and in cart
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoadingState(prev => ({ ...prev, favorite: false }));
          return;
        }

        setLoadingState(prev => ({ ...prev, favorite: true }));
        const response = await axios.get(`${API_BASE_URL}/api/v2/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.data) {
          const favoriteIds = response.data.data
            .filter(fav => fav && fav.product)
            .map(fav => fav.product._id);
          
          setIsFavorite(favoriteIds.includes(productId));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoadingState(prev => ({ ...prev, favorite: false }));
      }
    };

    loadFavorites();
    
    // Check if product is in cart
    if (cart?.length > 0 && productId) {
      const isProductInCart = cart.some(item => item.product?._id === productId);
      setInCart(isProductInCart);
    }
  }, [productId, cart]);

  // Utility function to build image URL
  const getImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) return "";
    return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}/${imageUrl}`;
  }, []);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!userState.currentUser) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/api/v2/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await axios.post(`${API_BASE_URL}/api/v2/favorites`,
          { productId },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Product deleted successfully");
        onClose();
        navigate(userState.isAdmin ? "/Admin" : "/Profil");
      } else {
        toast.error(response?.message || "Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("An error occurred while deleting the product");
    }
  };

  // Contact seller
  const contactSeller = async () => {
    if (!userState.currentUser) {
      setShowAuthPopup(true);
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v2/conversations/start`,
        { receiverId: product.seller._id },
        { withCredentials: true }
      );
  
      onClose();
      navigate(`/messages/${response.data.conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  // Edit product
  const handleEdit = () => {
    onClose();
    navigate(`/Sell/${productId}`);
  };

  // Render seller avatar safely
  const renderSellerAvatar = () => {
    // If no seller
    if (!product?.seller) {
      return (
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <UserCircleIcon className="h-6 w-6 text-amber-600" />
        </div>
      );
    }

    // Try to get avatar URL
    let avatarUrl;
    if (typeof product.seller.avatar === 'object' && product.seller.avatar?.url) {
      avatarUrl = product.seller.avatar.url.startsWith("http") 
        ? product.seller.avatar.url 
        : `${API_BASE_URL}${product.seller.avatar.url}`;
    } else if (typeof product.seller.avatar === 'string') {
      avatarUrl = product.seller.avatar.startsWith("http") 
        ? product.seller.avatar 
        : `${API_BASE_URL}/${product.seller.avatar}`;
    }

    // If we have a valid URL, show image
    if (avatarUrl) {
      return (
        <div className="w-10 h-10 relative rounded-full overflow-hidden ring-2 ring-amber-200">
          <img
            src={avatarUrl}
            alt={product.seller.name || "Seller"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-amber-100');
              const fallback = document.createElement('span');
              fallback.className = 'text-lg font-bold text-amber-600';
              fallback.textContent = product.seller.name?.charAt(0) || "?";
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
      );
    }

    // Fallback: show first letter of seller name
    return (
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-amber-600">
          {product.seller.name?.charAt(0) || "?"}
        </span>
      </div>
    );
  };

  // Render properties in a visually appealing way
  const renderProperty = (label, value, icon = null) => {
    if (!value) return null;
    
    return (
      <div className="flex items-center gap-2 text-neutral-700">
        <div className="rounded-full p-1.5 bg-amber-100 text-amber-700">
          {icon}
        </div>
        <div>
          <span className="text-xs text-neutral-500 uppercase font-medium block">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      </div>
    );
  };

  // Loading state
  if (loadingState.product) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex items-center justify-center min-h-96 p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-16 h-16"
          >
            <div className="absolute inset-0 rounded-full border-t-4 border-amber-500 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 opacity-30"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col items-center justify-center p-8 min-h-96">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xl text-neutral-700 mb-4 font-light flex items-center">
              <XMarkIcon className="w-6 h-6 text-red-500 mr-2" />
              {error || "Product not found"}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-md"
            >
              Close
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <AnimatePresence>
        {showAuthPopup && (
          <Popup
            message="You must be logged in to perform this action."
            onClose={() => setShowAuthPopup(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-white">
          <h2 className="text-xl font-bold text-neutral-800">Détails du produit</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-neutral-500" />
          </button>
        </div>

        {/* Content area with scrolling */}
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Images */}
            <div className="md:w-2/5">
              {/* Main Image with Favorite Button Overlay */}
              <div className="relative">
                <div className="relative aspect-square mb-4 bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      src={getImageUrl(product.images[currentImageIndex]?.url)}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <CameraIcon className="w-12 h-12 mb-2" />
                      <p>No images available</p>
                    </div>
                  )}
                  
                  {/* Favorite Button as Overlay */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    disabled={loadingState.favorite}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md"
                    aria-label="Add to favorites"
                  >
                    <HeartIcon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isFavorite 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-neutral-400 hover:text-red-500'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex justify-center gap-2 mb-4">
                    {product.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative w-14 h-14 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 ${
                          currentImageIndex === idx 
                            ? 'ring-2 ring-amber-500 shadow-md' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img
                          src={getImageUrl(img.url)}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Information */}
              <div className="mb-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-amber-700 font-medium mb-1">Prix</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-amber-600">
                        {product.price} DA
                      </p>
                      {product.oldPrice && (
                        <p className="text-neutral-500 line-through text-sm ml-3 mt-1">
                          {product.oldPrice} DA
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="mb-4">
                <motion.div 
                  whileHover={{ boxShadow: '0 8px 15px -5px rgba(0, 0, 0, 0.1)' }}
                  className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-100"
                >
                  <div className="flex items-center">
                    {product.seller && renderSellerAvatar()}
                    <div className="ml-3">
                      <p className="text-xs text-amber-800 uppercase font-semibold">Vendu par</p>
                      <p className="font-medium text-neutral-800">
                        {product.seller?.name || "Vendeur inconnu"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="md:w-3/5">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-amber-50 to-white p-5 rounded-xl border border-amber-100 mb-4">
                <h1 className="text-2xl font-bold text-neutral-800 mb-3">
                  {product.name}
                </h1>
                
                {/* Quick Properties / Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.brand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {product.brand}
                    </span>
                  )}
                  {product.condition && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {product.condition}
                    </span>
                  )}
                  {product.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Characteristics */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-amber-500 rounded-sm mr-2"></span>
                  Caractéristiques
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 rounded-xl p-4">
                  {product.category && renderProperty('Category', product.category.name, <TagIcon className="w-4 h-4" />)}
                  {product.subCategory && renderProperty('Subcategory', product.subCategory.name, <TagIcon className="w-4 h-4" />)}
                  {product.size && renderProperty('Size', product.size.name, <TagIcon className="w-4 h-4" />)}
                  {product.brand && renderProperty('Brand', product.brand, <StarIcon className="w-4 h-4" />)}
                  
                  {product.color && (
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="rounded-full p-1.5 bg-amber-100 text-amber-700">
                        <SwatchIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 uppercase font-medium block">Color</span>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2 border border-neutral-200" 
                            style={{ backgroundColor: product.color.toLowerCase() }}
                          ></div>
                          <span className="font-medium">{product.color}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.condition && renderProperty('Condition', product.condition, <CheckCircleIcon className="w-4 h-4" />)}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center">
                    <span className="w-1 h-4 bg-amber-500 rounded-sm mr-2"></span>
                    Description
                  </h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white to-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm"
                  >
                    <p className="text-neutral-700 leading-relaxed">{product.description}</p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Delete Product button (replacing Add to Cart) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Supprimer l'article
            </motion.button>
            
            {/* Owner actions */}
            {userState.isOwner && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                Modifier
              </motion.button>
            )}
            
            {/* Contact seller (only show if not the owner) */}
            {!userState.isOwner && product.seller && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={contactSeller}
                className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
              >
                <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                Contacter le vendeur
              </motion.button>
            )}
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="sm:flex-none sm:w-auto py-3 px-6 rounded-xl flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition-colors"
            >
              Fermer
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductPopup;