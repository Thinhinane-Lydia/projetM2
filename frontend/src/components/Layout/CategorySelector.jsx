
import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../utils/api";

const CategorySelector = ({ activeCategory, setActiveCategory, setActiveSubCategory, setIsVisible }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.categories);
    };
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      // Si on clique sur la même catégorie, on désactive tout
      setActiveCategory(null);
      // Réinitialiser la sous-catégorie
      if (typeof setActiveSubCategory === 'function') {
        setActiveSubCategory(null);
      }
      setIsVisible(false);
    } else {
      // Si on clique sur une nouvelle catégorie, on l'active
      setActiveCategory(categoryId);
      // Réinitialiser la sous-catégorie
      if (typeof setActiveSubCategory === 'function') {
        setActiveSubCategory(null);
      }
      setIsVisible(true);
    }
  };

  return (
    <div className="w-full bg-white py-4 border-t border-gray-100 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-6 px-4">
          {categories.map((category) => {
            const isSelected = activeCategory === category._id;
            return (
              <button
                key={category._id}
                className={`group flex flex-col items-center transition-all duration-300 ${
                  isSelected ? "transform scale-105" : "hover:scale-105"
                }`}
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="relative">
                  <div className={`p-0.5 rounded-full ${isSelected ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-transparent"}`}>
                    <div className={`w-16 h-16 rounded-full overflow-hidden ${
                      isSelected 
                        ? "ring-2 ring-amber-300 shadow-md" 
                        : "ring-1 ring-gray-200 group-hover:ring-amber-200"
                    } transition-all duration-300`}>
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full w-5 h-5 border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <span className={`text-sm font-medium mt-2 transition-colors duration-300 ${
                  isSelected ? "text-amber-700 font-semibold" : "text-gray-600 group-hover:text-amber-600"
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;