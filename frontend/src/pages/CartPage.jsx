 
// import React, { useEffect, useState } from "react";
// import { useCart } from "../components/cart/Cart";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Layout/Header";

// const CartPage = () => {
//   const { cart, removeFromCart, updateCartItemQuantity, fetchCart } = useCart();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCart, setFilteredCart] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     fetchCart();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Update filtered cart when cart or search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredCart(cart);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = cart.filter(item => {
//         const productName = item.product?.name?.toLowerCase() || "";
//         return productName.includes(lowercaseSearch);
//       });
//       setFilteredCart(filtered);
//     }
//   }, [cart, searchTerm]);

//   const handleRemove = async (itemId) => {
//     await removeFromCart(itemId);
//   };

//   const handleQuantityChange = async (cartItem, newQuantity) => {
//     if (newQuantity < 1) return;

//     try {
//       await updateCartItemQuantity(cartItem._id, newQuantity);
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de la quantité", error);
//     }
//   };

//   const handleCheckout = () => {
//     setIsProcessing(true);
//     setTimeout(() => {
//       navigate('/checkout');
//       setIsProcessing(false);
//     }, 800);
//   };

//   // Calculate total (only for filtered items)
//   const cartTotal = filteredCart.reduce((total, item) => 
//     total + (item.product?.price || 0) * item.quantity, 0
//   );

//   return (
//     <div className="min-h-screen bg-amber-50/20 pt-16">
//       <div className="pt-8 pb-6 bg-amber-50/50 shadow-sm">
//         <Header 
//           showCategories={false}
//           setSearchTerm={setSearchTerm}
//           activeCategory={activeCategory}
//           setActiveCategory={setActiveCategory}
//           setIsVisible={setIsVisible}
//         />
//       </div>

//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         <h2 className="text-3xl font-semibold text-[#5C4033] mb-8 flex items-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//           </svg>
//           Mon Panier
//         </h2>

//         {cart.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="flex flex-col items-center justify-center py-6">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               <p className="text-gray-500 text-lg mb-6">Votre panier est vide.</p>
//               <button 
//                 onClick={() => navigate('/')}
//                 className="bg-[#8B4513] hover:bg-[#7C3913] text-white px-8 py-3 rounded-md transition duration-300 font-medium flex items-center"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Continuer mes achats
//               </button>
//             </div>
//           </div>
//         ) : filteredCart.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <p className="text-gray-500 text-lg mb-4">Aucun produit ne correspond à votre recherche.</p>
//             <button 
//               onClick={() => setSearchTerm("")}
//               className="bg-[#8B4513] hover:bg-[#7C3913] text-white px-6 py-2 rounded-md transition duration-300"
//             >
//               Réinitialiser la recherche
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//                 {filteredCart.map((item, index) => (
//                   <div key={item._id || index} className={`p-6 ${index > 0 ? 'border-t border-gray-200' : ''} hover:bg-amber-50/30 transition-colors`}>
//                     <div className="flex flex-col md:flex-row items-start">
//                       <div className="w-full md:w-1/3 mb-4 md:mb-0 relative">
//                         {/* Badge "Nouveau" similaire à celui de la page Favoris */}
//                         {item.product?.isNew && (
//                           <div className="absolute top-2 left-2 bg-[#e67e22] text-white px-3 py-1 rounded-md text-xs font-bold">
//                             Nouveau
//                           </div>
//                         )}
//                         <img
//                           src={item.product?.images?.[0]?.url || "https://via.placeholder.com/250"}
//                           alt={item.product?.name}
//                           className="w-full h-auto object-cover rounded-lg shadow-sm"
//                         />
//                       </div>

//                       <div className="md:ml-8 flex-grow">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.product?.name}</h3>
//                         <p className="text-[#8B4513] font-bold text-2xl mb-6">{item.product?.price} DA</p>

//                         <div className="flex items-center mb-6">
//                           <button
//                             onClick={() => handleQuantityChange(item, item.quantity - 1)}
//                             className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-l-md transition-colors border border-gray-200"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                           <span className="px-6 py-2 bg-gray-50 text-center border-t border-b border-gray-200 font-medium">{item.quantity}</span>
//                           <button
//                             onClick={() => handleQuantityChange(item, item.quantity + 1)}
//                             className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-r-md transition-colors border border-gray-200"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                         </div>

//                         <button
//                           onClick={() => handleRemove(item._id)}
//                           className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-md flex items-center justify-center w-auto px-4 py-2 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                           </svg>
//                           Retirer du panier
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Résumé du panier - style carte fixe */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//                 <h3 className="text-2xl font-bold mb-6 text-[#5C4033] border-b border-gray-100 pb-4">Résumé</h3>
                
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between items-center text-gray-600">
//                     <span>Articles ({filteredCart.length})</span>
//                     <span>{cartTotal} DA</span>
//                   </div>
 
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-4 mb-6">
//                   <div className="flex justify-between items-center mb-6">
//                     <h4 className="text-xl font-bold">Total</h4>
//                     <p className="text-[#8B4513] font-bold text-2xl">{cartTotal} DA</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <button 
//                     onClick={handleCheckout}
//                     disabled={isProcessing}
//                     className={`w-full px-6 py-3 rounded-md transition-colors text-white text-center font-medium flex items-center justify-center ${
//                       isProcessing 
//                         ? 'bg-[#A05F2C] cursor-not-allowed' 
//                         : 'bg-[#8B4513] hover:bg-[#7C3913] active:bg-[#5F2913]'
//                     }`}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Traitement en cours...
//                       </>
//                     ) : (
//                       <>
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                         </svg>
//                         Passer la commande
//                       </>
//                     )}
//                   </button>
                  
//                   <button 
//                     onClick={() => navigate('/')}
//                     className="w-full px-6 py-3 rounded-md border border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors mb-4 flex items-center justify-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                     </svg>
//                     Continuer mes achats
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useCart } from "../components/cart/Cart";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";

const CartPage = () => {
  const { cart, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCart, setFilteredCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update filtered cart when cart or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCart(cart);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = cart.filter(item => {
        const productName = item.product?.name?.toLowerCase() || "";
        return productName.includes(lowercaseSearch);
      });
      setFilteredCart(filtered);
    }
  }, [cart, searchTerm]);

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/checkout');
      setIsProcessing(false);
    }, 800);
  };

  // Calculate total (only for filtered items)
  const cartTotal = filteredCart.reduce((total, item) => 
    total + (item.product?.price || 0), 0
  );
  
  // Calculate total items
  const totalItems = filteredCart.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100/40 to-white">
      <div className="sticky top-0 mb-12 z-10 bg-white shadow-md">
        <Header 
          showCategories={false}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setIsVisible={setIsVisible}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#5C4033] flex items-center animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Mon Panier
          </h2>
          {cart.length > 0 && (
            <span className="bg-[#8B4513] text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse-slow">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-500 hover:shadow-xl animate-fade-in">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-amber-50 p-6 rounded-full mb-6 animate-bounce-gentle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-8">Votre panier est vide.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-300 font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Continuer mes achats
              </button>
            </div>
          </div>
        ) : filteredCart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <p className="text-gray-600 text-lg mb-6">Aucun produit ne correspond à votre recherche.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-300 shadow-md transform hover:-translate-y-1"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Liste des produits - côté gauche */}
            <div className="lg:w-2/3">
              <div className="bg-amber-50/50 rounded-xl overflow-hidden p-4">
                {filteredCart.map((item, index) => (
                  <div 
                    key={item._id || index} 
                    className="bg-white rounded-lg shadow-sm mb-4 p-4 flex items-center transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 hover:bg-amber-50/30"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    {/* Image du produit */}
                    <div className="w-20 h-20 flex-shrink-0 mr-4 overflow-hidden rounded-lg border border-amber-100">
                      <img
                        src={item.product?.images?.[0]?.url || "https://via.placeholder.com/80"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    
                    {/* Informations du produit */}
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg text-gray-800">{item.product?.name}</h3>
                      <p className="text-[#8B4513] font-bold">{item.product?.price} DA</p>
                    </div>
                    
                    {/* Bouton supprimer */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="ml-4 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full transition-all duration-300 transform hover:rotate-12"
                      aria-label="Retirer l'article"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé du panier - côté droit */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 transition-all duration-300 hover:shadow-xl border-l-4 border-orange-500">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center">
                  <span className="relative">
                    Résumé
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400 transform scale-x-100 origin-left transition-transform duration-300"></span>
                  </span>
                </h3>
                
                {/* Liste des articles dans le résumé */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
                  {filteredCart.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-50 transition-all duration-300 hover:bg-amber-50/30 rounded px-2"
                    >
                      <span className="font-medium line-clamp-1 text-sm">{item.product?.name}</span>
                      <span className="font-medium text-sm">{item.product?.price} DA</span>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="border-t-2 border-dashed border-amber-200 pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-gray-800">Total</h4>
                    <p className="text-orange-500 font-bold text-xl animate-pulse-gentle">{cartTotal} DA</p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 text-white text-center font-medium flex items-center justify-center shadow-md transform hover:-translate-y-1 hover:shadow-lg ${
                      isProcessing 
                        ? 'bg-orange-500/80 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Passer la commande
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Continuer mes achats
                  </button>
                </div>
                
                {/* Section des avantages avec animation d'apparition */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 transition-all duration-300 hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">Livraison gratuite à partir de 5000 DA</span>
                    </div>
                    <div className="flex items-center text-gray-600 transition-all duration-300 hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center text-gray-600 transition-all duration-300 hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">Service client 7j/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Ajout des animations CSS personnalisées
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulseSlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes pulseGentle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  
  @keyframes bounceGentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .animate-pulse-slow {
    animation: pulseSlow 2s infinite;
  }
  
  .animate-pulse-gentle {
    animation: pulseGentle 2s infinite;
  }
  
  .animate-bounce-gentle {
    animation: bounceGentle 3s infinite;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  
  .scrollbar-thumb-amber-300::-webkit-scrollbar-thumb {
    background: #fcd34d;
    border-radius: 4px;
  }
  
  .scrollbar-track-amber-50::-webkit-scrollbar-track {
    background: #fffbeb;
  }
`;
document.head.appendChild(style);

export default CartPage;