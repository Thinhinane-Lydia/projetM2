// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Layout/Header";
// import ProductList from "../components/Product/ProductList";
// import SubCategoryBar from "../components/Layout/SubCategoryBar";
// import CategorySelector from "../components/Layout/CategorySelector";
// import Footer from "../components/Layout/Footer";
// import UserRecommendations from "../components/Product/UserRecommendations";
// import { fetchUser } from "../utils/api";

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSubCategory, setActiveSubCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const productListRef = useRef(null);
//   const navigate = useNavigate();

//   // Vérifier si l'utilisateur est admin et rediriger si nécessaire
//   useEffect(() => {
//     const checkUserRole = async () => {
//       try {
//         setLoading(true);
        
//         // Approche 1: Vérifier le localStorage (rapide mais moins sécurisé)
//         const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
        
//         if (userFromStorage.role === 'admin') {
//           navigate('/Admin');
//           return;
//         }
        
//         // Approche 2: Vérifier via l'API (plus sécurisé)
//         const userData = await fetchUser();
//         if (userData && userData.success && userData.user && userData.user.role === 'admin') {
//           navigate('/Admin');
//           return;
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error("Erreur lors de la vérification du rôle utilisateur:", error);
//         setLoading(false);
//       }
//     };
    
//     checkUserRole();
//   }, [navigate]);

//   // Observer les changements de catégorie pour rafraîchir les produits
//   useEffect(() => {
//     if (productListRef.current && productListRef.current.loadProducts) {
//       productListRef.current.loadProducts();
//     }
//   }, [activeCategory]);

//   // Fonction pour rafraîchir les produits
//   const refreshProducts = () => {
//     if (productListRef.current && productListRef.current.loadProducts) {
//       productListRef.current.loadProducts();
//     }
//   };

//   // Afficher un écran de chargement pendant la vérification
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="pt-[100px] flex flex-col items-center px-4 flex-grow">
//         <Header 
//           setSearchTerm={setSearchTerm}
//           setActiveCategory={setActiveCategory}
//           activeCategory={activeCategory}
//           setActiveSubCategory={setActiveSubCategory}
//           activeSubCategory={activeSubCategory}
//           setIsVisible={setIsVisible}
//           refreshProducts={refreshProducts}
//         />

//         <CategorySelector 
//           setActiveCategory={setActiveCategory}
//           activeCategory={activeCategory}
//           setActiveSubCategory={setActiveSubCategory}
//           setIsVisible={setIsVisible}
//         />

//         {isVisible && (
//           <SubCategoryBar 
//             activeCategory={activeCategory}
//             activeSubCategory={activeSubCategory}
//             setActiveSubCategory={setActiveSubCategory}
//           />
//         )}

//         {/*Section des recommandations avec titre et style distinctif */}
//         <div className="w-full max-w-7xl mt-8 mb-6 bg-amber-50 rounded-lg p-4 shadow-md">
//           <div className="flex items-center mb-4">
            
            
//           </div>
//           <div className="border-b border-amber-200 mb-4"></div>
//           <UserRecommendations />
//         </div>

//         {/* Section principale des produits avec titre */}
//         <div className="w-full max-w-7xl mt-4 mb-8">
//           <div className="flex items-center mb-4">
//             <h2 className="text-2xl font-semibold text-amber-800">Catalogue de produits</h2>
//             {activeCategory && (
//               <div className="ml-3 bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
//                 {activeCategory}{activeSubCategory ? ` › ${activeSubCategory}` : ''}
//               </div>
//             )}
//           </div>
//           <div className="border-b border-gray-200 mb-4"></div>
//           <ProductList
            
//             searchTerm={searchTerm}
//             activeCategory={activeCategory}
//             activeSubCategory={activeSubCategory}
//             isVisible={isVisible}
//           />
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import ProductList from "../components/Product/ProductList";
import SubCategoryBar from "../components/Layout/SubCategoryBar";
import CategorySelector from "../components/Layout/CategorySelector";
import Footer from "../components/Layout/Footer";

import { fetchUser } from "../utils/api";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const productListRef = useRef(null);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin et rediriger si nécessaire
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        
        // Approche 1: Vérifier le localStorage (rapide mais moins sécurisé)
        const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
        
        if (userFromStorage.role === 'admin') {
          navigate('/Admin');
          return;
        }
        
        // Approche 2: Vérifier via l'API (plus sécurisé)
        const userData = await fetchUser();
        if (userData && userData.success && userData.user && userData.user.role === 'admin') {
          navigate('/Admin');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle utilisateur:", error);
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, [navigate]);

  // Observer les changements de catégorie pour rafraîchir les produits
  useEffect(() => {
    if (productListRef.current && productListRef.current.loadProducts) {
      productListRef.current.loadProducts();
    }
  }, [activeCategory]);

  // Fonction pour rafraîchir les produits
  const refreshProducts = () => {
    if (productListRef.current && productListRef.current.loadProducts) {
      productListRef.current.loadProducts();
    }
  };

  // Afficher un écran de chargement pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-[100px] flex flex-col items-center px-4 flex-grow">
        <Header 
          setSearchTerm={setSearchTerm}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          setActiveSubCategory={setActiveSubCategory}
          activeSubCategory={activeSubCategory}
          setIsVisible={setIsVisible}
          showAdCarousel={true}
          refreshProducts={refreshProducts}
        />

        <CategorySelector 
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          setActiveSubCategory={setActiveSubCategory}
          setIsVisible={setIsVisible}
        />

        {isVisible && (
          <SubCategoryBar 
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={setActiveSubCategory}
          />
        )}

       

        {/* Section principale des produits avec titre */}
        <div className="w-full max-w-7xl  mb-8">
          <div className="flex items-center mb-4">
            
            {/* Suppression de l'affichage de la catégorie active ici */}
          </div>
          <div className="border-b border-gray-200 mb-2"></div>
          <ProductList
            
            searchTerm={searchTerm}
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            isVisible={isVisible}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;