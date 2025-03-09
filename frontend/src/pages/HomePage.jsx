
// // import React, { useState } from "react";
// // import Header from "../components/Layout/Header";
// // import ProductList from "../components/Product/ProductList";
// // import SubCategoryBar from "../components/Layout/SubCategoryBar";

// // const HomePage = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeCategory, setActiveCategory] = useState(null);
// //   const [activeSubCategory, setActiveSubCategory] = useState(null);
// //   const [isVisible, setIsVisible] = useState(false);

// //   return (
// //     <div className="pt-[100px] flex flex-col items-center px-4">
// //       <Header 
// //         setSearchTerm={setSearchTerm}
// //         setActiveCategory={setActiveCategory}
// //         activeCategory={activeCategory}
// //         setActiveSubCategory={setActiveSubCategory}
// //         activeSubCategory={activeSubCategory}
// //         setIsVisible={setIsVisible}
// //       />

// //       {/* ✅ Barre des sous-catégories */}
// //       {isVisible && (
// //         <SubCategoryBar 
// //           activeCategory={activeCategory}
// //           activeSubCategory={activeSubCategory}
// //           setActiveSubCategory={setActiveSubCategory}
// //           setIsVisible={setIsVisible}
// //         />
// //       )}

// //       {/* ✅ Liste des produits */}
// //       <div className={`mt-${isVisible ? "8" : "24"} w-full max-w-7xl`}>
// //         <ProductList
// //           searchTerm={searchTerm}
// //           activeCategory={activeCategory}
// //           activeSubCategory={activeSubCategory}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;
// // // import React, { useState } from "react";
// // // import Header from "../components/Layout/Header";
// // // import ProductList from "../components/Product/ProductList";
// // // import SubCategoryBar from "../components/Layout/SubCategoryBar";

// // // const HomePage = () => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [activeCategory, setActiveCategory] = useState(null);
// // //   const [activeSubCategory, setActiveSubCategory] = useState(null);
// // //   const [isVisible, setIsVisible] = useState(false);

// // //   return (
// // //     <div className="home-page">
// // //       <Header 
// // //         setSearchTerm={setSearchTerm}
// // //         setActiveCategory={setActiveCategory}
// // //         activeCategory={activeCategory}
// // //         setActiveSubCategory={setActiveSubCategory}
// // //         activeSubCategory={activeSubCategory}
// // //         setIsVisible={setIsVisible}
// // //       />

// // //       {activeCategory && (
// // //         <SubCategoryBar 
// // //           activeCategory={activeCategory}
// // //           activeSubCategory={activeSubCategory}
// // //           setActiveSubCategory={setActiveSubCategory}
// // //           isVisible={isVisible}
// // //           setIsVisible={setIsVisible}
// // //         />
// // //       )}

// // //       <div className="product-container">
// // //         <ProductList
// // //           searchTerm={searchTerm}
// // //           activeCategory={activeCategory}
// // //           activeSubCategory={activeSubCategory}
// // //           isVisible={isVisible}
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default HomePage;

// import React, { useState } from "react";
// import Header from "../components/Layout/Header";
// import ProductList from "../components/Product/ProductList";
// import SubCategoryBar from "../components/Layout/SubCategoryBar";
// import CategorySelector from "../components/Layout/CategorySelector";

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSubCategory, setActiveSubCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false); // ✅ Ajout de l'état de visibilité

//   return (
//     <div className="pt-[100px] flex flex-col items-center px-4">
//       <Header 
//         setSearchTerm={setSearchTerm}
//         setActiveCategory={setActiveCategory}
//         activeCategory={activeCategory}
//         setActiveSubCategory={setActiveSubCategory}
//         activeSubCategory={activeSubCategory}
//         setIsVisible={setIsVisible} // ✅ Transmis à Header
//       />

//       <CategorySelector 
//         setActiveCategory={setActiveCategory}
//         activeCategory={activeCategory}
//         setIsVisible={setIsVisible} // ✅ Transmis à CategorySelector
//       />

//       {isVisible && (
//         <SubCategoryBar 
//           activeCategory={activeCategory}
//           activeSubCategory={activeSubCategory}
//           setActiveSubCategory={setActiveSubCategory}
//         />
//       )}

//       <div className={`mt-${isVisible ? "10" : "32"} w-full max-w-7xl`}>
//         <ProductList
//           searchTerm={searchTerm}
//           activeCategory={activeCategory}
//           activeSubCategory={activeSubCategory}
//           isVisible={isVisible} // ✅ Envoyé à ProductList
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState } from "react";
import Header from "../components/Layout/Header";
import ProductList from "../components/Product/ProductList";
import SubCategoryBar from "../components/Layout/SubCategoryBar";
import CategorySelector from "../components/Layout/CategorySelector";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // ✅ Ajout de l'état

  return (
    <div className="pt-[100px] flex flex-col items-center px-4">
      <Header 
        setSearchTerm={setSearchTerm}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        setActiveSubCategory={setActiveSubCategory}
        activeSubCategory={activeSubCategory}
        setIsVisible={setIsVisible} // ✅ Envoyé à Header
      />

      <CategorySelector 
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        setIsVisible={setIsVisible} // ✅ Envoyé à CategorySelector
      />

      {isVisible && (
        <SubCategoryBar 
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          setActiveSubCategory={setActiveSubCategory}
        />
      )}

      <div className={`mt-${isVisible ? "2" : "8"} w-full max-w-7xl`}>
        <ProductList
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          isVisible={isVisible} // ✅ Envoyé à ProductList
        />
      </div>
    </div>
  );
};

export default HomePage;
