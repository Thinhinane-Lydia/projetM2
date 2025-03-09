
// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { fetchCategories } from "../../utils/api";

// // // // // // const CategorySelector = ({ activeCategory, setActiveCategory, setActiveSubCategory }) => {
// // // // // //   const [categories, setCategories] = useState([]);
// // // // // //   const [loading, setLoading] = useState(true);

// // // // // //   useEffect(() => {
// // // // // //     fetchCategories().then(setCategories).finally(() => setLoading(false));
// // // // // //   }, []);

// // // // // //   const handleCategoryClick = (categoryId) => {
// // // // // //     if (activeCategory === categoryId) {
// // // // // //       setActiveCategory(null);
// // // // // //       setActiveSubCategory(null);
// // // // // //     } else {
// // // // // //       setActiveCategory(categoryId);
// // // // // //       setActiveSubCategory(null);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="w-full bg-gray-100 py-1 flex justify-center gap-6 text-sm font-semibold uppercase shadow-sm border-b">
// // // // // //       {categories.map((category) => (
// // // // // //         <button
// // // // // //           key={category._id}
// // // // // //           className={`flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
// // // // // //             activeCategory === category._id ? "text-blue-500" : "text-gray-700"
// // // // // //           }`}
// // // // // //           onClick={() => handleCategoryClick(category._id)}
// // // // // //         >
// // // // // //           <img src={category.image} alt={category.name} className="w-12 h-12 rounded-full border border-gray-300 shadow-sm  hover:border-rose-950" />
// // // // // //           <span>{category.name}</span>
// // // // // //         </button>
// // // // // //       ))}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default CategorySelector;
// // // // // import React, { useEffect, useState } from "react";
// // // // // import { fetchCategories } from "../../utils/api";

// // // // // const CategorySelector = ({ activeCategory, setActiveCategory, setActiveSubCategory }) => {
// // // // //   const [categories, setCategories] = useState([]);

// // // // //   useEffect(() => {
// // // // //     const loadCategories = async () => {
// // // // //       try {
// // // // //         const data = await fetchCategories();
// // // // //         setCategories(data.categories);
// // // // //       } catch (error) {
// // // // //         console.error("Erreur lors du chargement des catégories :", error);
// // // // //       }
// // // // //     };
// // // // //     loadCategories();
// // // // //   }, []);

// // // // //   const handleCategoryClick = (categoryId) => {
// // // // //     if (activeCategory === categoryId) {
// // // // //       setActiveCategory(null);
// // // // //       setActiveSubCategory(null);
// // // // //     } else {
// // // // //       setActiveCategory(categoryId);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="flex justify-center space-x-4 mt-6">
// // // // //       {categories.map((category) => (
// // // // //         <button
// // // // //           key={category._id}
// // // // //           onClick={() => handleCategoryClick(category._id)}
// // // // //           className={`flex flex-col items-center transition-all transform hover:scale-110 ${
// // // // //             activeCategory === category._id ? "border-b-4 border-blue-500" : ""
// // // // //           }`}
// // // // //         >
// // // // //           <img
// // // // //             src={category.image}
// // // // //             alt={category.name}
// // // // //             className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
// // // // //           />
// // // // //           <span className="mt-2 text-sm font-semibold">{category.name}</span>
// // // // //         </button>
// // // // //       ))}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CategorySelector;
// // // // import React, { useEffect, useState } from "react";
// // // // import { fetchCategories } from "../../utils/api";

// // // // const CategorySelector = ({ setActiveCategory, activeCategory, setIsVisible }) => {
// // // //   const [categories, setCategories] = useState([]);

// // // //   useEffect(() => {
// // // //     const loadCategories = async () => {
// // // //       try {
// // // //         const data = await fetchCategories();
// // // //         setCategories(data.categories);
// // // //       } catch (error) {
// // // //         console.error("Erreur lors du chargement des catégories :", error);
// // // //       }
// // // //     };
// // // //     loadCategories();
// // // //   }, []);

// // // //   const handleCategoryClick = (categoryId) => {
// // // //     if (activeCategory === categoryId) {
// // // //       setActiveCategory(null);
// // // //       setIsVisible(false); // ✅ Masquer la barre des sous-catégories
// // // //     } else {
// // // //       setActiveCategory(categoryId);
// // // //       setIsVisible(true); // ✅ Afficher la barre des sous-catégories
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="flex justify-center space-x-4 py-3 bg-gray-200 shadow-md">
// // // //       {categories.map((category) => (
// // // //         <button
// // // //           key={category._id}
// // // //           onClick={() => handleCategoryClick(category._id)}
// // // //           className={`flex flex-col items-center transition-transform hover:scale-110 ${
// // // //             activeCategory === category._id ? "border-b-4 border-blue-500" : ""
// // // //           }`}
// // // //         >
// // // //           <img
// // // //             src={category.image}
// // // //             alt={category.name}
// // // //             className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
// // // //           />
// // // //           <span className="mt-2 text-xs font-semibold">{category.name}</span>
// // // //         </button>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CategorySelector;
// // // import React, { useEffect, useState } from "react";
// // // import { fetchCategories } from "../../utils/api";

// // // const CategorySelector = ({ setActiveCategory, activeCategory, setIsVisible }) => {
// // //   const [categories, setCategories] = useState([]);

// // //   useEffect(() => {
// // //     const loadCategories = async () => {
// // //       try {
// // //         const data = await fetchCategories();
// // //         setCategories(data.categories);
// // //       } catch (error) {
// // //         console.error("Erreur lors du chargement des catégories :", error);
// // //       }
// // //     };
// // //     loadCategories();
// // //   }, []);

// // //   const handleCategoryClick = (categoryId) => {
// // //     if (activeCategory === categoryId) {
// // //       setActiveCategory(null);
// // //       setIsVisible(false); // ✅ Masquer la barre des sous-catégories
// // //     } else {
// // //       setActiveCategory(categoryId);
// // //       setIsVisible(true); // ✅ Afficher la barre des sous-catégories
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex justify-center space-x-4 py-3 bg-gray-200 shadow-md">
// // //       {categories.map((category) => (
// // //         <button
// // //           key={category._id}
// // //           onClick={() => handleCategoryClick(category._id)}
// // //           className={`flex flex-col items-center transition-transform hover:scale-110 ${
// // //             activeCategory === category._id ? "border-b-4 border-blue-500" : ""
// // //           }`}
// // //         >
// // //           <img
// // //             src={category.image}
// // //             alt={category.name}
// // //             className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
// // //           />
// // //           <span className="mt-2 text-xs font-semibold">{category.name}</span>
// // //         </button>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default CategorySelector;
// // import React, { useEffect, useState } from "react";
// // import { fetchCategories } from "../../utils/api";

// // const CategorySelector = ({ activeCategory, setActiveCategory, setIsVisible }) => {
// //   const [categories, setCategories] = useState([]);

// //   useEffect(() => {
// //     const getCategories = async () => {
// //       const data = await fetchCategories();
// //       setCategories(data.categories);
// //     };
// //     getCategories();
// //   }, []);

// //   const handleCategoryClick = (categoryId) => {
// //     if (activeCategory === categoryId) {
// //       setActiveCategory(null);
// //       setIsVisible(false);
// //     } else {
// //       setActiveCategory(categoryId);
// //       setIsVisible(true);
// //     }
// //   };

// //   return (
// //     <div className="w-full bg-gray-200 py-2 flex justify-center gap-4">
// //       {categories.map((category) => (
// //         <button
// //           key={category._id}
// //           className={`category-button ${activeCategory === category._id ? "bg-gray-50" : "bg-gray-50"}`}
// //           onClick={() => handleCategoryClick(category._id)}
// //         >
// //           <img src={category.image} alt={category.name} className="w-12 h-12 rounded-full border shadow-md" />
// //           <span className="text-gray-700 text-sm font-medium">{category.name}</span>
// //         </button>
// //       ))}
// //     </div>
// //   );
// // };

// // export default CategorySelector;
// import React, { useEffect, useState } from "react";
// import { fetchCategories } from "../../utils/api";

// const CategorySelector = ({ activeCategory, setActiveCategory, setIsVisible }) => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const getCategories = async () => {
//       const data = await fetchCategories();
//       setCategories(data.categories);
//     };
//     getCategories();
//   }, []);

//   const handleCategoryClick = (categoryId) => {
//     if (activeCategory === categoryId) {
//       setActiveCategory(null);
//       setIsVisible(false);
//     } else {
//       setActiveCategory(categoryId);
//       setIsVisible(true);
//     }
//   };

//   return (
//     <div className="w-full bg-gray-200 py-2 flex justify-center gap-4">
//       {categories.map((category) => (
//         <button
//           key={category._id}
//           className={`category-button flex flex-col items-center transition-transform hover:scale-110 ${
//             activeCategory === category._id ? "border-b-4 border-gray-700" : ""
//           }`}
//           onClick={() => handleCategoryClick(category._id)}
//         >
//           <img 
//             src={category.image} 
//             alt={category.name} 
//             className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-md" 
//           />
//           <span className="text-gray-700 text-sm font-medium mt-2">{category.name}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default CategorySelector;
import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../utils/api";

const CategorySelector = ({ activeCategory, setActiveCategory, setIsVisible }) => {
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
      setActiveCategory(null);
      setIsVisible(false);
    } else {
      setActiveCategory(categoryId);
      setIsVisible(true);
    }
  };

  return (
    <div className="w-full bg-neutral-100 py-2 flex justify-center gap-4">
      {categories.map((category) => {
        const isSelected = activeCategory === category._id;
        return (
          <button
            key={category._id}
            className={`category-button flex flex-col items-center transition-transform ${
              isSelected ? "scale-110" : "hover:scale-110"
            }`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className={`relative ${isSelected ? "animate-pulse" : ""}`}>
              <img 
                src={category.image} 
                alt={category.name} 
                className={`w-16 h-16 rounded-full shadow-md ${
                  isSelected 
                    ? "border-2 border-yellow-800 shadow-xl ring-2 ring-amber-700" 
                    : "border-2 border-neutral-300 hover:shadow-lg"
                } transition-all`}
              />
              {isSelected && (
                <div className="absolute -bottom-1 -right-1 bg-amber-800 rounded-full w-5 h-5 border-2 border-white"></div>
              )}
            </div>
            <span className={`text-sm mt-2 font-medium ${
              isSelected ? "text-yellow-900 font-bold" : "text-neutral-800"
            }`}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;