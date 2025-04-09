
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Layout/Header";
// import ProductList from "../components/Product/ProductList";
// import SubCategoryBar from "../components/Layout/SubCategoryBar";
// import CategorySelector from "../components/Layout/CategorySelector";
// import Footer from "../components/Layout/Footer";

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSubCategory, setActiveSubCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const productListRef = useRef(null);
//   const navigate = useNavigate();

//   // Vérifier si l'utilisateur est admin et rediriger si nécessaire
//   useEffect(() => {
//     // Récupérer l'utilisateur depuis le localStorage ou un état global
//     const user = JSON.parse(localStorage.getItem('user')) || {};
    
//     // Si l'utilisateur est admin, rediriger vers le tableau de bord admin
//     if (user.role === 'admin') {
//       navigate('/admin');
//     }
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

//         <div className={`mt-${isVisible ? "8" : "6"} w-full max-w-7xl`}>
//           <ProductList
//             ref={productListRef}
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
import { fetchUser } from "../utils/api"; // Assurez-vous que le chemin est correct

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

        <div className={`mt-${isVisible ? "8" : "6"} w-full max-w-7xl`}>
          <ProductList
            ref={productListRef}
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