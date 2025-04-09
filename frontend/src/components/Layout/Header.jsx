// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BiSearchAlt2 } from "react-icons/bi";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { RiHeartLine, RiMessage3Line, RiLogoutBoxLine } from "react-icons/ri";
// import { IoNotificationsOutline } from "react-icons/io5";
// import { MdOutlineSell, MdOutlineAccountCircle } from "react-icons/md";
// import { HiOutlineUser } from "react-icons/hi";
// import { AiOutlineHistory } from "react-icons/ai";
// import Popup from "../Popup/Popup";
// import LogoutConfirmPopup from "../Popup/LogoutConfirmPopup";
// import { fetchUser, fetchProducts, logout, saveSearchHistory } from "../../utils/api";
// import logo from "../../Assests/logo.png";
// import CategorySelector from "./CategorySelector";

// const Header = ({ setSearchTerm, setActiveCategory, activeCategory, setIsVisible, showCategories = true, refreshProducts }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showPopup, setShowPopup] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [searchInput, setSearchInput] = useState(""); 

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data.products || []);
//       } catch (error) {
//         console.error("Erreur lors du chargement des produits :", error);
//       }
//     };
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const response = await fetchUser();
//         if (response.success) {
//           setUser(response.user);
//         }
//       } catch (error) {
//         console.error("Erreur récupération utilisateur :", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getUser();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfileMenu]);

//   const handleSearchInputChange = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchInput(query);
    
//     if (query.length > 0) {
//       const filtered = products.filter((product) =>
//         product.name.toLowerCase().includes(query)
//       );
//       setFilteredProducts(filtered);
//     } else {
//       setFilteredProducts([]);
//     }
//   };

//   const handleSearchClick = async () => {
//     setSearchTerm(searchInput);
    
//     if (searchInput.length > 0) {
//       const filtered = products.filter((product) =>
//         product.name.toLowerCase().includes(searchInput)
//       );
//       const productIds = filtered.map((product) => product._id);
      
//       try {
//         const userResponse = await fetchUser();
//         if (userResponse.success) {
//           await saveSearchHistory({
//             searchTerm: searchInput,
//             productIds,
//           });
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'enregistrement de la recherche", error);
//       }
//     }
    
//     setFilteredProducts([]);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     handleSearchClick();
//   };

//   const handleProtectedClick = (e, path) => {
//     if (!user && !loading) {
//       e.preventDefault();
//       setShowPopup(true);
//     } else {
//       window.location.href = path;
//     }
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/InfoProduct/${productId}`);
//     setFilteredProducts([]);
//   };

//   const openLogoutConfirmation = () => {
//     setShowLogoutPopup(true);
//     setShowProfileMenu(false);
//   };

//   const confirmLogout = async () => {
//     try {
//       const response = await logout();
//       if (response.success) {
//         navigate("/");
//         setUser(null);
//       } else {
//         console.error("Échec de la déconnexion:", response.message);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la déconnexion:", error);
//     }
//   };

//   const toggleProfileMenu = () => {
//     setShowProfileMenu(!showProfileMenu);
//   };
  
//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     if (setSearchTerm) setSearchTerm('');
//     if (setActiveCategory) setActiveCategory(null);
//     if (refreshProducts) refreshProducts();
//     navigate('/');
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-lg">
//       <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
//         <a href="/" onClick={handleLogoClick} className="flex items-center">
//           <img src={logo} alt="logo" className="w-24 h-auto transform hover:scale-105 transition-transform" />
//         </a>

//         <div className="relative w-[55%] max-w-[650px]">
//           <form onSubmit={handleSearchSubmit} className="flex items-center">
//             <div className={`flex items-center border-2 ${searchFocused ? 'border-amber-500' : 'border-gray-200'} rounded-full bg-white transition-all duration-300 w-full`}>
//               <input
//                 type="text"
//                 placeholder="Rechercher un produit..."
//                 value={searchInput}
//                 onChange={handleSearchInputChange}
//                 onFocus={() => setSearchFocused(true)}
//                 onBlur={() => setSearchFocused(false)}
//                 className="h-11 w-full px-5 text-sm bg-transparent outline-none text-gray-800 rounded-full"
//               />
//               <button
//                 type="button"
//                 className={`w-10 h-10 rounded-full mr-1 flex items-center justify-center ${searchFocused ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'} transition-all duration-300 cursor-pointer hover:bg-amber-600`}
//                 onClick={handleSearchClick}
//               >
//                 <BiSearchAlt2 size={20} />
//               </button>
//             </div>
//           </form>
//           {filteredProducts.length > 0 && (
//             <ul className="absolute z-50 left-0 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-80 overflow-y-auto divide-y divide-gray-100">
//               {filteredProducts.map((product) => (
//                 <li
//                   key={product._id}
//                   className="px-4 py-3 hover:bg-amber-50 cursor-pointer flex items-center transition-colors duration-200 group"
//                   onClick={() => handleProductClick(product._id)}
//                 >
//                   {product.thumbnail && (
//                     <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-sm transition-all duration-300 group-hover:shadow-md">
//                       <img
//                         src={product.thumbnail}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900 group-hover:text-amber-700 transition-colors">{product.name}</p>
//                     {product.description && (
//                       <p className="text-xs text-gray-500 mt-1 truncate">{product.description}</p>
//                     )}
//                   </div>
//                   <div className="flex items-center ml-2">
//                     {product.price && (
//                       <span className="text-amber-600 font-semibold mr-3">{product.price} DA</span>
//                     )}
//                     <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-gray-600">
//           <IconButton 
//             icon={<RiMessage3Line size={20} />} 
//             href="/messages" 
//             onClick={(e) => handleProtectedClick(e, "/messages")} 
//           />
//           <IconButton 
//             icon={<IoNotificationsOutline size={22} />} 
//             href="/notifications" 
//             onClick={(e) => handleProtectedClick(e, "/notifications")} 
//           />
          
//           {/* Affichage conditionnel des icônes favoris et panier seulement si l'utilisateur n'est pas admin */}
//           {(!user || user.role !== "admin") && (
//             <>
//               <IconButton 
//                 icon={<RiHeartLine size={20} />} 
//                 href="/favorites" 
//                 onClick={(e) => handleProtectedClick(e, "/favorites")} 
//               />
//               <IconButton 
//                 icon={<HiOutlineShoppingBag size={20} />} 
//                 href="/cart" 
//                 onClick={(e) => handleProtectedClick(e, "/cart")} 
//               />
//             </>
//           )}

//           {!loading && (
//             user ? (
//               <div className="profile-menu-container relative ml-1">
//                 <button 
//                   className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200 hover:border-amber-400 focus:border-amber-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
//                   onClick={toggleProfileMenu}
//                 >
//                   <img src={`http://localhost:8000${user.avatar?.url}`} alt="Profil" className="w-full h-full object-cover" />
//                 </button>
                
//                 {showProfileMenu && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{user.username || user.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                     </div>
//                     <Link 
//                       to="/Profil" 
//                       className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <MdOutlineAccountCircle size={18} className="mr-3 text-amber-500" />
//                       Mon profil
//                     </Link>
//                     <Link 
//                       to="/Historique" 
//                       className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <AiOutlineHistory size={18} className="mr-3 text-amber-500" />
//                       Historique de recherche
//                     </Link>
//                     <Link 
//                       to="/messages" 
//                       className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <RiMessage3Line size={18} className="mr-3 text-amber-500" />
//                       Messagerie
//                     </Link>

//                     <div className="border-t border-gray-100 my-1"></div>
//                     <button 
//                       onClick={openLogoutConfirmation}
//                       className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
//                     >
//                       <RiLogoutBoxLine size={18} className="mr-3 text-red-500" />
//                       Se déconnecter
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/login" className="ml-1 group">
//                 <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:bg-amber-50 transition-colors duration-300">
//                   <HiOutlineUser size={20} className="text-gray-600 group-hover:text-amber-600 transition-colors duration-300" />
//                 </div>
//               </Link>
//             )
//           )}
//         </div>

//         {/* Affichage conditionnel du bouton Vendre seulement si l'utilisateur n'est pas admin */}
//         {(!user || user.role !== "admin") && (
//           <button
//             onClick={(e) => handleProtectedClick(e, "/Sell")}
//             className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
//           >
//             <MdOutlineSell size={18} />
//             <span>Vendre</span>
//           </button>
//         )}
//       </div>

//       {showCategories && (
//         <CategorySelector activeCategory={activeCategory} setActiveCategory={setActiveCategory} setIsVisible={setIsVisible} />
//       )}

//       {showPopup && <Popup message="Veuillez vous connecter pour accéder à cette fonctionnalité." onClose={() => setShowPopup(false)} />}
      
//       <LogoutConfirmPopup 
//         isOpen={showLogoutPopup}
//         onClose={() => setShowLogoutPopup(false)}
//         onConfirm={() => {
//           setShowLogoutPopup(false);
//           confirmLogout();
//         }}
//       />
//     </div>
//   );
// };

// const IconButton = ({ icon, href, onClick }) => (
//   <a 
//     href={href} 
//     onClick={onClick} 
//     className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors duration-300 group"
//   >
//     <div className="text-gray-500 group-hover:text-amber-600 transition-colors duration-300">
//       {icon}
//     </div>
//   </a>
// );

// export default Header;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { RiHeartLine, RiMessage3Line, RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineSell, MdOutlineAccountCircle } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { AiOutlineHistory } from "react-icons/ai";
import Popup from "../Popup/Popup";
import LogoutConfirmPopup from "../Popup/LogoutConfirmPopup";
import { fetchUser, fetchProducts, logout, saveSearchHistory } from "../../utils/api";
import logo from "../../Assests/logo.png";
import CategorySelector from "./CategorySelector";

const Header = ({ setSearchTerm, setActiveCategory, activeCategory, setIsVisible, showCategories = true, refreshProducts }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState(""); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };
    loadProducts();

    const getUser = async () => {
      try {
        const response = await fetchUser();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    // Gestion de la responsivité
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Fermer le menu mobile lors du redimensionnement
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);
    
    if (query.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSearchClick = async () => {
    setSearchTerm(searchInput);
    
    if (searchInput.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchInput)
      );
      const productIds = filtered.map((product) => product._id);
      
      try {
        const userResponse = await fetchUser();
        if (userResponse.success) {
          await saveSearchHistory({
            searchTerm: searchInput,
            productIds,
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la recherche", error);
      }
    }
    
    setFilteredProducts([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearchClick();
  };

  const handleProtectedClick = (e, path) => {
    if (!user && !loading) {
      e.preventDefault();
      setShowPopup(true);
    } else {
      window.location.href = path;
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/InfoProduct/${productId}`);
    setFilteredProducts([]);
  };

  const openLogoutConfirmation = () => {
    setShowLogoutPopup(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        navigate("/");
        setUser(null);
      } else {
        console.error("Échec de la déconnexion:", response.message);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (setSearchTerm) setSearchTerm('');
    if (setActiveCategory) setActiveCategory(null);
    if (refreshProducts) refreshProducts();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Rendu du menu mobile
  const renderMobileMenu = () => (
    <div className={`
      fixed top-0 left-0 w-full h-screen bg-white z-50 transform transition-transform duration-300
      ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      flex flex-col
    `}>
      {/* Contenu du menu mobile */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <img src={logo} alt="logo" className="w-24 h-auto" />
        <button onClick={toggleMobileMenu} className="text-gray-600">
          <RiCloseLine size={24} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {/* Barre de recherche mobile */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className={`flex items-center border-2 ${searchFocused ? 'border-amber-500' : 'border-gray-200'} rounded-full bg-white transition-all duration-300 w-full`}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchInput}
                onChange={handleSearchInputChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-11 w-full px-5 text-sm bg-transparent outline-none text-gray-800 rounded-full"
              />
              <button
                type="button"
                className={`w-10 h-10 rounded-full mr-1 flex items-center justify-center ${searchFocused ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'} transition-all duration-300 cursor-pointer hover:bg-amber-600`}
                onClick={handleSearchClick}
              >
                <BiSearchAlt2 size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Menu de navigation mobile */}
        <div className="space-y-4">
          {user ? (
            <>
              <Link 
                to="/Profil" 
                className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <MdOutlineAccountCircle size={24} className="mr-3 text-amber-500" />
                <span>Mon profil</span>
              </Link>
              <Link 
                to="/Historique" 
                className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <AiOutlineHistory size={24} className="mr-3 text-amber-500" />
                <span>Historique de recherche</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <RiMessage3Line size={24} className="mr-3 text-amber-500" />
                <span>Messagerie</span>
              </Link>
              
              {/* Options supplémentaires pour mobile */}
              {(!user || user.role !== "admin") && (
                <>
                  <Link 
                    to="/favorites" 
                    className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    <RiHeartLine size={24} className="mr-3 text-amber-500" />
                    <span>Favoris</span>
                  </Link>
                  <Link 
                    to="/cart" 
                    className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    <HiOutlineShoppingBag size={24} className="mr-3 text-amber-500" />
                    <span>Panier</span>
                  </Link>
                  <Link 
                    to="/Sell" 
                    className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    <MdOutlineSell size={24} className="mr-3 text-amber-500" />
                    <span>Vendre</span>
                  </Link>
                </>
              )}

              <button 
                onClick={() => {
                  toggleMobileMenu();
                  openLogoutConfirmation();
                }}
                className="flex items-center px-4 py-3 bg-red-50 rounded-lg text-red-600 w-full"
              >
                <RiLogoutBoxLine size={24} className="mr-3 text-red-500" />
                <span>Se déconnecter</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center px-4 py-3 bg-amber-50 rounded-lg"
              onClick={toggleMobileMenu}
            >
              <HiOutlineUser size={24} className="mr-3 text-amber-500" />
              <span>Se connecter</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto relative">
        {/* Logo et bouton menu mobile */}
        <div className="flex items-center">
          {isMobile && (
            <button 
              onClick={toggleMobileMenu}
              className="mr-4 text-gray-600"
            >
              <RiMenuLine size={24} />
            </button>
          )}
          <a href="/" onClick={handleLogoClick} className="flex items-center">
            <img src={logo} alt="logo" className="w-24 h-auto transform hover:scale-105 transition-transform" />
          </a>
        </div>

        {/* Recherche (caché sur mobile) */}
        {!isMobile && (
          <div className="relative w-[55%] max-w-[650px]">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className={`flex items-center border-2 ${searchFocused ? 'border-amber-500' : 'border-gray-200'} rounded-full bg-white transition-all duration-300 w-full`}>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="h-11 w-full px-5 text-sm bg-transparent outline-none text-gray-800 rounded-full"
                />
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full mr-1 flex items-center justify-center ${searchFocused ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'} transition-all duration-300 cursor-pointer hover:bg-amber-600`}
                  onClick={handleSearchClick}
                >
                  <BiSearchAlt2 size={20} />
                </button>
              </div>
            </form>
            {filteredProducts.length > 0 && (
              <ul className="absolute z-50 left-0 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <li
                      key={product._id}
                      className="px-4 py-3 hover:bg-amber-50 cursor-pointer flex items-center transition-colors duration-200 group"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {product.thumbnail && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-sm transition-all duration-300 group-hover:shadow-md">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-amber-700 transition-colors">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{product.description}</p>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {product.price && (
                          <span className="text-amber-600 font-semibold mr-3">{product.price} DA</span>
                        )}
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
            )}
          </div>
        )}

        {/* Icônes de navigation */}
        {!isMobile && (
          <div className="flex items-center gap-2 text-gray-600">
            <IconButton 
              icon={<RiMessage3Line size={20} />} 
              href="/messages" 
              onClick={(e) => handleProtectedClick(e, "/messages")} 
            />
            <IconButton 
              icon={<IoNotificationsOutline size={22} />} 
              href="/notifications" 
              onClick={(e) => handleProtectedClick(e, "/notifications")} 
            />
            
            {/* Affichage conditionnel des icônes favoris et panier seulement si l'utilisateur n'est pas admin */}
            {(!user || user.role !== "admin") && (
              <>
                <IconButton 
                  icon={<RiHeartLine size={20} />} 
                  href="/favorites" 
                  onClick={(e) => handleProtectedClick(e, "/favorites")} 
                />
                <IconButton 
                  icon={<HiOutlineShoppingBag size={20} />} 
                  href="/cart" 
                  onClick={(e) => handleProtectedClick(e, "/cart")} 
                />
              </>
            )}
          </div>
        )}

        {/* Bouton de vente */}
        {!isMobile && (!user || user.role !== "admin") && (
          <button
            onClick={(e) => handleProtectedClick(e, "/Sell")}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
          >
            <MdOutlineSell size={18} />
            <span>Vendre</span>
          </button>
        )}

        {/* Profil utilisateur */}
        {!isMobile && !loading && (
          user ? (
            <div className="profile-menu-container relative ml-1">
              <button 
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200 hover:border-amber-400 focus:border-amber-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                onClick={toggleProfileMenu}
              >
                <img src={`http://localhost:8000${user.avatar?.url}`} alt="Profil" className="w-full h-full object-cover" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.username || user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/Profil" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <MdOutlineAccountCircle size={18} className="mr-3 text-amber-500" />
                    Mon profil
                  </Link>
                  <Link 
                    to="/Historique" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <AiOutlineHistory size={18} className="mr-3 text-amber-500" />
                    Historique de recherche
                  </Link>
                  <Link 
                    to="/messages" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <RiMessage3Line size={18} className="mr-3 text-amber-500" />
                    Messagerie
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={openLogoutConfirmation}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                  >
                    <RiLogoutBoxLine size={18} className="mr-3 text-red-500" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="ml-1 group">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:bg-amber-50 transition-colors duration-300">
                <HiOutlineUser size={20} className="text-gray-600 group-hover:text-amber-600 transition-colors duration-300" />
              </div>
            </Link>
          )
        )}
      </div>

      {/* Menu mobile */}
      {renderMobileMenu()}

      {/* Sélecteur de catégories */}
      {showCategories && (
        <CategorySelector 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          setIsVisible={setIsVisible} 
        />
      )}

      {/* Popups */}
      {showPopup && <Popup message="Veuillez vous connecter pour accéder à cette fonctionnalité." onClose={() => setShowPopup(false)} />}
      
      <LogoutConfirmPopup 
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={() => {
          setShowLogoutPopup(false);
          confirmLogout();
        }}
      />
    </div>
  );
};

const IconButton = ({ icon, href, onClick }) => (
  <a 
    href={href} 
    onClick={onClick} 
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors duration-300 group"
  >
    <div className="text-gray-500 group-hover:text-amber-600 transition-colors duration-300">
      {icon}
    </div>
  </a>
);

export default Header;