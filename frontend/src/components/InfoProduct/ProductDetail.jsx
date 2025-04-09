
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
// import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import ProductComments from "./ProductComments";
// import Popup from "../Popup/Popup";
 
// const ProductDetail = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();

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
     
//     // Ici, vous pourriez rediriger vers une page de messagerie ou ouvrir une boîte de dialogue
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
//       navigate("/Profil"); // Redirige vers la page de la boutique
//     } else {
//       alert("Erreur lors de la suppression du produit !");
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
//             Retour aux produits
//           </button>
//         </div>

//         {/* Nouvelle mise en page: deux colonnes côte à côte pour le produit et les commentaires */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale: infos produit (occupe 2/3 sur grand écran) */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full">
//               {/* Section principale - Photos et infos produit */}
//               <div className="md:flex flex-col">
//                 {/* En-tête avec titre et bouton favoris */}
//                 <div className="px-8 pt-8 pb-2 flex justify-between items-start">
//                   <div>
//                     <h1 className="text-3xl font-bold text-neutral-800 mb-2">{product.name}</h1>
                    
//                   </div>
//                   <button
//                     onClick={toggleFavorite}
//                     className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 group"
//                     aria-label="Ajouter aux favoris"
//                   >
//                     <FiHeart
//                       size={24}
//                       className={`transition duration-300 ${
//                         isFavorite 
//                           ? 'text-red-500 fill-red-500' 
//                           : 'text-neutral-400 group-hover:text-red-500'
//                       }`}
//                     />
//                   </button>
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
//                     {!isOwner && product.seller && (
//                       <button
//                         onClick={handleContactSeller}
//                         className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors flex items-center shadow-sm"
//                       >
//                         <FiMessageCircle className="mr-2" />
//                         Contacter le vendeur
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Boutons d'action */}
//                 <div className="mt-8 px-8 pb-8">
//                   {isOwner ? (
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

//           {/* Colonne des commentaires (occupe 1/3 sur grand écran) */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full p-6">
//               <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
//                 <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
//                 Avis & Commentaires
//               </h2>
//               <ProductComments productId={productId} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, fetchUser, deleteProduct } from "../../utils/api";
import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiMessageCircle } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import ProductComments from "./ProductComments";
import Popup from "../Popup/Popup";
import { useCart } from "../../components/cart/Cart";
import axios from "axios";

 

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

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

    const response = await deleteProduct(productId);
    if (response.success) {
      navigate("/Profil"); // Redirige vers la page de la boutique
    } else {
      alert("Erreur lors de la suppression du produit !");
    }
  };

  // Fonction pour modifier le produit
  const handleEdit = () => {
    navigate(`/Sell/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error || !product) {
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

        {/* Nouvelle mise en page: deux colonnes côte à côte pour le produit et les commentaires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale: infos produit (occupe 2/3 sur grand écran) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full">
              {/* Section principale - Photos et infos produit */}
              <div className="md:flex flex-col">
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

          {/* Colonne des commentaires (occupe 1/3 sur grand écran) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
                <span className="w-1.5 h-5 bg-amber-500 rounded-sm mr-2"></span>
                Avis & Commentaires
              </h2>
              <ProductComments productId={productId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;