

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import Header from "../components/Layout/Header";
// import ProductList from "../components/Product/ProductList";
// import SellForm from "../components/Sell/SellForm";

// const HomePage = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { categoryId, subCategoryId } = useParams();

//     // États pour gérer les catégories et la vente
//     const [activeCategory, setActiveCategory] = useState(categoryId || null);
//     const [activeSubCategory, setActiveSubCategory] = useState(subCategoryId || null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isSelling, setIsSelling] = useState(location.pathname === "/vendre");

//     // Mettre à jour l'affichage en fonction de l'URL
//     useEffect(() => {
//         if (location.pathname === "/vendre") {
//             setIsSelling(true); // ✅ Activer la vente si on est sur "/vendre"
//         } else {
//             setIsSelling(false);
//         }

//         if (activeCategory || activeSubCategory) {
//             setIsSelling(false); // ✅ Désactiver la vente si on choisit une catégorie
//         }
//     }, [location.pathname, activeCategory, activeSubCategory]);

//     return (
//         <div className="pt-32">
//             <Header 
//                 activeCategory={activeCategory} 
//                 setActiveCategory={(id) => {
//                     setActiveCategory(id);
//                     setIsSelling(false); // ✅ Désactiver la vente si on sélectionne une catégorie
//                     navigate(`/categorie/${id}`);
//                 }}
//                 activeSubCategory={activeSubCategory} 
//                 setActiveSubCategory={(id) => {
//                     setActiveSubCategory(id);
//                     setIsSelling(false); // ✅ Désactiver la vente si on sélectionne une sous-catégorie
//                     navigate(`/categorie/${activeCategory}/sous-categorie/${id}`);
//                 }}
//                 searchTerm={searchTerm} 
//                 setSearchTerm={setSearchTerm}
//                 isSelling={isSelling}
//                 setIsSelling={setIsSelling}
//             />

//             {/* ✅ Affichage dynamique du formulaire ou des produits */}
//             {isSelling ? (
//                 <SellForm onSubmit={(data) => console.log("Article soumis :", data)} />
//             ) : (
//                 <ProductList 
//                     activeCategory={activeCategory} 
//                     activeSubCategory={activeSubCategory}  
//                     searchTerm={searchTerm}
//                 />
//             )}
//         </div>
//     );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../components/Layout/Header";
import ProductList from "../components/Product/ProductList";
import SellForm from "../components/Sell/SellForm";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categoryId, subCategoryId } = useParams();

    // États pour gérer les catégories et la vente
    const [activeCategory, setActiveCategory] = useState(categoryId || null);
    const [activeSubCategory, setActiveSubCategory] = useState(subCategoryId || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSelling, setIsSelling] = useState(location.pathname === "/vendre");

    // Mettre à jour l'affichage en fonction de l'URL
    useEffect(() => {
        if (location.pathname === "/vendre") {
            setIsSelling(true); // ✅ Activer la vente si on est sur "/vendre"
        } else {
            setIsSelling(false);
        }

        if (activeCategory || activeSubCategory) {
            setIsSelling(false); // ✅ Désactiver la vente si on choisit une catégorie
        }
    }, [location.pathname, activeCategory, activeSubCategory]);

    return (
        <div className="pt-32">
            <Header 
                activeCategory={activeCategory} 
                setActiveCategory={(id) => {
                    setActiveCategory(id);
                    setIsSelling(false); // ✅ Désactive la vente quand on sélectionne une catégorie
                    navigate(`/categorie/${id}`);
                }}
                activeSubCategory={activeSubCategory} 
                setActiveSubCategory={(id) => {
                    setActiveSubCategory(id);
                    setIsSelling(false); // ✅ Désactive la vente quand on sélectionne une sous-catégorie
                    navigate(`/categorie/${activeCategory}/sous-categorie/${id}`);
                }}
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                isSelling={isSelling}
                setIsSelling={setIsSelling}
            />

            {/* ✅ Affichage dynamique du formulaire ou des produits */}
            {isSelling ? (
                <SellForm onSubmit={(data) => console.log("Article soumis :", data)} />
            ) : (
                <ProductList 
                    activeCategory={activeCategory} 
                    activeSubCategory={activeSubCategory}  
                    searchTerm={searchTerm}
                />
            )}
        </div>
    );
};

export default HomePage;
