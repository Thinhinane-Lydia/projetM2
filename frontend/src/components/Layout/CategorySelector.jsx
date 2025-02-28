import React from "react";
import { categoriesData } from "../../static/data";

const CategorySelector = ({ activeCategory, setActiveCategory, setActiveSubCategory }) => {
    return (
        <div className="w-full bg-[#D9D5CD] py-3 flex justify-center gap-5 text-[14px] font-semibold uppercase tracking-wide shadow-sm border-b border-[#C1BEB8]">
            {categoriesData.map((category) => (
                <button
                    key={category.id}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer 
                        ${
                            activeCategory === category.id 
                                ? "bg-[#B5AA9D] text-white shadow-md transform scale-105 border border-[#9A9387]"
                                : "bg-[#E6E2DA] text-[#46413b] hover:bg-[#B5AA9D] hover:text-white hover:shadow-md hover:scale-105"
                        }`}
                    onClick={() => {
                        setActiveCategory(category.id);
                        setActiveSubCategory(null); // Réinitialiser la sous-catégorie
                    }}
                >
                    {category.title}
                </button>
            ))}
        </div>
    );
};

export default CategorySelector;
