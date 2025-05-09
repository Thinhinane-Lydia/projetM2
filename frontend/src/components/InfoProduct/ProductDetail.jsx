import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../components/cart/Cart";
import ProductComments from "./ProductComments";
import Popup from "../Popup/Popup";
import { toast } from "react-toastify";
import axios from "axios";

// Icons from Heroicons
import { 
  HeartIcon, 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  ChatBubbleLeftIcon, 
  ShieldCheckIcon,
  CameraIcon,
  TagIcon,
  SwatchIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
  InformationCircleIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:8000";

/**
 * Enhanced Product Detail component with modern UI and animations
 */
const ProductDetail = ({ productId: propProductId, onProductLoaded }) => {
  // Retrieve productId from props or URL params
  const { productId: paramProductId } = useParams();
  const productId = propProductId || paramProductId;
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
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'comments'
  
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
  }, [productId, userState.currentUser]);

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
      } else {
        await axios.post(`${API_BASE_URL}/api/v2/favorites`,
          { productId },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Toggle cart status
  const toggleCart = async () => {
    if (!userState.currentUser) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const cartItem = cart?.find(item => item.product?._id === productId);
      
      if (cartItem) {
        await removeFromCart(cartItem._id);
        setInCart(false);
      } else {
        await addToCart(productId, 1);
        setInCart(true);
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
      toast.error("Failed to update cart");
    }
  };

  // Contact seller
// Modifier la fonction contactSeller dans ProductDetail.jsx
const contactSeller = async () => {
  if (!userState.currentUser) {
    setShowAuthPopup(true);
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v2/conversations/start`,
      { userId: product.seller._id }, // Changer receiverId en userId
      { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      }
    );

    if (response.data.success) {
      navigate(`/messages/${response.data.conversationId}`);
    } else {
      toast.error(response.data.message || "Erreur lors de la création de la conversation");
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    toast.error("Échec du démarrage de la conversation");
  }
};

  // Delete product
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Product deleted successfully");
        navigate(userState.isAdmin ? "/Admin" : "/Profil");
      } else {
        toast.error(response?.message || "Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("An error occurred while deleting the product");
    }
  };

  // Edit product
  const handleEdit = () => {
    navigate(`/Sell/${productId}`);
  };

  // Render seller avatar safely
  const renderSellerAvatar = () => {
    // If no seller
    if (!product?.seller) {
      return (
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <UserCircleIcon className="h-8 w-8 text-amber-600" />
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
        <div className="w-12 h-12 relative rounded-full overflow-hidden ring-2 ring-amber-200">
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
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
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
      <div className="flex items-center gap-3 text-neutral-700">
        <div className="rounded-full p-2 bg-amber-100 text-amber-700">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 rounded-full border-t-4 border-amber-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 opacity-30"></div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-white">
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
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-md flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Retour aux produits
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 py-12">
      <AnimatePresence>
        {showAuthPopup && (
          <Popup
            message="You must be logged in to perform this action."
            onClose={() => setShowAuthPopup(false)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Navigation & Admin Badge */}
        <div className="flex justify-between items-center mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-amber-700 hover:text-amber-900 transition font-medium group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Retour aux produits
            </button>
          </motion.div>
          
          {userState.isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm shadow-sm"
            >
              <ShieldCheckIcon className="w-4 h-4 mr-1.5" />
              Mode Administrateur
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images & Thumbnails - Now in a sticky container */}
          <div className="lg:w-2/5 lg:sticky lg:top-4 lg:self-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden p-6"
            >
              {/* Main Image with Favorite Button Overlay */}
              <div className="relative">
                <div className="relative aspect-square mb-4 bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center">
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
                    className="absolute top-3 right-3 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md"
                    aria-label="Add to favorites"
                  >
                    <HeartIcon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isFavorite 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-neutral-400 hover:text-red-500'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex justify-center gap-2 mb-6">
                    {product.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative w-16 h-16 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 ${
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
              <div className="mb-6 bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-amber-700 font-medium mb-1">Prix</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-amber-600">
                        {product.price} DA
                      </p>
                      {product.oldPrice && (
                        <p className="text-neutral-500 line-through text-sm ml-3 mt-1">
                          {product.oldPrice} DA
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Stock indicator */}
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
              {!userState.isOwner && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleCart}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
                    inCart
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                  }`}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  {inCart ? 'Retirer du panier' : 'Ajouter au panier'}
                </motion.button>
                 )}
                {!userState.isOwner && product.seller && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={contactSeller}
                    className="w-full py-4 px-6 rounded-xl flex items-center justify-center bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                    Contacter le vendeur
                  </motion.button>
                )}

                {/* Owner Actions */}
                {userState.isOwner && (
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg"
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Modifier
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDelete}
                      className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-neutral-700 hover:bg-neutral-800 text-white transition-colors shadow-md hover:shadow-lg"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      Supprimer
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Seller Card - Move from the main section to here */}
              <div className="mt-6">
                <motion.div 
                  whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="flex items-center p-5 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-100"
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
            </motion.div>
          </div>
          <div className="lg:w-3/5">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-amber-50 to-white p-8 border-b border-amber-100">
                    <h1 className="text-3xl font-bold text-neutral-800 mb-4">
                      {product.name}
                    </h1>
                    
                    {/* Quick Properties / Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
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

                  {/* Tab Navigation */}
                  <div className="border-b border-neutral-200">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 px-5 py-4 text-center font-medium transition-colors relative ${
                          activeTab === 'details' 
                            ? 'text-amber-600' 
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <InformationCircleIcon className="w-5 h-5 mr-2" />
                          Détails
                        </div>
                        {activeTab === 'details' && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex-1 px-5 py-4 text-center font-medium transition-colors relative ${
                          activeTab === 'comments' 
                            ? 'text-amber-600' 
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                          Commentaires
                        </div>
                        {activeTab === 'comments' && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-8">
                    {activeTab === 'details' ? (
                      <div>
                        {/* Product Details */}
                        <div className="space-y-8">
                          {/* Product Characteristics in modern grid layout */}
                          <div>
                            <h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
                              <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                              Caractéristiques
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 rounded-2xl p-6">
                              {product.category && renderProperty('Category', product.category.name, <TagIcon className="w-5 h-5" />)}
                              {product.subCategory && renderProperty('Subcategory', product.subCategory.name, <TagIcon className="w-5 h-5" />)}
                              {product.size && renderProperty('Size', product.size.name, <TagIcon className="w-5 h-5" />)}
                              {product.brand && renderProperty('Brand', product.brand, <StarIcon className="w-5 h-5" />)}
                              
                              {product.color && (
                                <div className="flex items-center gap-3 text-neutral-700">
                                  <div className="rounded-full p-2 bg-amber-100 text-amber-700">
                                    <SwatchIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span className="text-xs text-neutral-500 uppercase font-medium block">Color</span>
                                    <div className="flex items-center">
                                      <div 
                                        className="w-4 h-4 rounded-full mr-2 border border-neutral-200" 
                                        style={{ backgroundColor: product.color.toLowerCase() }}
                                      ></div>
                                      <span className="font-medium">{product.color}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {product.condition && renderProperty('Condition', product.condition, <CheckCircleIcon className="w-5 h-5" />)}
                            </div>
                          </div>

                          {/* Description */}
                          {product.description && (
                            <div>
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                                <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                                Description
                              </h2>
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm"
                              >
                                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[400px]">
                        <ProductComments productId={productId} />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      
    
  );
};

export default ProductDetail;