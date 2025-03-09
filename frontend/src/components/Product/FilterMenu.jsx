

// import React, { useState, useEffect } from "react";
// import { fetchSizesBySubCategory } from "../../utils/api";
// import { FiX } from "react-icons/fi";

// const FilterMenu = ({ activeCategory, activeSubCategory, applyFilters }) => {
//   const [filters, setFilters] = useState({
//     size: "",
//     brand: "",
//     material: "",
//     color: "",
//     condition: "",
//     price: [0, 50000], // 🔥 Ajout du filtre prix
//   });

//   const [sizes, setSizes] = useState([]);

//   const brands = ["Zara", "Nike", "Adidas", "H&M", "Chanel", "Gucci", "Shein", "Puma", "New Balance", "autre"];
//   const materials = ["Coton", "Lin", "Laine", "Soie", "Polyester", "Nylon", "Cuir", "Autre"];
//   const colors = ["Blanc", "Noir", "Rouge", "Bleu", "Rose", "Marron", "Beige", "Vert", "Jaune", "Orange", "Violet", "Autres"];
//   const conditions = ["Neuf", "Bon état", "Usé"];

//   useEffect(() => {
//     if (activeSubCategory) {
//       fetchSizesBySubCategory(activeSubCategory).then((data) => setSizes(data.sizes || []));
//     }
//   }, [activeSubCategory]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prevFilters) => {
//       const updatedFilters = { ...prevFilters, [key]: value };
//       applyFilters(updatedFilters);
//       return updatedFilters;
//     });
//   };

//   const handlePriceChange = (e) => {
//     const newPrice = [...filters.price];
//     newPrice[e.target.name === "min" ? 0 : 1] = Number(e.target.value);
//     setFilters((prevFilters) => {
//       const updatedFilters = { ...prevFilters, price: newPrice };
//       applyFilters(updatedFilters);
//       return updatedFilters;
//     });
//   };

//   const removeFilter = (key) => {
//     setFilters((prevFilters) => {
//       const updatedFilters = { ...prevFilters, [key]: "" };
//       applyFilters(updatedFilters);
//       return updatedFilters;
//     });
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       size: "",
//       brand: "",
//       material: "",
//       color: "",
//       condition: "",
//       price: [0, 50000], // Réinitialiser aussi le prix
//     });
//     applyFilters({});
//   };

//   if (!activeCategory || !activeSubCategory) return null;

//   const filterStyles = {
//     size: "bg-pink-100 border-pink-200 hover:bg-pink-200 shadow-sm",
//     brand: "bg-green-100 border-green-200 hover:bg-green-200 shadow-sm",
//     material: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200 shadow-sm",
//     color: "bg-blue-100 border-blue-200 hover:bg-blue-200 shadow-sm",
//     condition: "bg-purple-100 border-purple-200 hover:bg-purple-200 shadow-sm",
//   };

//   const selectClass = "px-4 py-3 rounded-full text-sm font-medium border transition-colors duration-200 focus:outline-none min-w-32";

//   return (
//     <div className="p-4 bg-white mb-6">
//       {/* Conteneur des filtres */}
//       <div className="flex flex-wrap gap-4 items-center">
//         {/* Sélecteurs */}
//         <select className={`${selectClass} ${filterStyles.size}`} onChange={(e) => handleFilterChange("size", e.target.value)} value={filters.size}>
//           <option value="">Taille</option>
//           {sizes.map((size) => (
//             <option key={size._id} value={size._id}>{size.name}</option>
//           ))}
//         </select>

//         <select className={`${selectClass} ${filterStyles.color}`} onChange={(e) => handleFilterChange("color", e.target.value)} value={filters.color}>
//           <option value="">Couleur</option>
//           {colors.map((color) => <option key={color} value={color}>{color}</option>)}
//         </select>

//         <select className={`${selectClass} ${filterStyles.brand}`} onChange={(e) => handleFilterChange("brand", e.target.value)} value={filters.brand}>
//           <option value="">Marque</option>
//           {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
//         </select>

//         <select className={`${selectClass} ${filterStyles.material}`} onChange={(e) => handleFilterChange("material", e.target.value)} value={filters.material}>
//           <option value="">Matière</option>
//           {materials.map((material) => <option key={material} value={material}>{material}</option>)}
//         </select>

//         <select className={`${selectClass} ${filterStyles.condition}`} onChange={(e) => handleFilterChange("condition", e.target.value)} value={filters.condition}>
//           <option value="">État</option>
//           {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
//         </select>

//         {/* Filtre Prix (Min - Max) */}
//         <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full shadow-sm border border-gray-200">
//           <input 
//             type="number" 
//             name="min" 
//             value={filters.price[0]} 
//             onChange={handlePriceChange} 
//             className="w-16 text-center border rounded-md px-2 bg-white" 
//           />
//           <span className="px-2">-</span>
//           <input 
//             type="number" 
//             name="max" 
//             value={filters.price[1]} 
//             onChange={handlePriceChange} 
//             className="w-16 text-center border rounded-md px-2 bg-white" 
//           />
//           <span className="ml-2">DA</span>
//         </div>

//         {/* Effacer les filtres */}
//         {Object.values(filters).some((value) => value) && (
//           <button onClick={clearAllFilters} className="text-red-500 hover:text-red-700 text-sm font-medium ml-auto">
//             Effacer les filtres
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterMenu;
import React, { useState, useEffect } from "react";
import { fetchSizesBySubCategory } from "../../utils/api";
import { FiX } from "react-icons/fi";

const FilterMenu = ({ activeCategory, activeSubCategory, applyFilters }) => {
  const [filters, setFilters] = useState({
    size: "",
    brand: "",
    material: "",
    color: "",
    condition: "",
    minPrice: "", // ✅ Ajout du prix min
    maxPrice: "", // ✅ Ajout du prix max
  });

  const [sizes, setSizes] = useState([]);

  const brands = ["Zara", "Nike", "Adidas", "H&M", "Chanel", "Gucci", "Shein", "Puma", "New Balance", "autre"];
  const materials = ["Coton", "Lin", "Laine", "Soie", "Polyester", "Nylon", "Cuir", "Autre"];
  const colors = ["blanc", "noir", "rouge", "bleu", "rose", "marron", "beige", "vert", "jaune", "orange", "violet", "autres"];
  const conditions = ["Neuf", "Bon état", "Usé"];

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
    });
    applyFilters({});
  };

  if (!activeCategory || !activeSubCategory) return null;

  const filterStyles = {
    size: "bg-pink-100 border-pink-200 hover:bg-pink-200 shadow-sm",
    brand: "bg-green-100 border-green-200 hover:bg-green-200 shadow-sm",
    material: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200 shadow-sm",
    color: "bg-blue-100 border-blue-200 hover:bg-blue-200 shadow-sm",
    condition: "bg-purple-100 border-purple-200 hover:bg-purple-200 shadow-sm",
  };

  const selectClass = "px-4 py-3 rounded-full text-sm font-medium border transition-colors duration-200 focus:outline-none min-w-32";

  return (
    <div className="p-4 bg-gray-50 shadow-lg mb-6" >
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sélecteurs */}
        <select className={`${selectClass} ${filterStyles.size}`} onChange={(e) => handleFilterChange("size", e.target.value)} value={filters.size}>
          <option value="">Taille</option>
          {sizes.map((size) => (
            <option key={size._id} value={size._id}>{size.name}</option>
          ))}
        </select>

        <select className={`${selectClass} ${filterStyles.color}`} onChange={(e) => handleFilterChange("color", e.target.value)} value={filters.color}>
          <option value="">Couleur</option>
          {colors.map((color) => <option key={color} value={color}>{color}</option>)}
        </select>

        <select className={`${selectClass} ${filterStyles.brand}`} onChange={(e) => handleFilterChange("brand", e.target.value)} value={filters.brand}>
          <option value="">Marque</option>
          {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
        </select>

        <select className={`${selectClass} ${filterStyles.material}`} onChange={(e) => handleFilterChange("material", e.target.value)} value={filters.material}>
          <option value="">Matière</option>
          {materials.map((material) => <option key={material} value={material}>{material}</option>)}
        </select>

        <select className={`${selectClass} ${filterStyles.condition}`} onChange={(e) => handleFilterChange("condition", e.target.value)} value={filters.condition}>
          <option value="">État</option>
          {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
        </select>

        {/* Filtre Prix */}
        <div className="flex items-center space-x-2  bg-lime-200 border-lime-900 hover:bg-lime-200 shadow-sm px-4 py-2 rounded-full">
          <input
            type="number"
            className="w-20 text-sm text-lime-950 focus:outline-none rounded-2xl"
            placeholder="Min"
            min="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            className="w-20 text-sm text-lime-950 focus:outline-1  rounded-2xl"
            placeholder="Max"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
          <span>DA</span>
        </div>

        {/* Effacer les filtres */}
        {Object.values(filters).some(value => value) && (
          <button onClick={clearAllFilters} className="text-red-500 hover:text-red-700 text-sm font-medium ml-auto">
            Effacer les filtres
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterMenu;
