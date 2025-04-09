
import React, { useEffect, useState } from "react";
import { fetchSubCategories } from "../../utils/api";

const SubCategoryBar = ({ activeCategory, setActiveSubCategory, activeSubCategory }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeCategory) {
      const getSubCategories = async () => {
        try {
          const data = await fetchSubCategories(activeCategory);
          setSubCategories(data.subCategories);
          setIsVisible(true);
        } catch (error) {
          console.error("Erreur lors du chargement des sous-catégories:", error);
          setSubCategories([]);
          setIsVisible(false);
        }
      };
      getSubCategories();
      // Réinitialiser activeSubCategory quand activeCategory change
      setActiveSubCategory(null);
    } else {
      setSubCategories([]);
      setIsVisible(false);
    }
  }, [activeCategory, setActiveSubCategory]);

  if (!isVisible || subCategories.length === 0) return null;

  return (
    <div className="w-full bg-white py-4 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center flex-wrap gap-4">
          {subCategories.map((sub) => {
            const isSelected = activeSubCategory === sub._id;
            return (
              <button
                key={sub._id}
                className={`group flex flex-col items-center transition-all duration-300 mx-1 ${
                  isSelected ? "scale-105" : "hover:scale-105"
                }`}
                onClick={() => setActiveSubCategory(sub._id)}
              >
                <div className="relative">
                  <div className={`p-0.5 rounded-full mt-4 ${isSelected ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-transparent"}`}>
                    <div className={`w-14 h-14 rounded-full overflow-hidden ${
                      isSelected ? "ring-2 ring-amber-300" : "ring-1 ring-gray-200 group-hover:ring-amber-200"
                    } transition-all duration-300`}>
                      <img 
                        src={sub.image} 
                        alt={sub.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 "
                      />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full w-4 h-4 border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                  isSelected ? "text-amber-700 font-semibold" : "text-gray-600 group-hover:text-amber-600"
                }`}>
                  {sub.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryBar;