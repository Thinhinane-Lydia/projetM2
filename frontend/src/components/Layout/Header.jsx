import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import logo from "../../Assests/logo.png";
import CategorySelector from "./CategorySelector";
import SubCategoryBar from "./SubCategoryBar";
import { productData } from "../../static/data"; 

const Header = ({ activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory, searchTerm, setSearchTerm, isSelling, setIsSelling }) => {
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        const results = productData.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm]);

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
                
                {/* ✅ Logo - Retour à l'accueil */}
                <Link to="/" className="flex items-center" onClick={() => {
                    setActiveCategory(null);
                    setActiveSubCategory(null);
                    setIsSelling(false);
                    navigate("/");
                }}>
                    <img src={logo} alt="logo" className="w-24 h-auto" />
                </Link>

                {/* ✅ Barre de recherche */}
                <div className="relative w-[55%] max-w-[650px] flex items-center border border-gray-300 rounded-full bg-gray-100">
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 w-full px-4 text-sm bg-transparent outline-none"
                    />
                    <AiOutlineSearch size={20} className="absolute right-4 text-gray-500 cursor-pointer" />

                    {/* ✅ Liste déroulante des résultats de recherche */}
                    {filteredProducts.length > 0 && (
                        <ul className="absolute top-11 left-0 w-full bg-white shadow-md border border-gray-300 rounded-md max-h-60 overflow-auto z-50">
                            {filteredProducts.map((product) => (
                                <li 
                                    key={product.id} 
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        navigate(`/product/${product.id}`);
                                        setSearchTerm("");
                                    }}
                                >
                                    {product.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ Icônes et bouton Vendre */}
                <div className="flex items-center gap-5 text-gray-700 text-sm">
                    <Link to="/messages" className="hover:text-[#706c64] transition">
                        <BsChatDots size={20} />
                    </Link>
                    <Link to="/notifications" className="hover:text-[#706c64] transition">
                        <IoMdNotificationsOutline size={22} />
                    </Link>
                    <Link to="/favorites" className="hover:text-[#706c64] transition">
                        <FiHeart size={18} />
                    </Link>
                    <Link to="/cart" className="hover:text-[#706c64] transition">
                        <FiShoppingCart size={18} />
                    </Link>
                    <Link to="/login" className="hover:text-[#706c64] transition">
                        <FiUser size={18} />
                    </Link>

                    {/* ✅ Bouton "Vendre mes articles" */}
                    <button 
                        onClick={() => {
                            if (isSelling) {
                                setIsSelling(false);
                                navigate("/"); // ✅ Revenir aux produits
                            } else {
                                setIsSelling(true);
                                navigate("/vendre"); // ✅ Activer la vente
                            }
                        }}
                        className="bg-[#46413b] text-white px-5 py-2 rounded-full shadow-md text-xs font-semibold flex items-center hover:bg-[#3a3733] transition"
                    >
                        {isSelling ? "Voir les articles" : "Vendre mes articles"}
                    </button>
                </div>
            </div>

            {/* ✅ Catégories & Sous-catégories */}
            <CategorySelector 
                activeCategory={activeCategory} 
                setActiveCategory={(id) => {
                    setActiveCategory(id);
                    setIsSelling(false); // ✅ Désactive la vente quand on sélectionne une catégorie
                }} 
                setActiveSubCategory={setActiveSubCategory}
            />
            <SubCategoryBar 
                activeCategory={activeCategory} 
                activeSubCategory={activeSubCategory} 
                setActiveSubCategory={(id) => {
                    setActiveSubCategory(id);
                    setIsSelling(false); // ✅ Désactive la vente quand on sélectionne une sous-catégorie
                }}
            />
        </div>
    );
};

export default Header;
