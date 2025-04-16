
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
// import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle, FiShield } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import ProductComments from "./ProductComments";
// import Popup from "../Popup/Popup";
// import { toast } from "react-toastify";

// import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import ProductComments from "./ProductComments";
// import Popup from "../Popup/Popup";
 
// const ProductDetail = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Vérifier si on est en mode admin avec le paramètre d'URL
//   const isAdminMode = new URLSearchParams(location.search).get('isAdmin') === 'true';

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [inCart, setInCart] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [avatarError, setAvatarError] = useState(false);
//   const [isOwner, setIsOwner] = useState(false);


//   // Récupérer l'utilisateur courant
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const userData = await fetchUser();
//         if (userData.success) {
//           setCurrentUser(userData.user);
//           setIsAdmin(userData.user.role === 'admin');
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération de l'utilisateur courant:", err);
//       }
//     };

//     getCurrentUser();
//   }, []);

//   // Récupérer les informations du produit  
//   useEffect(() => {
//     const getProductData = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchProducts();
//         const foundProduct = data.products.find(p => p._id === productId);

//         if (!foundProduct) {
//           setError("Produit non trouvé");
//         } else {
//           setProduct(foundProduct);

//           // Vérifier si l'utilisateur connecté est le vendeur du produit
//           if (currentUser && foundProduct.seller &&
//             currentUser._id === foundProduct.seller._id) {
//             setIsOwner(true);
//           }
//         }
//       } catch (err) {
//         setError("Erreur lors du chargement du produit");
//         console.error("Erreur de chargement du produit:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProductData();
//   }, [productId, currentUser]);

//   // Fonction utilitaire pour construire l'URL de l'image
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl) return "";

//     return imageUrl.startsWith("http")
//       ? imageUrl
//       : `http://localhost:8000/${imageUrl}`;
//   };

//   // Gérer l'ajout aux favoris
//   const toggleFavorite = () => {
//     if (!currentUser) {
//       setShowPopup(true);
//       return;
//     }

//     setIsFavorite(!isFavorite);
//     // Ici, vous pourriez appeler une fonction API pour sauvegarder dans la BD
//   };

//   // Gérer l'ajout au panier
//   const toggleCart = () => {
//     if (!currentUser) {
//       setShowPopup(true);
//       return;
//     }

//     setInCart(!inCart);
//     // Ici, vous pourriez appeler une fonction API pour sauvegarder dans la BD
//   };

//   // Fermer le popup
//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   // Changer l'image affichée
//   const handleImageChange = (index) => {
//     setCurrentImage(index);
//   };

//   // Gérer l'erreur de chargement de l'avatar
//   const handleAvatarError = () => {
//     setAvatarError(true);
//   };

//   // Fonction pour contacter le vendeur
//   const handleContactSeller = () => {
//     if (!currentUser) {
//       setShowPopup(true);
//       return;
//     }
//     if (product.seller && product.seller._id) {
//       navigate(`/messages/${product.seller._id}?productId=${productId}`);
//     }
//   };

//   // Fonction pour afficher l'avatar du vendeur de manière sécurisée
//   const renderSellerAvatar = () => {
//     // Vérifie si le vendeur existe
//     if (!product.seller) {
//       return (
//         <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
//           <span className="text-lg font-bold text-amber-600">?</span>
//         </div>
//       );
//     }

//     // Si l'avatar existe et n'a pas d'erreur
//     if (product.seller.avatar && !avatarError) {
//       let avatarUrl;
      
//       if (typeof product.seller.avatar === 'object' && product.seller.avatar.url) {
//         // Cas où l'avatar est un objet avec une propriété url
//         avatarUrl = product.seller.avatar.url.startsWith("http") 
//           ? product.seller.avatar.url 
//           : `http://localhost:8000${product.seller.avatar.url}`;
//       } else if (typeof product.seller.avatar === 'string') {
//         // Cas où l'avatar est directement une chaîne de caractères
//         avatarUrl = product.seller.avatar.startsWith("http") 
//           ? product.seller.avatar 
//           : `http://localhost:8000/${product.seller.avatar}`;
//       } else {
//         // Si format non reconnu, utilisez une valeur par défaut
//         return (
//           <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
//             <span className="text-lg font-bold text-amber-600">
//               {product.seller.name?.charAt(0) || "?"}
//             </span>
//           </div>
//         );
//       }

//       return (
//         <img
//           src={avatarUrl}
//           alt={product.seller.name || "Vendeur"}
//           className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200"
//           onError={handleAvatarError}
//         />
//       );
//     }

//     // Fallback: affiche la première lettre du nom du vendeur
//     return (
//       <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
//         <span className="text-lg font-bold text-amber-600">
//           {product.seller.name?.charAt(0) || "?"}
//         </span>
//       </div>
//     );
//   };

//   // Fonction pour supprimer le produit
//   const handleDelete = async () => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

//     const response = await deleteProduct(productId);
//     if (response.success) {
//       toast.success("Produit supprimé avec succès");
//       navigate(isAdminMode ? "/Admin" : "/Profil"); // Redirige vers la page appropriée
//     } else {
//       toast.error(response?.message || "Erreur lors de la suppression");
//     }
//   };

//   // Fonction pour modifier le produit
//   const handleEdit = () => {
//     navigate(`/Sell/${productId}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-neutral-50">
//         <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-amber-500"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
//         <div className="text-xl text-neutral-700 mb-4 font-light">{error || "Produit non trouvé"}</div>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-md flex items-center"
//         >
//           <FiArrowLeft className="mr-2" /> Retour aux produits
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white pt-10 pb-16">
//       {showPopup && (
//         <Popup
//           message="Vous devez être connecté pour effectuer cette action."
//           onClose={handleClosePopup}
//         />
//       )}

//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Navigation */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-amber-700 hover:text-amber-900 transition font-medium group"
//           >
//             <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
//             Retour {isAdminMode ? "à l'administration" : "aux produits"}
//           </button>
//         </div>

//         {/* Badge Mode Admin */}
//         {isAdminMode && (
//           <div className="mb-5 inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm">
//             <FiShield className="w-4 h-4 mr-1.5" />
//             Mode Administrateur
//           </div>
//         )}

//         {/* Mise en page adaptée selon le mode */}
//         <div className={`grid grid-cols-1 ${isAdminMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
//           {/* Colonne principale: infos produit */}
//           <div className={isAdminMode ? "w-full" : "lg:col-span-2"}>
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full">
//               {/* Section principale - Photos et infos produit */}
//               <div className="md:flex flex-col">
//                 {/* En-tête avec titre et bouton favoris (uniquement en mode normal) */}
//                 <div className="px-8 pt-8 pb-2 flex justify-between items-start">
//                   <div>
//                     <h1 className="text-3xl font-bold text-neutral-800 mb-2">{product.name}</h1>
//                     <button
//                       onClick={toggleFavorite}
//                       className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 group"
//                       aria-label="Ajouter aux favoris"
//                     >
//                       <FiHeart
//                         size={24}
//                         className={`transition duration-300 ${
//                           isFavorite 
//                             ? 'text-red-500 fill-red-500' 
//                             : 'text-neutral-400 group-hover:text-red-500'
//                         }`}
//                       />
//                     </button>
//                   )}
//                 </div>

//                 {/* Prix */}
//                 <div className="px-8 mb-6">
//                   <p className="text-3xl font-bold text-amber-600">{product.price} DA</p>
//                   {product.oldPrice && (
//                     <p className="text-neutral-500 line-through text-sm mt-1">
//                       {product.oldPrice} DA
//                     </p>
//                   )}
//                 </div>

//                 {/* Galerie d'images */}
//                 <div className="px-6 md:px-8">
//                   <div className="relative h-80 md:h-96 bg-neutral-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
//                     {product.images && product.images.length > 0 ? (
//                       <img
//                         src={getImageUrl(product.images[currentImage]?.url)}
//                         alt={product.name}
//                         className="w-full h-full object-contain transition duration-300 ease-in-out"
//                       />
//                     ) : (
//                       <div className="text-neutral-400">Aucune image disponible</div>
//                     )}
//                   </div>

//                   {/* Miniatures avec animation et effet hover */}
//                   {product.images && product.images.length > 1 && (
//                     <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-amber-200 pb-4">
//                       {product.images.map((img, idx) => (
//                         <div
//                           key={idx}
//                           className={`relative w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
//                             currentImage === idx 
//                               ? 'ring-2 ring-amber-500 shadow-md transform scale-105' 
//                               : 'opacity-80 hover:opacity-100'
//                           }`}
//                           onClick={() => handleImageChange(idx)}
//                         >
//                           <img
//                             src={getImageUrl(img.url)}
//                             alt={`Miniature ${idx + 1}`}
//                             className="w-full h-full object-cover rounded-lg"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Caractéristiques du produit */}
//                 <div className="mt-8 px-8">
//                   <h2 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center">
//                     <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
//                     Caractéristiques
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 rounded-xl p-5">
//                     <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                       <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Catégorie</p>
//                       <p className="font-medium text-neutral-700">{product.category?.name || "Non spécifié"}</p>
//                     </div>
//                     <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                       <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Sous-catégorie</p>
//                       <p className="font-medium text-neutral-700">{product.subCategory?.name || "Non spécifié"}</p>
//                     </div>
//                     {product.size && (
//                       <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                         <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Taille</p>
//                         <p className="font-medium text-neutral-700">{product.size.name}</p>
//                       </div>
//                     )}
//                     {product.brand && (
//                       <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                         <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Marque</p>
//                         <p className="font-medium text-neutral-700">{product.brand}</p>
//                       </div>
//                     )}
//                     {product.material && (
//                       <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                         <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Matériau</p>
//                         <p className="font-medium text-neutral-700">{product.material}</p>
//                       </div>
//                     )}
//                     {product.color && (
//                       <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                         <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Couleur</p>
//                         <p className="font-medium text-neutral-700">{product.color}</p>
//                       </div>
//                     )}
//                     {product.condition && (
//                       <div className="p-3 rounded-lg border border-neutral-200 bg-white">
//                         <p className="text-xs text-amber-600 uppercase font-semibold mb-1">État</p>
//                         <p className="font-medium text-neutral-700">{product.condition}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {product.description && (
//                   <div className="mt-6 px-8">
//                     <h2 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center">
//                       <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
//                       Description
//                     </h2>
//                     <div className="bg-white p-4 rounded-xl border border-neutral-200">
//                       <p className="text-neutral-600 leading-relaxed">{product.description}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Vendeur */}
//                 <div className="mt-6 mx-8">
//                   <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
//                     <div className="flex items-center">
//                       {product.seller && renderSellerAvatar()}
//                       <div className="ml-3">
//                         <p className="text-xs text-amber-800 uppercase font-semibold">Vendu par</p>
//                         <p className="font-medium text-neutral-800">
//                           {product.seller?.name || "Vendeur inconnu"}
//                         </p>
//                       </div>
//                     </div>

//                         <FiMessageCircle className="mr-2" />
//                         Contacter le vendeur
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Boutons d'action */}
//                 <div className="mt-8 px-8 pb-8">
//                   {isAdminMode ? (
//                     // Mode admin: uniquement bouton de suppression
//                     <button
//                       onClick={handleDelete}
//                       className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md hover:shadow-lg"
//                     >
//                       <FiTrash2 className="mr-2" />
//                       Supprimer ce produit
//                     </button>
//                   ) : isOwner ? (
//                     // Mode propriétaire: modifier et supprimer
//                     <div className="flex space-x-4">
//                       <button
//                         onClick={handleEdit}
//                         className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg"
//                       >
//                         <FiEdit2 className="mr-2" />
//                         Modifier
//                       </button>
//                       <button
//                         onClick={handleDelete}
//                         className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-neutral-700 hover:bg-neutral-800 text-white transition-colors shadow-md hover:shadow-lg"
//                       >
//                         <FiTrash2 className="mr-2" />
//                         Supprimer
//                       </button>
//                     </div>
//                   ) : (
//                     // Mode client: ajouter au panier
//                     <button
//                       onClick={toggleCart}
//                       className={`w-full py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
//                         inCart
//                           ? 'bg-green-600 hover:bg-green-700 text-white'
//                           : 'bg-amber-500 hover:bg-amber-600 text-white'
//                       }`}
//                     >
//                       <HiOutlineShoppingBag size={22} className="mr-2" />
//                       {inCart ? 'Retiré du panier' : 'Ajouter au panier'}
//                     </button>
//                   )}
//                 </div>


              
 
//               </div>
//             </div>
//           </div>

//           {/* Colonne des commentaires (uniquement en mode normal) */}
//           {!isAdminMode && (
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full p-6">
//                 <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
//                   <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
//                   Avis & Commentaires
//                 </h2>
//                 <ProductComments productId={productId} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle, FiShield, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import ProductComments from "./ProductComments";
import Popup from "../Popup/Popup";
import { toast } from "react-toastify";
import { useCart } from "../../components/cart/Cart";
import axios from "axios";

 

// Mode popup = true pour les admins qui voient le composant comme popup
// Mode popup = false pour la page normale InfoProduct
const ProductDetail = ({ 
  productId: propProductId, 
  isPopup = false, 
  onClose = null,
  onProductDeleted = null
}) => {
  // Récupérer productId soit depuis les props (mode popup) soit depuis l'URL (mode page)
  const { productId: paramProductId } = useParams();
  const productId = propProductId || paramProductId;
  
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const cartContext = useCart();
  
  if (!cartContext) {
    console.error("❌ useCart() est `undefined`. Assurez-vous d'envelopper votre application avec `<CartProvider>`.");
  }
  
  const { addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart, cart } = cartContext || { 
    cart: [], 
    addToCart: () => {}, 
    removeFromCart: () => {} 
  };

  // Récupérer l'utilisateur courant
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setCurrentUser(userData.user);
          setIsAdmin(userData.user.role === 'admin');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur courant:", err);
      }
    };

    getCurrentUser();
  }, []);

  // Récupérer les informations du produit  
  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const foundProduct = data.products.find(p => p._id === productId);

        if (!foundProduct) {
          setError("Produit non trouvé");
        } else {
          setProduct(foundProduct);

          // Vérifier si l'utilisateur connecté est le vendeur du produit
          if (currentUser && foundProduct.seller &&
            currentUser._id === foundProduct.seller._id) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error("Erreur de chargement du produit:", err);
      } finally {
        setLoading(false);
      }
    };

    getProductData();
  }, [productId, currentUser]);

  // Vérifier si le produit est dans les favoris et dans le panier
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/v2/favorites", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.data) {
          const favoriteIds = response.data.data
            .filter(fav => fav && fav.product)
            .map(fav => fav.product._id);
          
          // Mettre à jour l'état isFavorite si le produit est dans les favoris
          setIsFavorite(favoriteIds.includes(productId));
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des favoris:", error.response?.data || error);
      }
    };

    loadFavorites();
    
    // Vérifier si le produit est dans le panier
    if (cart && cart.length > 0 && productId) {
      const isProductInCart = cart.some(item => item.product?._id === productId);
      setInCart(isProductInCart);
    }
  }, [productId, cart]);

  // Fonction utilitaire pour construire l'URL de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `http://localhost:8000/${imageUrl}`;
  };

  // Gérer l'ajout aux favoris
  const toggleFavorite = async () => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé !");
        return;
      }

      if (isFavorite) {
        // Supprimer des favoris
        await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsFavorite(false);
        console.log("✅ Produit retiré des favoris");
      } else {
        // Ajouter aux favoris
        await axios.post("http://localhost:8000/api/v2/favorites",
          { productId },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        setIsFavorite(true);
        console.log("✅ Produit ajouté aux favoris");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la gestion des favoris :", error.response?.data || error);
    }
  };

  // Gérer l'ajout au panier
  const toggleCart = async () => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    try {
      const cartItem = cart.find(item => item.product?._id === productId);
      
      if (cartItem) {
        await contextRemoveFromCart(cartItem._id);
        setInCart(false);
        console.log("✅ Produit retiré du panier");
      } else {
        await contextAddToCart(productId, 1);
        setInCart(true);
        console.log("✅ Produit ajouté au panier");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout/suppression du panier", error);
    }
  };

  // Fermer le popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Changer l'image affichée
  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  // Gérer l'erreur de chargement de l'avatar
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Fonction pour contacter le vendeur
  const handleContactSeller = async () => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }
  
    try {
      // Appeler l'API pour démarrer ou récupérer une conversation
      const response = await axios.post(
        "http://localhost:8000/api/v2/conversations/start", // Modification de l'URL
        { receiverId: product.seller._id },
        { withCredentials: true }
      );
  
      const conversationId = response.data.conversationId;
  
      // Rediriger vers la page de conversation
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("❌ Erreur lors de la création de la conversation :", error);
    }
  };
  
  

  // Fonction pour afficher l'avatar du vendeur de manière sécurisée
  const renderSellerAvatar = () => {
    // Vérifie si le vendeur existe
    if (!product.seller) {
      return (
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-amber-600">?</span>
        </div>
      );
    }

    // Si l'avatar existe et n'a pas d'erreur
    if (product.seller.avatar && !avatarError) {
      let avatarUrl;
      
      if (typeof product.seller.avatar === 'object' && product.seller.avatar.url) {
        // Cas où l'avatar est un objet avec une propriété url
        avatarUrl = product.seller.avatar.url.startsWith("http") 
          ? product.seller.avatar.url 
          : `http://localhost:8000${product.seller.avatar.url}`;
      } else if (typeof product.seller.avatar === 'string') {
        // Cas où l'avatar est directement une chaîne de caractères
        avatarUrl = product.seller.avatar.startsWith("http") 
          ? product.seller.avatar 
          : `http://localhost:8000/${product.seller.avatar}`;
      } else {
        // Si format non reconnu, utilisez une valeur par défaut
        return (
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-amber-600">
              {product.seller.name?.charAt(0) || "?"}
            </span>
          </div>
        );
      }

      return (
        <img
          src={avatarUrl}
          alt={product.seller.name || "Vendeur"}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200"
          onError={handleAvatarError}
        />
      );
    }

    // Fallback: affiche la première lettre du nom du vendeur
    return (
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-amber-600">
          {product.seller.name?.charAt(0) || "?"}
        </span>
      </div>
    );
  };

  // Fonction pour supprimer le produit
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Produit supprimé avec succès");
        
        // Si c'est en mode popup, informer le parent et fermer
        if (isPopup) {
          if (onProductDeleted) {
            onProductDeleted(productId);
          }
          if (onClose) {
            onClose();
          }
        } else {
          // Sinon, rediriger vers la page appropriée
          navigate(isAdmin ? "/Admin" : "/Profil");
        }
      } else {
        toast.error(response?.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  // Fonction pour modifier le produit
  const handleEdit = () => {
    navigate(`/Sell/${productId}`);
  };

  if (loading) {
    return isPopup ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-amber-500"></div>
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error || !product) {
    if (isPopup) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-red-600">Erreur</h2>
              <button 
                onClick={onClose} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-center text-gray-700 my-6">{error || "Produit non trouvé"}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
        <div className="text-xl text-neutral-700 mb-4 font-light">{error || "Produit non trouvé"}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-md flex items-center"
        >
          <FiArrowLeft className="mr-2" /> Retour aux produits
        </button>
      </div>
    );
  }

  // Contenu principal du détail produit qui sera utilisé dans les deux modes
  const productContent = (
    <>
      {/* Titre et ID du produit */}
      <div className={`px-${isPopup ? '4' : '8'} pt-${isPopup ? '2' : '8'} pb-2 flex justify-between items-start`}>
        <div>
          <h1 className={`text-${isPopup ? '2xl' : '3xl'} font-bold text-neutral-800 mb-${isPopup ? '1' : '2'}`}>{product.name}</h1>
          <p className="text-neutral-500 text-sm font-medium">
            ID: {product._id}
          </p>
        </div>
        {!isPopup && (
          <button
            onClick={toggleFavorite}
            className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 group"
            aria-label="Ajouter aux favoris"
          >
            <FiHeart
              size={24}
              className={`transition duration-300 ${
                isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-neutral-400 group-hover:text-red-500'
              }`}
            />
          </button>
        )}
      </div>

      {/* Prix */}
      <div className={`px-${isPopup ? '4' : '8'} mb-${isPopup ? '4' : '6'}`}>
        <p className={`text-${isPopup ? '2xl' : '3xl'} font-bold text-amber-600`}>{product.price} DA</p>
        {product.oldPrice && (
          <p className="text-neutral-500 line-through text-sm mt-1">
            {product.oldPrice} DA
          </p>
        )}
      </div>

      {/* Galerie d'images */}
      <div className={`px-${isPopup ? '4' : '6 md:px-8'}`}>
        <div className={`relative h-${isPopup ? '64' : '80 md:h-96'} bg-neutral-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center`}>
          {product.images && product.images.length > 0 ? (
            <img
              src={getImageUrl(product.images[currentImage]?.url)}
              alt={product.name}
              className="h-full object-contain transition duration-300 ease-in-out"
            />
          ) : (
            <div className="text-neutral-400">Aucune image disponible</div>
          )}
        </div>

        {/* Miniatures avec animation et effet hover */}
        {product.images && product.images.length > 1 && (
          <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-amber-200 pb-4">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-${isPopup ? '16' : '20'} h-${isPopup ? '16' : '20'} flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                  currentImage === idx 
                    ? 'ring-2 ring-amber-500 shadow-md transform scale-105' 
                    : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => handleImageChange(idx)}
              >
                <img
                  src={getImageUrl(img.url)}
                  alt={`Miniature ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caractéristiques du produit */}
      <div className={`mt-${isPopup ? '6' : '8'} px-${isPopup ? '4' : '8'}`}>
        <h2 className={`text-lg font-semibold text-neutral-700 mb-${isPopup ? '2' : '4'} flex items-center`}>
          <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
          Caractéristiques
        </h2>
        <div className={`grid grid-cols-1 ${isPopup ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-${isPopup ? '2' : '4'} bg-neutral-50 rounded-xl p-${isPopup ? '4' : '5'}`}>
          {product.category && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Catégorie</p>
              <p className="font-medium text-neutral-700">{product.category.name || "Non spécifié"}</p>
            </div>
          )}
          {product.subCategory && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Sous-catégorie</p>
              <p className="font-medium text-neutral-700">{product.subCategory.name || "Non spécifié"}</p>
            </div>
          )}
          {product.size && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Taille</p>
              <p className="font-medium text-neutral-700">{product.size.name}</p>
            </div>
          )}
          {product.brand && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Marque</p>
              <p className="font-medium text-neutral-700">{product.brand}</p>
            </div>
          )}
          {product.color && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Couleur</p>
              <p className="font-medium text-neutral-700">{product.color}</p>
            </div>
          )}
          {product.condition && (
            <div className={`p-${isPopup ? '2' : '3'} rounded-lg border border-neutral-200 bg-white`}>
              <p className="text-xs text-amber-600 uppercase font-semibold mb-1">État</p>
              <p className="font-medium text-neutral-700">{product.condition}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className={`mt-6 px-${isPopup ? '4' : '8'}`}>
          <h2 className={`text-lg font-semibold text-neutral-700 mb-${isPopup ? '2' : '3'} flex items-center`}>
            <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
            Description
          </h2>
          <div className={`bg-white p-${isPopup ? '3' : '4'} rounded-xl border border-neutral-200`}>
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      )}

      {/* Vendeur */}
      <div className={`mt-6 ${isPopup ? 'px-4' : 'mx-8'}`}>
        <div className={`flex items-center ${!isPopup && !isOwner && product.seller ? 'justify-between' : ''} p-${isPopup ? '3' : '4'} bg-amber-50 rounded-xl border border-amber-100`}>
          <div className="flex items-center">
            {product.seller && renderSellerAvatar()}
            <div className="ml-3">
              <p className="text-xs text-amber-800 uppercase font-semibold">Vendu par</p>
              <p className="font-medium text-neutral-800">
                {product.seller?.name || "Vendeur inconnu"}
              </p>
            </div>
          </div>
          {!isPopup && !isOwner && product.seller && (
            <button
              onClick={handleContactSeller}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors flex items-center shadow-sm"
            >
              <FiMessageCircle className="mr-2" />
              Contacter le vendeur
            </button>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className={`mt-${isPopup ? '6' : '8'} px-${isPopup ? '4' : '8'} pb-${isPopup ? '4' : '8'}`}>
        {isPopup ? (
          // Mode popup (admin): uniquement bouton de suppression
          <button
            onClick={handleDelete}
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md hover:shadow-lg"
          >
            <FiTrash2 className="mr-2" />
            Supprimer ce produit
          </button>
        ) : isOwner ? (
          // Mode propriétaire: modifier et supprimer
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg"
            >
              <FiEdit2 className="mr-2" />
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-neutral-700 hover:bg-neutral-800 text-white transition-colors shadow-md hover:shadow-lg"
            >
              <FiTrash2 className="mr-2" />
              Supprimer
            </button>
          </div>
        ) : (
          // Mode client: ajouter au panier
          <button
            onClick={toggleCart}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
              inCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <HiOutlineShoppingBag size={22} className="mr-2" />
            {inCart ? 'Retiré du panier' : 'Ajouter au panier'}
          </button>
        )}
      </div>
    </>
  );

  // Affichage différent selon le mode (popup ou page)
  if (isPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* En-tête avec bouton de fermeture */}
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-neutral-800">Détails du produit</h2>
              <div className="ml-3 flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                <FiShield className="w-3 h-3 mr-1" />
                Mode Admin
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6">
            {productContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white pt-10 pb-16">
      {showPopup && (
        <Popup
          message="Vous devez être connecté pour effectuer cette action."
          onClose={handleClosePopup}
        />
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-700 hover:text-amber-900 transition font-medium group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Retour aux produits
          </button>
        </div>

        {/* Badge Mode Admin si admin */}
        {isAdmin && (
          <div className="mb-5 inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm">
            <FiShield className="w-4 h-4 mr-1.5" />
            Mode Administrateur
          </div>
        )}

        {/* Mise en page adaptée selon le mode */}
        <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
          {/* Colonne principale: infos produit */}
          <div className={isAdmin ? "w-full" : "lg:col-span-2"}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full">
              {/* Section principale - Photos et infos produit */}
              <div className="md:flex flex-col">
                {productContent}
                {/* En-tête avec titre et bouton favoris */}
                <div className="px-8 pt-8 pb-2 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">{product.name}</h1>
                    
                  </div>
                  <button
                    onClick={toggleFavorite}
                    className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 group"
                    aria-label="Ajouter aux favoris"
                  >
                    <FiHeart
                      size={24}
                      className={`transition duration-300 ${
                        isFavorite 
                          ? 'text-red-800 fill-red-800' 
                          : 'text-neutral-400 group-hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Prix */}
                <div className="px-8 mb-6">
                  <p className="text-3xl font-bold text-amber-600">{product.price} DA</p>
                  {product.oldPrice && (
                    <p className="text-neutral-500 line-through text-sm mt-1">
                      {product.oldPrice} DA
                    </p>
                  )}
                </div>

                {/* Galerie d'images */}
                <div className="px-6 md:px-8">
                  <div className="relative h-80 md:h-96 bg-neutral-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={getImageUrl(product.images[currentImage]?.url)}
                        alt={product.name}
                        className="w-full h-full object-contain transition duration-300 ease-in-out"
                      />
                    ) : (
                      <div className="text-neutral-400">Aucune image disponible</div>
                    )}
                  </div>

                  {/* Miniatures avec animation et effet hover */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-amber-200 pb-4">
                      {product.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                            currentImage === idx 
                              ? 'ring-2 ring-amber-500 shadow-md transform scale-105' 
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          onClick={() => handleImageChange(idx)}
                        >
                          <img
                            src={getImageUrl(img.url)}
                            alt={`Miniature ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Caractéristiques du produit */}
                <div className="mt-8 px-8">
                  <h2 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center">
                    <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                    Caractéristiques
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 rounded-xl p-5">
                    <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                      <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Catégorie</p>
                      <p className="font-medium text-neutral-700">{product.category?.name || "Non spécifié"}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                      <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Sous-catégorie</p>
                      <p className="font-medium text-neutral-700">{product.subCategory?.name || "Non spécifié"}</p>
                    </div>
                    {product.size && (
                      <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Taille</p>
                        <p className="font-medium text-neutral-700">{product.size.name}</p>
                      </div>
                    )}
                    {product.brand && (
                      <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Marque</p>
                        <p className="font-medium text-neutral-700">{product.brand}</p>
                      </div>
                    )}
                    {product.material && (
                      <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Matériau</p>
                        <p className="font-medium text-neutral-700">{product.material}</p>
                      </div>
                    )}
                    {product.color && (
                      <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Couleur</p>
                        <p className="font-medium text-neutral-700">{product.color}</p>
                      </div>
                    )}
                    {product.condition && (
                      <div className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">État</p>
                        <p className="font-medium text-neutral-700">{product.condition}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mt-6 px-8">
                    <h2 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center">
                      <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                      Description
                    </h2>
                    <div className="bg-white p-4 rounded-xl border border-neutral-200">
                      <p className="text-neutral-600 leading-relaxed">{product.description}</p>
                    </div>
                  </div>
                )}

                {/* Vendeur */}
                <div className="mt-6 mx-8">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center">
                      {product.seller && renderSellerAvatar()}
                      <div className="ml-3">
                        <p className="text-xs text-amber-800 uppercase font-semibold">Vendu par</p>
                        <p className="font-medium text-neutral-800">
                          {product.seller?.name || "Vendeur inconnu"}
                        </p>
                      </div>
                    </div>
                    {!isOwner && product.seller && (
                      <button
                        onClick={handleContactSeller}
                        className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors flex items-center shadow-sm"
                      >
                        <FiMessageCircle className="mr-2" />
                        Contacter le vendeur
                      </button>
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-8 px-8 pb-8">
                  {isOwner ? (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleEdit}
                        className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md hover:shadow-lg"
                      >
                        <FiEdit2 className="mr-2" />
                        Modifier
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-1/2 py-3.5 px-4 rounded-xl flex items-center justify-center bg-neutral-700 hover:bg-neutral-800 text-white transition-colors shadow-md hover:shadow-lg"
                      >
                        <FiTrash2 className="mr-2" />
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={toggleCart}
                      className={`w-full py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
                        inCart
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <HiOutlineShoppingBag 
                        size={22} 
                        className="mr-2"
                      />
                      {inCart ? 'Retirer du panier' : 'Ajouter au panier'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne des commentaires (uniquement en mode normal) */}
          {!isAdmin && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
                  <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                  Avis & Commentaires
                </h2>
                <ProductComments productId={productId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;