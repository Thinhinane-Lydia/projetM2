

import React, { useState, useEffect } from "react";
import { fetchSizesBySubCategory } from "../../utils/api";
import { FiX, FiSearch, FiTag, FiDollarSign, FiSliders } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const FilterMenu = ({ activeCategory, activeSubCategory, applyFilters }) => {
  const [filters, setFilters] = useState({
    size: "",
    brand: "",
    material: "",
    color: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    maxRating: "",
  });

  const [sizes, setSizes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const brands = ["Zara", "Nike", "Adidas","H&M","Chanel","Gucci","Shein","Puma","New Balance","Levis","PULL&BEAR","stradivarius","Bershka","Primark","autre"];
  const materials = ["Coton","Lin","Laine","Soie","Polyester","Nylon","Cuir","Satin","Acier inoxydable","Jean","Autre"];
  const colors = ["blanc","noir","rouge","bleu","rose","marron","beige","vert","jaune","orange","violet","gris","melange de couleurs","autre"];
  const conditions = ["Neuf", "Bon état", "Usé"];
  const ratingOptions = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];

  useEffect(() => {
    if (activeSubCategory) {
      fetchSizesBySubCategory(activeSubCategory).then((data) => setSizes(data.sizes || []));
    }
  }, [activeSubCategory]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [key]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const removeFilter = (key) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [key]: "" };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      size: "",
      brand: "",
      material: "",
      color: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      maxRating: "",
    });
    applyFilters({});
  };

  if (!activeCategory || !activeSubCategory) return null;

  // Nombre de filtres actifs
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  // Formatter l'affichage des étoiles
  const renderStars = (rating) => {
    const ratingValue = parseFloat(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={
              i < Math.floor(ratingValue) 
              ? 'text-amber-500' 
              : i < Math.ceil(ratingValue) && ratingValue % 1 !== 0
                ? 'text-amber-500' 
                : 'text-amber-300'
            }
            size={16}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6 overflow-hidden">
      {/* Tabs de navigation */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex bg-amber-50 p-1 rounded-xl">
          <button 
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}
            onClick={() => setActiveTab('all')}
          >
            <FiSliders />
            <span>Tous</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <button 
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'specs' ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}
            onClick={() => setActiveTab('specs')}
          >
            <FiTag />
            <span>Caractéristiques</span>
          </button>
          
          <button 
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'price' ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}
            onClick={() => setActiveTab('price')}
          >
            <FiDollarSign />
            <span>Prix</span>
          </button>
          
          <button 
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'rating' ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}
            onClick={() => setActiveTab('rating')}
          >
            <FaStar />
            <span>Évaluations</span>
          </button>
        </div>
      </div>

      {/* Contenu des filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-100">
        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-amber-100">
            {Object.entries(filters).filter(([_, v]) => v !== "").map(([key, value]) => {
              let label = value;
              let bgColor = "bg-amber-50";
              let textColor = "text-amber-800";
              
              if (key === "size") {
                const sizeObj = sizes.find(s => s._id === value);
                label = sizeObj ? sizeObj.name : value;
              } else if (key === "minPrice") {
                label = `Min: ${value} DA`;
              } else if (key === "maxPrice") {
                label = `Max: ${value} DA`;
              } else if (key === "minRating") {
                label = `Min: ${value}★`;
              } else if (key === "maxRating") {
                label = `Max: ${value}★`;
              }
              
              return (
                <div 
                  key={key}
                  className={`${bgColor} ${textColor} px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center border border-amber-200`}
                >
                  <span>{label}</span>
                  <button 
                    onClick={() => removeFilter(key)}
                    className="ml-1.5 p-0.5 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              );
            })}
            
            <button 
              onClick={clearAllFilters}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1 ml-auto"
            >
              <FiX size={14} />
              <span>Effacer tout</span>
            </button>
          </div>
        )}

        {/* Tous les filtres / Onglet "Tous" */}
        {activeTab === "all" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Sélecteurs de filtres */}
            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("size", e.target.value)} 
                value={filters.size}
              >
                <option value="">Taille</option>
                {sizes.map((size) => (
                  <option key={size._id} value={size._id}>{size.name}</option>
                ))}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("color", e.target.value)} 
                value={filters.color}
              >
                <option value="">Couleur</option>
                {colors.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("brand", e.target.value)} 
                value={filters.brand}
              >
                <option value="">Marque</option>
                {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("material", e.target.value)} 
                value={filters.material}
              >
                <option value="">Matière</option>
                {materials.map((material) => <option key={material} value={material}>{material}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("condition", e.target.value)} 
                value={filters.condition}
              >
                <option value="">État</option>
                {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            {/* Filtre prix */}
            <div className="flex items-center space-x-1 p-2 bg-amber-50 rounded-lg col-span-1">
              <input
                type="number"
                className="w-full p-1 text-sm bg-transparent text-amber-800 placeholder-amber-400 focus:outline-none"
                placeholder="Min DA"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span className="text-amber-400">-</span>
              <input
                type="number"
                className="w-full p-1 text-sm bg-transparent text-amber-800 placeholder-amber-400 focus:outline-none"
                placeholder="Max DA"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
            
            {/* Filtre rating simplifié pour l'onglet "Tous" */}
            <div className="flex items-center space-x-1 p-2 bg-amber-50 rounded-lg col-span-1">
              <select
                className="w-full p-1 text-sm bg-transparent text-amber-800 placeholder-amber-400 focus:outline-none"
                value={filters.minRating}
                onChange={(e) => handleFilterChange("minRating", e.target.value)}
              >
                <option value="">Min ★</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>{rating}★</option>
                ))}
              </select>
              <span className="text-amber-400">-</span>
              <select
                className="w-full p-1 text-sm bg-transparent text-amber-800 placeholder-amber-400 focus:outline-none"
                value={filters.maxRating}
                onChange={(e) => handleFilterChange("maxRating", e.target.value)}
              >
                <option value="">Max ★</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>{rating}★</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Onglet Caractéristiques */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("size", e.target.value)} 
                value={filters.size}
              >
                <option value="">Taille</option>
                {sizes.map((size) => (
                  <option key={size._id} value={size._id}>{size.name}</option>
                ))}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("color", e.target.value)} 
                value={filters.color}
              >
                <option value="">Couleur</option>
                {colors.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("brand", e.target.value)} 
                value={filters.brand}
              >
                <option value="">Marque</option>
                {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("material", e.target.value)} 
                value={filters.material}
              >
                <option value="">Matière</option>
                {materials.map((material) => <option key={material} value={material}>{material}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none p-2.5 pl-3 bg-amber-50 rounded-lg text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors text-sm"
                onChange={(e) => handleFilterChange("condition", e.target.value)} 
                value={filters.condition}
              >
                <option value="">État</option>
                {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
              </select>
              <div className="absolute right-2 top-2.5 text-amber-500 pointer-events-none">▼</div>
            </div>
          </div>
        )}

        {/* Onglet Prix */}
        {activeTab === "price" && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-800 font-medium">Fourchette de prix</span>
              <span className="text-amber-600 text-sm">(en DA)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full p-3 rounded-lg bg-white text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors"
                  placeholder="Prix minimum"
                  min="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
              </div>
              <span className="text-amber-400 font-bold">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full p-3 rounded-lg bg-white text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors"
                  placeholder="Prix maximum"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Onglet Évaluations (nouvelle version simplifiée, similaire à Prix) */}
        {activeTab === "rating" && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-800 font-medium">Fourchette d'évaluations</span>
              <span className="text-amber-600 text-sm">(en étoiles)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <select
                    className="w-full p-3 pl-3 pr-8 rounded-lg bg-white text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors appearance-none"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange("minRating", e.target.value)}
                  >
                    <option value="">Évaluation minimum</option>
                    {ratingOptions.map((rating) => (
                      <option key={rating} value={rating}>{rating} ★</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                    <FaStar size={16} />
                  </div>
                </div>
              </div>
              <span className="text-amber-400 font-bold">—</span>
              <div className="flex-1">
                <div className="relative">
                  <select
                    className="w-full p-3 pl-3 pr-8 rounded-lg bg-white text-amber-800 border-2 border-transparent focus:border-amber-300 focus:outline-none transition-colors appearance-none"
                    value={filters.maxRating}
                    onChange={(e) => handleFilterChange("maxRating", e.target.value)}
                  >
                    <option value="">Évaluation maximum</option>
                    {ratingOptions.map((rating) => (
                      <option key={rating} value={rating}>{rating} ★</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                    <FaStar size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Affichage visuel des étoiles pour la sélection actuelle */}
            {(filters.minRating || filters.maxRating) && (
              <div className="mt-4 p-3 bg-white rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-800 font-medium">Sélection actuelle:</span>
                  <div className="flex items-center">
                    {filters.minRating && <span className="text-amber-600">{filters.minRating}★</span>}
                    {(filters.minRating && filters.maxRating) && <span className="mx-2 text-amber-400">—</span>}
                    {filters.maxRating && <span className="text-amber-600">{filters.maxRating}★</span>}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setFilters(prev => ({ ...prev, minRating: "", maxRating: "" }));
                    applyFilters({ ...filters, minRating: "", maxRating: "" });
                  }}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterMenu;