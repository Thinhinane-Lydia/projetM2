

// import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Icônes
// import { FiHeart } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { FaComment, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// // Hooks et Utilitaires
// import { useCart } from "../../components/cart/Cart";
// import { 
//   fetchProducts, 
//   fetchProductRating, 
//   fetchCommentsByProduct, 
//   fetchUser 
// } from "../../utils/api";

// // Composants
// import FilterMenu from "./FilterMenu";
// =======
// import { FiHeart } from "react-icons/fi";
// import { fetchProducts, fetchProductsByCategory, fetchCommentsByProduct, sendMessage, addToCart, removeFromCart } from "../../utils/api";
// import FilterMenu from "./FilterMenu";
// import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
// import { HiOutlineShoppingCart, HiShoppingCart } from 'react-icons/hi';
// import { FaComment, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
// import { useCart } from "../../components/cart/Cart";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf

// const ProductList = forwardRef(({ searchTerm, activeCategory, activeSubCategory, isVisible }, ref) => {
//   const [products, setProducts] = useState([]);
//   const [productsWithRatings, setProductsWithRatings] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [commentCounts, setCommentCounts] = useState({});
//   const [ratings, setRatings] = useState({});
// <<<<<<< HEAD
//   const [currentUser, setCurrentUser] = useState(null);

// =======
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//   const cartContext = useCart();
//   const navigate = useNavigate();

//   if (!cartContext) {
//     console.error("❌ useCart() est `undefined`. Assurez-vous d'envelopper votre application avec `<CartProvider>`.");
//   }
  
// <<<<<<< HEAD
//   const { addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart } = 
//     cartContext || { cart: [], addToCart: () => {}, removeFromCart: () => {} };

//   // Calculer la moyenne des ratings
//   const calculateAverageRating = (comments) => {
//     if (!comments || comments.length === 0) return 0;
    
//     const validRatings = comments.filter(comment => 
//       comment.rating !== null && 
//       comment.rating !== undefined && 
//       !isNaN(comment.rating)
// =======
//   const { addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart, cart: contextCart } = cartContext || { cart: [], addToCart: () => {}, removeFromCart: () => {} };
  
//   // État pour suivre les produits ajoutés au panier
//   const [addedToCart, setAddedToCart] = useState({});

//   // useEffect(() => {
//   //   if (contextCart && contextCart.length > 0) {
//   //     const cartState = {};
//   //     contextCart.forEach(item => {
//   //       if (item.product && item.product._id) {
//   //         cartState[item.product._id] = true;
//   //       }
//   //     });
//   //     setAddedToCart(cartState);
//   //   }
//   // }, [contextCart]);

//   // Au début de votre composant, initialisez addedToCart avec les produits déjà dans le panier
// useEffect(() => {
//   const initialCartState = {};
//   contextCart.forEach(item => {
//     if (item.product?._id) {
//       initialCartState[item.product._id] = true;
//     }
//   });
//   setAddedToCart(initialCartState);
// }, [contextCart]); // Dépendance à contextCart pour réagir aux changements
  
//   // Fonction pour calculer la moyenne des ratings
//   const calculateAverageRating = (comments) => {
//     if (!comments || comments.length === 0) return 0;
    
//     // Filtrer les commentaires qui ont une note valide (non null/undefined)
//     const validRatings = comments.filter(comment => 
//       comment.rating !== null && comment.rating !== undefined && !isNaN(comment.rating)
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//     );
    
//     if (validRatings.length === 0) return 0;
    
// <<<<<<< HEAD
//     const totalRating = validRatings.reduce(
//       (acc, comment) => acc + parseFloat(comment.rating), 
//       0
//     );
//     return totalRating / validRatings.length;
//   };

//   // Charger les produits
// =======
//     const totalRating = validRatings.reduce((acc, comment) => acc + parseFloat(comment.rating), 0);
//     return totalRating / validRatings.length;
//   };

//   // Fonction pour charger les produits - extraite pour pouvoir l'appeler depuis d'autres composants
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//   const loadProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await fetchProducts();
//       setProducts(data.products);
      
// <<<<<<< HEAD
// =======
//       // Récupérer le nombre de commentaires et la moyenne des ratings pour chaque produit
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//       const commentsData = {};
//       const ratingsData = {};
      
//       await Promise.all(
//         data.products.map(async (product) => {
//           try {
//             const comments = await fetchCommentsByProduct(product._id);
//             commentsData[product._id] = comments.length;
// <<<<<<< HEAD
// =======
            
//             // Calculer la moyenne des ratings
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//             ratingsData[product._id] = calculateAverageRating(comments);
//           } catch (error) {
//             console.error(`Erreur lors de la récupération des commentaires pour ${product._id}:`, error);
//             commentsData[product._id] = 0;
//             ratingsData[product._id] = 0;
//           }
//         })
//       );
      
//       setCommentCounts(commentsData);
//       setRatings(ratingsData);
      
// <<<<<<< HEAD
// =======
//       // Associer les ratings aux produits
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//       const productsWithRatingsData = data.products.map(product => ({
//         ...product,
//         rating: ratingsData[product._id] || 0,
//         ratingCount: commentsData[product._id] || 0
//       }));
      
//       setProductsWithRatings(productsWithRatingsData);
//     } catch (error) {
//       console.error("Erreur lors du chargement des produits:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

// <<<<<<< HEAD
//   // Exposer loadProducts via la ref
// =======
//   // Exposer la fonction loadProducts via la ref
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//   useImperativeHandle(ref, () => ({
//     loadProducts
//   }));

// <<<<<<< HEAD
//   // Charger l'utilisateur connecté
//   useEffect(() => {
//     const loadCurrentUser = async () => {
//       try {
//         const userData = await fetchUser();
//         if (userData.success) {
//           setCurrentUser(userData.user);
//         }
//       } catch (error) {
//         console.error("Erreur lors du chargement de l'utilisateur:", error);
//       }
//     };

//     loadCurrentUser();
//   }, []);

//   // Charger tous les produits et favoris
//   useEffect(() => {
//     loadProducts();
    
// =======
//   // Charger tous les produits au montage du composant
//   useEffect(() => {
//     loadProducts();
    
//     // Charger les favoris existants
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//     const loadFavorites = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const response = await axios.get("http://localhost:8000/api/v2/favorites", {
// <<<<<<< HEAD
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data.success && response.data.data) {
//           const favoriteIds = response.data.data
//             .filter(fav => fav && fav.product)
// =======
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         if (response.data.success && response.data.data) {
//           // Vérifiez que chaque favori et sa propriété product existent avant d'accéder à _id
//           const favoriteIds = response.data.data
//             .filter(fav => fav && fav.product) // Filtrer les objets null ou sans produit
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//             .map(fav => fav.product._id);
//           setFavorites(favoriteIds);
//         }
//       } catch (error) {
//         console.error("❌ Erreur lors du chargement des favoris:", error.response?.data || error);
//       }
//     };

//     loadFavorites();
//   }, [loadProducts]);

// <<<<<<< HEAD
//   // Réinitialiser les filtres lors du changement de catégorie
// =======
//   // Initialiser l'état addedToCart en fonction du contexte du panier
//   useEffect(() => {
//     if (contextCart && contextCart.length > 0) {
//       const cartState = {};
//       contextCart.forEach(item => {
//         if (item.product && item.product._id) {
//           cartState[item.product._id] = true;
//         }
//       });
//       setAddedToCart(cartState);
//     }
//   }, [contextCart]);

//   // Réinitialiser les filtres quand on change de catégorie
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//   useEffect(() => {
//     setFilters({});
//   }, [activeCategory]);

// <<<<<<< HEAD
//   // Gestion des favoris
//   const toggleFavorite = async (e, product) => {
//     e.stopPropagation();
    
//     // Vérifier si le produit appartient à l'utilisateur connecté
//     if (currentUser && product.seller?._id === currentUser._id) {
//       toast.error("Vous ne pouvez pas ajouter votre propre article aux favoris.");
//       return;
//     }

// =======
//   const toggleFavorite = async (e, productId) => {
//     e.stopPropagation(); // Empêcher la navigation lors du clic sur le bouton favori
    
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("❌ Aucun token trouvé !");
//         return;
//       }

// <<<<<<< HEAD
//       if (favorites.includes(product._id)) {
//         // Supprimer des favoris
//         await axios.delete(`http://localhost:8000/api/v2/favorites/${product._id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setFavorites(prev => prev.filter(id => id !== product._id));
//         toast.success("Produit retiré des favoris");
//       } else {
//         // Ajouter aux favoris
//         await axios.post("http://localhost:8000/api/v2/favorites",
//           { productId: product._id },
//           { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//         );

//         setFavorites(prev => [...prev, product._id]);
//         toast.success("Produit ajouté aux favoris");
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors de la gestion des favoris :", error.response?.data || error);
//       toast.error("Erreur lors de la gestion des favoris");
//     }
//   };

//   // Gestion du panier
//   const handleCartClick = async (e, product) => {
//     e.stopPropagation();
    
//     // Vérifier si le produit appartient à l'utilisateur connecté
//     if (currentUser && product.seller?._id === currentUser._id) {
//       toast.error("Vous ne pouvez pas ajouter votre propre article au panier.");
//       return;
//     }

//     try {
//       const cartItem = cart.find(item => item.product?._id === product._id);
      
//       if (cartItem) {
//         await contextRemoveFromCart(cartItem._id);
//         toast.success("Produit retiré du panier");
//       } else {
//         await contextAddToCart(product._id, 1);
//         toast.success("Produit ajouté au panier");
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors de l'ajout/suppression du panier", error);
//       toast.error("Erreur lors de la gestion du panier");
//     }
//   };

// =======
//       if (favorites.includes(productId)) {
//         // Supprimer des favoris
//         await axios.delete(`http://localhost:8000/api/v2/favorites/${productId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setFavorites(prev => prev.filter(id => id !== productId));
//         console.log("✅ Produit retiré des favoris");
//       } else {
//         // Ajouter aux favoris
//         await axios.post("http://localhost:8000/api/v2/favorites",
//           { productId },
//           { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//         );

//         setFavorites(prev => [...prev, productId]);
//         console.log("✅ Produit ajouté aux favoris");
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors de la gestion des favoris :", error.response?.data || error);
//     }
//   };

//   const handleCartClick = async (e, productId) => {
//     e.stopPropagation();  // Empêche la propagation de l'événement
    
//     try {
//       // Mise à jour optimiste - mettre à jour l'interface immédiatement
//       const isProductInCart = addedToCart[productId];
      
//       // Mettre à jour l'état local immédiatement pour une réponse visuelle instantanée
//       setAddedToCart(prev => ({...prev, [productId]: !isProductInCart}));
      
//       if (isProductInCart) {
//         // Si l'article est déjà dans le panier, on le supprime
//         const cartItem = contextCart.find(item => item.product?._id === productId);
//         if (cartItem) {
//           await contextRemoveFromCart(cartItem._id);
//         }
//       } else {
//         // Sinon, on l'ajoute au panier
//         await contextAddToCart(productId, 1);
//       }
//     } catch (error) {
//       // En cas d'erreur, revenir à l'état précédent
//       console.error("❌ Erreur lors de la gestion du panier :", error);
//       setAddedToCart(prev => ({...prev, [productId]: !prev[productId]}));
//     }
//   };

//   const applyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//   // Navigation vers la page de détail du produit
//   const handleProductClick = (productId) => {
//     navigate(`/InfoProduct/${productId}`);
//   };

// <<<<<<< HEAD
//   // Contacter le vendeur
//   const handleContactSeller = async (sellerId, productId) => {
//     if (!sellerId || !productId) {
//       console.error("❌ Erreur: sellerId ou productId est manquant !");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/v2/conversations/start", 
//         { userId: sellerId },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );

//       if (response.data.success) {
//         navigate(`/messages/${response.data.conversationId}`);
//       } else {
//         console.error("❌ Erreur lors de la création de la conversation:", response.data.message);
//         toast.error("Impossible de démarrer la conversation");
//       }
//     } catch (error) {
//       console.error("❌ Erreur API contact vendeur :", error.response?.data || error);
//       toast.error("Erreur lors du contact du vendeur");
//     }
//   };

//   // Composant pour afficher les étoiles de notation
//   const RatingStars = ({ rating }) => {
//     const ratingValue = parseFloat(rating) || 0;
//     const roundedRating = Math.round(ratingValue * 2) / 2;
    
//     const fullStars = Math.max(0, Math.floor(roundedRating));
//     const hasHalfStar = roundedRating % 1 !== 0;
//     const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
// =======
//   // Filtrer les produits en fonction des critères actifs
//   const filteredProducts = productsWithRatings.filter((product) => {
//     // Vérification de base pour les filtres de texte et de catégories
//     const matchesBasicCriteria = 
//       (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (!activeCategory || product.category?._id === activeCategory) &&
//       (!activeSubCategory || product.subCategory?._id === activeSubCategory) &&
//       (!filters.size || product.size?._id === filters.size) &&
//       (!filters.brand || product.brand === filters.brand) &&
//       (!filters.material || product.material === filters.material) &&
//       (!filters.color || product.color === filters.color) &&
//       (!filters.condition || product.condition === filters.condition) &&
//       (!filters.minPrice || product.price >= filters.minPrice) &&
//       (!filters.maxPrice || product.price <= filters.maxPrice);
    
//     // Vérification pour le rating minimal et maximal
//     const ratingValue = product.rating || 0;
//     const matchesMinRating = !filters.minRating || ratingValue >= parseFloat(filters.minRating);
//     const matchesMaxRating = !filters.maxRating || ratingValue <= parseFloat(filters.maxRating);
    
//     return matchesBasicCriteria && matchesMinRating && matchesMaxRating;
//   });

//   const RatingStars = ({ rating }) => {
//     // S'assurer que le rating est un nombre valide
//     const ratingValue = parseFloat(rating) || 0;
    
//     // Arrondir à la demi-étoile la plus proche
//     const roundedRating = Math.round(ratingValue * 2) / 2;
    
//     // Calculer le nombre d'étoiles pleines et vides, en garantissant des valeurs non négatives
//     const fullStars = Math.max(0, Math.floor(roundedRating));
//     const hasHalfStar = roundedRating % 1 !== 0;
    
//     // Pour les étoiles vides, s'assurer qu'il y en a au minimum 0
//     const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
//     // Sécuriser la création des tableaux avec des vérifications
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//     const fullStarsArray = fullStars > 0 ? Array(fullStars).fill(null) : [];
//     const emptyStarsArray = emptyStars > 0 ? Array(emptyStars).fill(null) : [];
    
//     return (
//       <div className="flex items-center">
//         {fullStarsArray.map((_, i) => (
//           <FaStar key={`full-${i}`} className="text-amber-500 text-sm" />
//         ))}
//         {hasHalfStar && <FaStarHalfAlt key="half" className="text-amber-500 text-sm" />}
//         {emptyStarsArray.map((_, i) => (
//           <FaRegStar key={`empty-${i}`} className="text-amber-300 text-sm" />
//         ))}
// <<<<<<< HEAD
//       </div>
//     );
//   };

//   // Appliquer les filtres
//   const applyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

//   // Filtrer les produits
//   const filteredProducts = productsWithRatings.filter((product) => {
//     // Exclure les produits du vendeur connecté
//     const isNotSellerProduct = !currentUser || product.seller?._id !== currentUser._id;

//     const matchesBasicCriteria = 
//       isNotSellerProduct && 
//       (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (!activeCategory || product.category?._id === activeCategory) &&
//       (!activeSubCategory || product.subCategory?._id === activeSubCategory) &&
//       (!filters.size || product.size?._id === filters.size) &&
//       (!filters.brand || product.brand === filters.brand) &&
//       (!filters.material || product.material === filters.material) &&
//       (!filters.color || product.color === filters.color) &&
//       (!filters.condition || product.condition === filters.condition) &&
//       (!filters.minPrice || product.price >= filters.minPrice) &&
//       (!filters.maxPrice || product.price <= filters.maxPrice);
    
//     const ratingValue = product.rating || 0;
//     const matchesMinRating = !filters.minRating || ratingValue >= parseFloat(filters.minRating);
//     const matchesMaxRating = !filters.maxRating || ratingValue <= parseFloat(filters.maxRating);
    
//     return matchesBasicCriteria && matchesMinRating && matchesMaxRating;
//   });

//   // Méthode pour obtenir les couleurs du produit
//   const getProductColor = (productId) => {
//     const bgColors = [
//       "bg-amber-50", "bg-yellow-50", "bg-neutral-50", "bg-amber-100",
//       "bg-yellow-100", "bg-orange-50", "bg-neutral-100", "bg-yellow-50"
//     ];
//     const borderColors = [
//       "border-amber-300", "border-yellow-300", "border-amber-200", "border-yellow-200",
//       "border-amber-300", "border-yellow-300", "border-amber-200", "border-neutral-300"
//     ];

//     const index = productId.charCodeAt(0) % bgColors.length;

//     return {
//       bg: bgColors[index],
//       border: borderColors[index]
//     };
//   };

//   // Rendu du composant
//   if (loading) {
//     return (
//       <div className="px-4 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-white shadow-sm`}>
//       {/* Filtres */}
// =======
//       </div>
//     );
//   };

//   // Modifier les couleurs pour utiliser des tons de ambre/jaune et des neutres
//   const getProductColor = (productId) => {
//     const bgColors = [
//       "bg-amber-50", "bg-yellow-50", "bg-neutral-50", "bg-amber-100",
//       "bg-yellow-100", "bg-orange-50", "bg-neutral-100", "bg-yellow-50"
//     ];
//     const borderColors = [
//       "border-amber-300", "border-yellow-300", "border-amber-200", "border-yellow-200",
//       "border-amber-300", "border-yellow-300", "border-amber-200", "border-neutral-300"
//     ];

//     // Utilise l'ID du produit pour obtenir un index cohérent
//     const index = productId.charCodeAt(0) % bgColors.length;

//     return {
//       bg: bgColors[index],
//       border: borderColors[index]
//     };
//   };

//   if (loading) {
//     return (
//       <div className="px-4 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-white shadow-sm`}>
//       {/* Afficher les filtres uniquement si une sous-catégorie est sélectionnée */}
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//       {activeCategory && activeSubCategory && (
//         <div className="mb-4 pt-4">
//           <FilterMenu
//             activeCategory={activeCategory}
//             activeSubCategory={activeSubCategory}
//             applyFilters={applyFilters}
//           />
//         </div>
//       )}

// <<<<<<< HEAD
//       {/* Liste des produits */}
// =======
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
//         {filteredProducts.length === 0 ? (
//           <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
//             <p className="text-neutral-500 text-lg">Aucun produit trouvé.</p>
//             <p className="text-neutral-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
//           </div>
//         ) : (
//           filteredProducts.map((product) => {
//             const colors = getProductColor(product._id);
//             const commentCount = commentCounts[product._id] || 0;
//             const productRating = product.rating || 0;
// <<<<<<< HEAD
//             const isInCart = cart.some(item => item.product?._id === product._id);
// =======
//             const isInCart = addedToCart[product._id] || false;
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
            
//             return (
//               <div
//                 key={product._id}
//                 className={`relative bg-white p-4 rounded-xl shadow-sm border-2 ${colors.border} transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}
//                 onClick={() => handleProductClick(product._id)}
//               >
//                 <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
//                   <button
// <<<<<<< HEAD
//                     onClick={(e) => toggleFavorite(e, product)}
// =======
//                     onClick={(e) => toggleFavorite(e, product._id)}
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//                     className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-shadow"
//                   >
//                     <FiHeart
//                       size={20}
// <<<<<<< HEAD
//                       className={`transition duration-300 ${
//                         favorites.includes(product._id)
//                           ? "text-red-800 fill-red-800"
//                           : "text-red-800 hover:fill-red-700"
//                       }`}
//                     />
//                   </button>
//                   <button
//                     onClick={(e) => handleCartClick(e, product)}
//                     className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-all duration-300 active:bg-green-50"
//                   >
//                     <HiOutlineShoppingBag
//                       size={20}
//                       className={`transition duration-300 ${
//                         isInCart
//                           ? "text-green-600 fill-green-600"
//                           : "text-gray-600 hover:text-green-600 active:text-green-600 active:fill-green-600"
//                       }`}
//                     />
//                   </button>
                  
//                   {product.seller && (
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleContactSeller(product.seller._id, product._id);
//                       }}
//                       className="bg-blue-600 text-white p-2 mt-2 rounded hover:bg-blue-700 transition"
//                     >
//                       Contacter le vendeur
//                     </button>
//                   )}
// =======
//                       className={`transition duration-300 ${favorites.includes(product._id)
//                         ? "text-red-800 fill-red-800"
//                         : "text-red-800 hover:fill-red-700"
//                         }`}
//                     />
//                   </button>
                  
//                  {/* Bouton panier modernisé */}
//                  {/* <button
//                     onClick={(e) => handleCartClick(e, product._id)}
//                     className={`p-2 rounded-full shadow-sm focus:outline-none transition-all duration-300
//                       ${isInCart 
//                         ? 'bg-white-500 text-amber-500 scale-110 hover:bg-amber-600'
//                          : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
//                     aria-label={isInCart ? "Retirer du panier" : "Ajouter au panier"}
//                   >
//                     {isInCart ? (
//                       <HiShoppingBag size={20} className="text-white" />
//                     ) : (
//                       <HiOutlineShoppingBag size={20} className="text-neutral-700" />
//                     )}

                  
//                   </button> */}

//                   {/* Cart button styled similarly to heart button */}
// {/* Cart button styled similarly to heart button */}
// <button
//   onClick={(e) => handleCartClick(e, product._id)}
//   className={`bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-all duration-300
//     ${addedToCart[product._id] 
//       ? 'text-amber-500 scale-110'
//       : 'text-gray-500' }`}
//   aria-label={addedToCart[product._id] ? "Retirer du panier" : "Ajouter au panier"}
// >
//   {addedToCart[product._id] ? (
//     <HiShoppingCart className="h-5 w-5" />
//   ) : (
//     <HiOutlineShoppingCart className="h-5 w-5" />
//   )}
// </button>
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//                 </div>

//                 <div className={`w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mb-4`}>
//                   <img
//                     src={
//                       product.images && product.images[0]?.url?.startsWith("http")
//                         ? product.images[0].url
//                         : product.images && product.images[0]?.url
//                         ? `http://localhost:8000/${product.images[0].url}`
//                         : "https://via.placeholder.com/400x300?text=Pas+d'image"
//                     }
//                     alt={product.name}
//                     className="w-full h-full object-contain hover:scale-105 transition duration-300"
//                   />
//                 </div>

//                 <div className="mt-2 text-center">
// <<<<<<< HEAD
//                   <h3 className="text-neutral-800 font-semibold text-md truncate">
//                     {product.name}
//                   </h3>
//                   <p className="text-amber-800 font-bold text-lg mt-1">
//                     {product.price} DA
//                   </p>
                  
//                   <div className="flex flex-col items-center justify-center mt-2">
// =======
//                   <h3 className="text-neutral-800 font-semibold text-md truncate">{product.name}</h3>
//                   <p className="text-amber-800 font-bold text-lg mt-1">{product.price} DA</p>
                  
//                   {/* Affichage des étoiles et du nombre d'avis */}
//                   <div className="flex flex-col items-center justify-center mt-2">
//                     {/* Affichage des étoiles pour tous les produits */}
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//                     <div className="flex items-center justify-center">
//                       <RatingStars rating={productRating} />
//                       <span className="ml-2 text-sm text-neutral-700">
//                         {productRating.toFixed(1)}
//                       </span>
//                     </div>
                    
// <<<<<<< HEAD
// =======
//                     {/* Nombre de commentaires */}
// >>>>>>> 3c860a8d24917de7fd8b7fd592c1f3ee23a2cfdf
//                     <div className="flex items-center justify-center mt-1 text-neutral-600">
//                       <FaComment className="mr-1 text-amber-600" size={14} />
//                       <span className="text-sm">{commentCount} avis</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// });

// export default ProductList;

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Icônes
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingCart, HiShoppingCart } from 'react-icons/hi';
import { FaComment, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// Hooks et Utilitaires
import { useCart } from "../../components/cart/Cart";
import { 
  fetchProducts, 
  fetchProductRating, 
  fetchCommentsByProduct, 
  fetchUser 
} from "../../utils/api";

// Composants
import FilterMenu from "./FilterMenu";

const ProductList = forwardRef(({ searchTerm, activeCategory, activeSubCategory, isVisible }, ref) => {
  const [products, setProducts] = useState([]);
  const [productsWithRatings, setProductsWithRatings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [ratings, setRatings] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});

  const cartContext = useCart();
  const navigate = useNavigate();

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

  // Charger les produits
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products);
      
      const commentsData = {};
      const ratingsData = {};
      
      await Promise.all(
        data.products.map(async (product) => {
          try {
            const comments = await fetchCommentsByProduct(product._id);
            commentsData[product._id] = comments.length;
            ratingsData[product._id] = calculateAverageRating(comments);
          } catch (error) {
            console.error(`Erreur lors de la récupération des commentaires pour ${product._id}:`, error);
            commentsData[product._id] = 0;
            ratingsData[product._id] = 0;
          }
        })
      );
      
      setCommentCounts(commentsData);
      setRatings(ratingsData);
      
      const productsWithRatingsData = data.products.map(product => ({
        ...product,
        rating: ratingsData[product._id] || 0,
        ratingCount: commentsData[product._id] || 0
      }));
      
      setProductsWithRatings(productsWithRatingsData);
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

  // Réinitialiser les filtres lors du changement de catégorie
  useEffect(() => {
    setFilters({});
  }, [activeCategory]);

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
      // Mise à jour optimiste - mettre à jour l'interface immédiatement
      const isProductInCart = addedToCart[productId];
      
      // Mettre à jour l'état local immédiatement pour une réponse visuelle instantanée
      setAddedToCart(prev => ({...prev, [productId]: !isProductInCart}));
      
      if (isProductInCart) {
        // Si l'article est déjà dans le panier, on le supprime
        const cartItem = contextCart.find(item => item.product?._id === productId);
        if (cartItem) {
          await contextRemoveFromCart(cartItem._id);
          toast.success("Produit retiré du panier");
        }
      } else {
        // Sinon, on l'ajoute au panier
        await contextAddToCart(productId, 1);
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
          <FaStar key={`full-${i}`} className="text-amber-500 text-sm" />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" className="text-amber-500 text-sm" />}
        {emptyStarsArray.map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-amber-300 text-sm" />
        ))}
      </div>
    );
  };

  // Appliquer les filtres
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrer les produits
  const filteredProducts = productsWithRatings.filter((product) => {
    // Exclure les produits du vendeur connecté
    const isNotSellerProduct = !currentUser || product.seller?._id !== currentUser._id;

    const matchesBasicCriteria = 
      isNotSellerProduct && 
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

  // Méthode pour obtenir les couleurs du produit
  const getProductColor = (productId) => {
    const bgColors = [
      "bg-amber-50", "bg-yellow-50", "bg-neutral-50", "bg-amber-100",
      "bg-yellow-100", "bg-orange-50", "bg-neutral-100", "bg-yellow-50"
    ];
    const borderColors = [
      "border-amber-300", "border-yellow-300", "border-amber-200", "border-yellow-200",
      "border-amber-300", "border-yellow-300", "border-amber-200", "border-neutral-300"
    ];

    const index = productId.charCodeAt(0) % bgColors.length;

    return {
      bg: bgColors[index],
      border: borderColors[index]
    };
  };

  // Rendu du composant
  if (loading) {
    return (
      <div className="px-4 flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-white shadow-sm`}>
      {/* Filtres */}
      {activeCategory && activeSubCategory && (
        <div className="mb-4 pt-4">
          <FilterMenu
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            applyFilters={applyFilters}
          />
        </div>
      )}

      {/* Liste des produits */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
            <p className="text-neutral-500 text-lg">Aucun produit trouvé.</p>
            <p className="text-neutral-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const colors = getProductColor(product._id);
            const commentCount = commentCounts[product._id] || 0;
            const productRating = product.rating || 0;
            const isInCart = addedToCart[product._id] || false;
            
            return (
              <div
                key={product._id}
                className={`relative bg-white p-4 rounded-xl shadow-sm border-2 ${colors.border} transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}
                onClick={() => handleProductClick(product._id)}
              >
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={(e) => toggleFavorite(e, product._id)}
                    className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-shadow"
                  >
                    <FiHeart
                      size={20}
                      className={`transition duration-300 ${
                        favorites.includes(product._id)
                          ? "text-red-800 fill-red-800"
                          : "text-red-800 hover:fill-red-700"
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleCartClick(e, product._id)}
                    className={`bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-all duration-300
                      ${isInCart 
                        ? 'text-amber-500 scale-110'
                        : 'text-gray-500' }`}
                    aria-label={isInCart ? "Retirer du panier" : "Ajouter au panier"}
                  >
                    {isInCart ? (
                      <HiShoppingCart className="h-5 w-5" />
                    ) : (
                      <HiOutlineShoppingCart className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className={`w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mb-4`}>
                  <img
                    src={
                      product.images && product.images[0]?.url?.startsWith("http")
                        ? product.images[0].url
                        : product.images && product.images[0]?.url
                        ? `http://localhost:8000/${product.images[0].url}`
                        : "https://via.placeholder.com/400x300?text=Pas+d'image"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-neutral-800 font-semibold text-md truncate">
                    {product.name}
                  </h3>
                  <p className="text-amber-800 font-bold text-lg mt-1">
                    {product.price} DA
                  </p>
                  
                  <div className="flex flex-col items-center justify-center mt-2">
                    <div className="flex items-center justify-center">
                      <RatingStars rating={productRating} />
                      <span className="ml-2 text-sm text-neutral-700">
                        {productRating.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center mt-1 text-neutral-600">
                      <FaComment className="mr-1 text-amber-600" size={14} />
                      <span className="text-sm">{commentCount} avis</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default ProductList;