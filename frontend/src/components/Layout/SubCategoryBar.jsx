import React from "react";
import { categoriesData } from "../../static/data";

const SubCategoryBar = ({ activeCategory, activeSubCategory, setActiveSubCategory }) => {
    if (!activeCategory) return null; // Ne rien afficher si aucune catégorie n'est sélectionnée

    const selectedCategory = categoriesData.find(cat => cat.id === activeCategory);

    return (
        <div className="w-full bg-[#EDEAE3] py-2 flex justify-center gap-5 overflow-x-auto border-b border-[#D6D1C8] shadow-sm">
            
            {/* ✅ Bouton "All" pour réinitialiser la sous-catégorie */}
            <button
                className={`text-sm px-5 py-2 uppercase tracking-wide cursor-pointer rounded-full transition-all duration-300 ease-in-out font-semibold 
                    ${
                        activeSubCategory === null 
                        ? "bg-[#B5AA9D] text-white shadow-md border border-[#9A9387] scale-105"
                        : "bg-[#E0DCD3] text-[#46413b] hover:bg-[#B5AA9D] hover:text-white hover:shadow-md hover:scale-105"
                    }`}
                onClick={() => setActiveSubCategory(null)}
            >
                All
            </button>

            {/* ✅ Affichage des sous-catégories */}
            {selectedCategory?.subCategories.map((sub) => (
                <button
                    key={sub.id}
                    className={`text-sm px-5 py-2 uppercase tracking-wide cursor-pointer rounded-full transition-all duration-300 ease-in-out font-semibold 
                        ${
                            activeSubCategory === sub.id 
                            ? "bg-[#706c64] text-white shadow-md border border-[#5a564f] scale-105"
                            : "bg-[#E0DCD3] text-[#46413b] hover:bg-[#B5AA9D] hover:text-white hover:shadow-md hover:scale-105"
                        }`}
                    onClick={() => setActiveSubCategory(sub.id)}
                >
                    {sub.title}
                </button>
            ))}
        </div>
    );
};

export default SubCategoryBar;
