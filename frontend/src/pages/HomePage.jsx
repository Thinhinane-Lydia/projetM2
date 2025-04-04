

import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Layout/Header";
import ProductList from "../components/Product/ProductList";
import SubCategoryBar from "../components/Layout/SubCategoryBar";
import CategorySelector from "../components/Layout/CategorySelector";
import Footer from "../components/Layout/Footer";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const productListRef = useRef(null);

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