
// import React, { useEffect, useState } from "react";
// import { fetchSubCategories } from "../../utils/api";

// const SubCategoryBar = ({ activeCategory, setActiveSubCategory }) => {
//   const [subCategories, setSubCategories] = useState([]);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (activeCategory) {
//       const getSubCategories = async () => {
//         const data = await fetchSubCategories(activeCategory);
//         setSubCategories(data.subCategories);
//         setIsVisible(true);
//       };
//       getSubCategories();
//     } else {
//       setSubCategories([]);
//       setIsVisible(false);
//     }
//   }, [activeCategory]);

//   if (!isVisible) return null;

//   return (
//     <div className="w-full bg-gray-200 py-5 flex justify-center gap-7 shadow-md">
//       {subCategories.map((sub) => (
//         <button
//           key={sub._id}
//           className="sub-category-button flex flex-col items-center transition-transform hover:scale-110"
//           onClick={() => setActiveSubCategory(sub._id)}
//         >
//           <img 
//             src={sub.image} 
//             alt={sub.name} 
//             className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl border border-gray-400 transition-all"
//           />
//           <span className="text-gray-700 text-xs mt-1 font-medium">{sub.name}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default SubCategoryBar;

import React, { useEffect, useState } from "react";
import { fetchSubCategories } from "../../utils/api";

const SubCategoryBar = ({ activeCategory, setActiveSubCategory, activeSubCategory }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeCategory) {
      const getSubCategories = async () => {
        const data = await fetchSubCategories(activeCategory);
        setSubCategories(data.subCategories);
        setIsVisible(true);
      };
      getSubCategories();
    } else {
      setSubCategories([]);
      setIsVisible(false);
    }
  }, [activeCategory]);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-neutral-200 py-5 flex justify-center gap-7 shadow-md">
      {subCategories.map((sub) => {
        const isSelected = activeSubCategory === sub._id;
        return (
          <button
            key={sub._id}
            className={`sub-category-button flex flex-col items-center transition-transform ${
              isSelected ? "scale-110" : "hover:scale-110"
            }`}
            onClick={() => setActiveSubCategory(sub._id)}
          >
            <div className={`relative ${isSelected ? "animate-pulse" : ""}`}>
              <img 
                src={sub.image} 
                alt={sub.name} 
                className={`w-12 h-12 rounded-full shadow-lg ${
                  isSelected 
                    ? "border-2 border-yellow-800 shadow-xl ring-2 ring-amber-700" 
                    : "border border-neutral-400 hover:shadow-xl"
                } transition-all`}
              />
              {isSelected && (
                <div className="absolute -bottom-1 -right-1 bg-amber-800 rounded-full w-4 h-4 border-2 border-white"></div>
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${
              isSelected ? "text-yellow-900 font-bold" : "text-neutral-800"
            }`}>
              {sub.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SubCategoryBar;