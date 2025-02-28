// import React, { useEffect, useState } from "react";
// import { productData } from "../../static/data";
// import { FiHeart, FiShoppingCart } from "react-icons/fi";
// import FilterMenu from "./FilterMenu";

// const ProductList = ({ activeCategory, activeSubCategory, searchTerm }) => {
//     const [shuffledProducts, setShuffledProducts] = useState([]);
//     const [filters, setFilters] = useState({});

//     useEffect(() => {
//         const shuffled = [...productData].sort(() => Math.random() - 0.5);
//         setShuffledProducts(shuffled);
//     }, []);

//     const filteredProducts = shuffledProducts.filter((product) => 
//         (!activeCategory || product.categoryId === activeCategory) &&
//         (!activeSubCategory || product.subCategoryId === activeSubCategory) &&
//         (!filters.size || product.size === filters.size) &&
//         (!filters.brand || product.brand === filters.brand) &&
//         (!filters.condition || product.condition === filters.condition) &&
//         (!filters.material || product.material === filters.material) &&
//         (!filters.color || product.color === filters.color) &&
//         (!filters.minPrice || product.price >= filters.minPrice) &&
//         (!filters.maxPrice || product.price <= filters.maxPrice) &&
//         (!searchTerm || product.name.toLowerCase().includes(searchTerm))
//     );

//     return (
//         <div className="pt-24 w-full flex flex-col items-center justify-center py-10 px-6">
            
//             {/* ✅ Affichage du menu filtres UNIQUEMENT si une catégorie et sous-catégorie sont sélectionnées */}
//             {activeCategory && activeSubCategory && (
//                 <div className="w-full mt-4 px-6">
//                     <FilterMenu filters={filters} setFilters={setFilters} />
//                 </div>
//             )}

//             {/* ✅ Grille des produits */}
//             <div className="mt-6 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
//                 {filteredProducts.length === 0 ? (
//                     <p className="text-center text-gray-500 text-lg">
//                         Désolé, aucun produit ne correspond à votre sélection.
//                     </p>
//                 ) : (
//                     filteredProducts.map((product) => (
//                         <div 
//                             key={product.id} 
//                             className="relative bg-white p-4 shadow-md rounded-lg border border-gray-200 transition-transform transform hover:scale-105 duration-200"
//                         >
//                             {/* ✅ Icônes favoris et panier */}
//                             <div className="absolute top-2 right-2 flex flex-col space-y-2">
//                                 <button className="bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-green-100 transition-all duration-200">
//                                     <FiShoppingCart size={20} className="text-green-600" />
//                                 </button>
//                                 <button className="bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-red-100 transition-all duration-200">
//                                     <FiHeart size={20} className="text-red-500" />
//                                 </button>
//                             </div>

//                             {/* ✅ Image du produit agrandie */}
//                             <img 
//                                 src={product.image_Url[0].url} 
//                                 alt={product.name} 
//                                 className="w-full h-64 object-cover rounded-md"
//                             />

//                             {/* ✅ Nom et prix plus petits sur le côté */}
//                             <div className="flex justify-between items-center mt-3">
//                                 <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
//                                 <p className="text-sm font-semibold text-gray-700">{product.price} €</p>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProductList;
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ✅ Récupérer les produits dès le chargement du composant
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products); // Mettre à jour l'état avec les produits récupérés
      } catch (error) {
        console.error("Impossible de récupérer les produits :", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]?.url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price} €</p>
          </div>
        ))
      ) : (
        <p>Aucun produit disponible</p>
      )}
    </div>
  );
};

export default ProductList;
