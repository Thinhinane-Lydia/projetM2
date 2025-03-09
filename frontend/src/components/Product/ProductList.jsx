

// import { FiHeart, FiShoppingCart } from "react-icons/fi";
// import { fetchProducts } from "../../utils/api";
// import FilterMenu from "./FilterMenu";
// import React, { useState, useEffect } from "react";

// const ProductList = ({ searchTerm, activeCategory, activeSubCategory, isVisible }) => {
//   const [products, setProducts] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [filters, setFilters] = useState({});

//   useEffect(() => {
//     const getProducts = async () => {
//       const data = await fetchProducts();
//       setProducts(data.products);
//     };
//     getProducts();
//   }, []);

//   const toggleFavorite = (productId) => {
//     setFavorites((prev) =>
//       prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
//     );
//   };

//   const toggleCart = (productId) => {
//     setCart((prev) =>
//       prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
//     );
//   };

//   const applyFilters = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const filteredProducts = products.filter((product) =>
//     (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//     (!activeCategory || product.category._id === activeCategory) &&
//     (!activeSubCategory || product.subCategory._id === activeSubCategory) &&
//     (!filters.size || product.size?._id === filters.size) &&
//     (!filters.brand || product.brand === filters.brand) &&
//     (!filters.material || product.material === filters.material) &&
//     (!filters.color || product.color === filters.color) &&
//     (!filters.condition || product.condition === filters.condition) &&
//     (!filters.minPrice || product.price >= filters.minPrice) &&
//     (!filters.maxPrice || product.price <= filters.maxPrice)
//   );

//   // Fonction pour obtenir une couleur pastel basée sur l'ID du produit
//   const getProductColor = (productId) => {
//     const bgColors = [
//       "bg-pink-200", "bg-purple-200", "bg-blue-200", "bg-green-200",
//       "bg-yellow-200", "bg-orange-200", "bg-indigo-200", "bg-red-200"
//     ];
//     const borderColors = [
//       "border-pink-300", "border-purple-300", "border-blue-300", "border-green-300",
//       "border-yellow-300", "border-orange-300", "border-indigo-300", "border-red-300"
//     ];

//     // Utilise l'ID du produit pour obtenir un index cohérent
//     const index = productId.charCodeAt(0) % bgColors.length;

//     return {
//       bg: bgColors[index],
//       border: borderColors[index]
//     };
//   };

//   return (
//     <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-gray-100 shadow-sm`}>
//       {activeCategory && activeSubCategory && (
//         <div className="mb-6 pt-4">
//           <FilterMenu
//             activeCategory={activeCategory}
//             activeSubCategory={activeSubCategory}
//             applyFilters={applyFilters}
//           />
//         </div>
//       )}

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
//         {filteredProducts.length === 0 ? (
//           <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
//             <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
//             <p className="text-gray-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
//           </div>
//         ) : (
//           filteredProducts.map((product) => {
//             const colors = getProductColor(product._id);
//             return (
//               <div
//                 key={product._id}
//                 className={`relative bg-white p-4 rounded-xl shadow-md border-2 ${colors.border} transition duration-300 hover:shadow-lg transform hover:-translate-y-1`}
//               >
//                 <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
//                   <button
//                     onClick={() => toggleFavorite(product._id)}
//                     className="bg-white p-2 rounded-full shadow-sm focus:outline-none"
//                   >
//                     <FiHeart
//                       size={20}
//                       className={`transition duration-300 ${favorites.includes(product._id)
//                         ? "text-red-500 fill-red-500"
//                         : "text-red-500 hover:text-red-500"
//                         }`}
//                     />
//                   </button>
//                   <button
//                     onClick={() => toggleCart(product._id)}
//                     className="bg-white p-2 rounded-full shadow-sm focus:outline-none"
//                   >
//                     <FiShoppingCart
//                       size={20}
//                       className={`transition duration-300 ${cart.includes(product._id)
//                         ? "text-green-500 fill-green-500"
//                         : "text-green-500 hover:text-green-500"
//                         }`}
//                     />
//                   </button>
//                 </div>


//                 <div className={`w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mb-4`}>
//                   <img
//                     src={product.images[0]?.url || "https://via.placeholder.com/250"}
//                     alt={product.name}
//                     className="w-full h-full object-contain hover:scale-105 transition duration-300"
//                   />
//                 </div>

//                 <div className="mt-2 text-center">
//                   <h3 className="text-gray-800 font-semibold text-md truncate">{product.name}</h3>
//                   <p className="text-blue-500 font-bold text-lg mt-1">{product.price} DA</p>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

import { FiHeart } from "react-icons/fi";
import { fetchProducts } from "../../utils/api";
import FilterMenu from "./FilterMenu";
import React, { useState, useEffect } from "react";
import {HiOutlineShoppingBag} from "react-icons/hi"

const ProductList = ({ searchTerm, activeCategory, activeSubCategory, isVisible }) => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data.products);
    };
    getProducts();
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleCart = (productId) => {
    setCart((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = products.filter((product) =>
    (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!activeCategory || product.category._id === activeCategory) &&
    (!activeSubCategory || product.subCategory._id === activeSubCategory) &&
    (!filters.size || product.size?._id === filters.size) &&
    (!filters.brand || product.brand === filters.brand) &&
    (!filters.material || product.material === filters.material) &&
    (!filters.color || product.color === filters.color) &&
    (!filters.condition || product.condition === filters.condition) &&
    (!filters.minPrice || product.price >= filters.minPrice) &&
    (!filters.maxPrice || product.price <= filters.maxPrice)
  );

  // Modifier les couleurs pour utiliser des tons de ambre/jaune et des neutres
  const getProductColor = (productId) => {
    const bgColors = [
      "bg-amber-50", "bg-yellow-50", "bg-neutral-50", "bg-amber-100",
      "bg-yellow-100", "bg-orange-50", "bg-neutral-100", "bg-yellow-50"
    ];
    const borderColors = [
      "border-amber-300", "border-yellow-300", "border-amber-200", "border-yellow-200",
      "border-amber-300", "border-yellow-300", "border-amber-200", "border-neutral-300"
    ];

    // Utilise l'ID du produit pour obtenir un index cohérent
    const index = productId.charCodeAt(0) % bgColors.length;

    return {
      bg: bgColors[index],
      border: borderColors[index]
    };
  };

  return (
    <div className={`px-4 ${isVisible ? "mt-0" : "mt-4"} bg-neutral-100 shadow-sm`}>
      {activeCategory && activeSubCategory && (
        <div className="mb-6 pt-4">
          <FilterMenu
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            applyFilters={applyFilters}
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
            <p className="text-neutral-500 text-lg">Aucun produit trouvé.</p>
            <p className="text-neutral-400 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const colors = getProductColor(product._id);
            return (
              <div
                key={product._id}
                className={`relative bg-white p-4 rounded-xl shadow-md border-2 ${colors.border} transition duration-300 hover:shadow-lg transform hover:-translate-y-1`}
              >
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-shadow"
                  >
                    <FiHeart
                      size={20}
                      className={`transition duration-300 ${favorites.includes(product._id)
                        ? "text-red-800 fill-red-800"
                        : "text-red-800 hover:fill-red-700"
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => toggleCart(product._id)}
                    className="bg-white p-2 rounded-full shadow-sm focus:outline-none hover:shadow-md transition-shadow"
                  >
                    <HiOutlineShoppingBag
                      size={20}
                      className={`transition duration-300 ${cart.includes(product._id)
                        ? "text-green-600 fill-green-700"
                        : "text-green-600 hover:fill-green-700"
                        }`}
                    />
                  </button>
                </div>

                <div className={`w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mb-4 `}>
                  <img
                    src={product.images[0]?.url || "https://via.placeholder.com/250"}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-neutral-800 font-semibold text-md truncate">{product.name}</h3>
                  <p className="text-amber-800 font-bold text-lg mt-1">{product.price} DA</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;