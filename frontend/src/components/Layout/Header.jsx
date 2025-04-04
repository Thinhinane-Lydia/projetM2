
// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { AiOutlineSearch } from "react-icons/ai";
// // import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
// // import { IoMdNotificationsOutline } from "react-icons/io";
// // import { BsChatDots } from "react-icons/bs";
// // import logo from "../../Assests/logo.png";
// // import CategorySelector from "./CategorySelector";

// // const Header = ({ setSearchTerm, setActiveCategory, activeCategory, setIsVisible }) => {
// //   return (
// //     <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-md border-b">
// //       <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
// //         <Link to="/" className="flex items-center">
// //           <img src={logo} alt="logo" className="w-24 h-auto" />
// //         </Link>

// //         {/* Barre de recherche */}
// //         <div className="relative w-[55%] max-w-[650px] flex items-center border border-gray-400 rounded-full bg-gray-100">
// //           <input
// //             type="text"
// //             placeholder="Rechercher un produit..."
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="h-10 w-full px-4 text-sm bg-transparent outline-none"
// //           />
// //           <AiOutlineSearch size={20} className="absolute right-4 text-gray-500 cursor-pointer" />
// //         </div>

// //         {/* Icônes */}
// //         <div className="flex items-center gap-5 text-gray-700 text-sm">
// //           <Link to="/messages"><BsChatDots size={20} /></Link>
// //           <Link to="/notifications"><IoMdNotificationsOutline size={22} /></Link>
// //           <Link to="/favorites"><FiHeart size={18} /></Link>
// //           <Link to="/cart"><FiShoppingCart size={18} /></Link>
// //           <Link to="/login"><FiUser size={18} /></Link>
// //         </div>
// //       </div>

// //       {/* Gestion des catégories */}
// //       <CategorySelector 
// //         activeCategory={activeCategory}
// //         setActiveCategory={setActiveCategory} 
// //         setIsVisible={setIsVisible} 
// //       />
// //     </div>
// //   );
// // };

// // export default Header;
// import React from "react";
// import { Link } from "react-router-dom";
// import { BiSearchAlt2 } from "react-icons/bi";
// import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
// import { RiHeartLine, RiMessage3Line } from "react-icons/ri";
// import { IoNotificationsOutline } from "react-icons/io5";
// import { MdOutlineSell } from "react-icons/md";
// import logo from "../../Assests/logo.png";
// import CategorySelector from "./CategorySelector";

// const Header = ({ setSearchTerm, setActiveCategory, activeCategory, setIsVisible }) => {
//   return (
//     <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b">
//       <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
//         <Link to="/" className="flex items-center">
//           <img src={logo} alt="logo" className="w-24 h-auto" />
//         </Link>

//         {/* Barre de recherche */}
//         <div className="relative w-[55%] max-w-[650px] flex items-center border border-gray-300 rounded-full bg-gray-50">
//           <input
//             type="text"
//             placeholder="Rechercher un produit..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="h-10 w-full px-4 text-sm bg-transparent outline-none"
//           />
//           <BiSearchAlt2 size={22} className="absolute right-4 text-gray-500 cursor-pointer hover:text-gray-700" />
//         </div>

//         {/* Icônes */}
//         <div className="flex items-center gap-5 text-gray-600">
//           <Link to="/messages" className="relative hover:text-gray-800 transition-colors duration-200">
//             <RiMessage3Line size={22} />
//           </Link>
//           <Link to="/notifications" className="relative hover:text-gray-800 transition-colors duration-200">
//             <IoNotificationsOutline size={24} />
//           </Link>
//           <Link to="/favorites" className="relative hover:text-gray-800 transition-colors duration-200">
//             <RiHeartLine size={22} />
//           </Link>
//           <Link to="/cart" className="relative hover:text-gray-800 transition-colors duration-200">
//             <HiOutlineShoppingBag size={22} />
//           </Link>
//           <Link to="/login" className="relative hover:text-gray-800 transition-colors duration-200">
//             <HiOutlineUser size={22} />
//           </Link>
//         </div>
        
//         {/* Bouton Vendre (à droite) */}
//         <Link to="/vendre" className="flex items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
//           <MdOutlineSell size={18} />
//           <span>Vendre mes articles</span>
//         </Link>
//       </div>

//       {/* Gestion des catégories */}
//       <CategorySelector 
//         activeCategory={activeCategory}
//         setActiveCategory={setActiveCategory} 
//         setIsVisible={setIsVisible} 
//       />
//     </div>
//   );
// };

// export default Header;
import React from "react";
import { Link } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { RiHeartLine, RiMessage3Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineSell } from "react-icons/md";
import logo from "../../Assests/logo.png";
import CategorySelector from "./CategorySelector";

const Header = ({ setSearchTerm, setActiveCategory, activeCategory, setIsVisible }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-neutral-100 shadow-md border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="logo" className="w-24 h-auto" />
        </Link>

        {/* Barre de recherche */}
        <div className="relative w-[55%] max-w-[650px] flex items-center border border-neutral-300 rounded-full bg-white hover:border-amber-700 transition-colors">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full px-4 text-sm bg-transparent outline-none text-neutral-800 focus:ring-1 focus:ring-amber-700 rounded-full"
          />
          <BiSearchAlt2 size={22} className="absolute right-4 text-neutral-600 cursor-pointer hover:text-amber-800" />
        </div>

        {/* Icônes */}
        <div className="flex items-center gap-5 text-amber-800">
          <Link to="/messages" className="relative hover:text-amber-950 transition-colors duration-200">
            <RiMessage3Line size={22} />
          </Link>
          <Link to="/notifications" className="relative hover:text-amber-950 transition-colors duration-200">
            <IoNotificationsOutline size={24} />
          </Link>
          <Link to="/favorites" className="relative hover:text-amber-950 transition-colors duration-200">
            <RiHeartLine size={22} />
          </Link>
          <Link to="/cart" className="relative hover:text-amber-950 transition-colors duration-200">
            <HiOutlineShoppingBag size={22} />
          </Link>
          <Link to="/login" className="relative hover:text-amber-950 transition-colors duration-200">
            <HiOutlineUser size={22} />
          </Link>
        </div>
        
        {/* Bouton Vendre (à droite) */}
        <Link to="/vendre" className="flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
          <MdOutlineSell size={18} />
          <span>Vendre mes articles</span>
        </Link>
      </div>

     
    </div>
  );
};

export default Header;