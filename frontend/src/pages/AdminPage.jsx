// import React, { useState } from 'react';
// import { 
//   Layers, 
//   Tag, 
//   Ruler, 
//   LayoutGrid,
//   ChevronRight 
// } from 'lucide-react';
// import Header from '../components/Layout/Header';
// import Footer from '../components/Layout/Footer';
// import CategoryManagement from '../components/AdminFonction/CategoryManagement';
// import SizeManagement from '../components/AdminFonction/SizeManagement';
// import SubCategoryManagement from '../components/AdminFonction/SubCategoryManagement';

// const AdminPage = () => {
//   const [activeView, setActiveView] = useState('dashboard');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Placeholder arrays to resolve undefined errors
//   const categories = []; // Replace with actual categories from your data source
//   const sizes = []; // Replace with actual sizes from your data source
//   const subCategories = []; // Replace with actual subcategories from your data source

//   // Dashboard sidebar card component
//   const SidebarCard = ({ icon: Icon, title, view, isActive }) => (
//     <div 
//       onClick={() => setActiveView(view)}
//       className={`
//         flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300
//         ${isActive 
//           ? 'bg-amber-200 text-amber-800 font-semibold' 
//           : 'hover:bg-amber-100 text-gray-700 hover:text-amber-800'}
//       `}
//     >
//       <Icon className={`w-6 h-6 ${isActive ? 'text-amber-700' : 'text-amber-600'}`} />
//       <span className={isSidebarOpen ? 'opacity-100' : 'opacity-0'}>{title}</span>
//       {isActive && <ChevronRight className="ml-auto w-5 h-5" />}
//     </div>
//   );

//   // Render the appropriate view
//   const renderView = () => {
//     switch(activeView) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'categories':
//         return <CategoryManagement />;
//       case 'sizes':
//         return <SizeManagement />;
//       case 'subcategories':
//         return <SubCategoryManagement />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   // Dashboard view for the main content area
//   const Dashboard = () => (
//     <div className="bg-amber-50 min-h-screen p-8">
//       <h1 className="text-3xl font-bold text-amber-800 mb-6">Tableau de Bord Principal</h1>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//           <h2 className="text-xl font-semibold text-amber-700 mb-4">Statistiques Rapides</h2>
//           <p>Vue d'ensemble de votre boutique</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//           <h2 className="text-xl font-semibold text-amber-700 mb-4">Dernières Actions</h2>
//           <p>Historique récent</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//           <h2 className="text-xl font-semibold text-amber-700 mb-4">Notifications</h2>
//           <p>Alertes et mises à jour</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Sidebar component
//   const Sidebar = () => (
//     <div className={`
//       bg-white border-r-2 border-amber-100 h-screen fixed left-0 top-0 bottom-0 
//       ${isSidebarOpen ? 'w-64' : 'w-20'}
//       pt-24 overflow-y-auto mt-12
//       transition-all duration-300 ease-in-out z-10
//     `}>
//       <div className="flex items-center justify-between mb-8 px-6">
//         <h2 className={`
//           text-2xl font-bold text-amber-800 
//           ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
//           transition-opacity duration-300
//         `}>
//           Menu Admin
//         </h2>
//         <button 
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="text-amber-600 hover:text-amber-800"
//         >
//           <ChevronRight 
//             className={`w-6 h-6 transform ${isSidebarOpen ? 'rotate-180' : ''} transition-transform`} 
//           />
//         </button>
//       </div>

//       <div className="space-y-2 px-4">
//         <SidebarCard 
//           icon={LayoutGrid}
//           title="Tableau de Bord"
//           view="dashboard"
//           isActive={activeView === 'dashboard'}
//         />
//         <SidebarCard 
//           icon={Tag}
//           title="Catégories"
//           view="categories"
//           isActive={activeView === 'categories'}
//         />
//         <SidebarCard 
//           icon={Ruler}
//           title="Tailles"
//           view="sizes"
//           isActive={activeView === 'sizes'}
//         />
//         <SidebarCard 
//           icon={Layers}
//           title="Sous-catégories"
//           view="subcategories"
//           isActive={activeView === 'subcategories'}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex mt-10" >
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content Area */}
//       <div className={`
//         flex-1 ml-${isSidebarOpen ? '64' : '20'} 
//         transition-all duration-300 ease-in-out
//       `}>
//         <Header 
//           showCategories={false} 
//           setSearchTerm={setSearchTerm}
//           setActiveCategory={setActiveCategory}
//           activeCategory={activeCategory}
//           setIsVisible={setIsVisible}
//         />
        
//         {/* Content with padding to account for sidebar and header */}
//         <div className="mt-24 p-8">
//           {/* Sidebar and selected component will be side by side */}
//           <div className="flex">
//             {/* Dashboard remains visible while other components are shown */}
//             <div className={`
//               bg-white border-r-2 border-amber-100 
//               ${isSidebarOpen ? 'w-64' : 'w-20'}
//               transition-all duration-300 ease-in-out
//               overflow-y-auto
//             `}>
//               <div className="p-4">
//                 <h3 className={`
//                   text-xl font-semibold text-amber-800 mb-4
//                   ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
//                   transition-opacity duration-300
//                 `}>
//                   Détails
//                 </h3>
//                 {activeView === 'categories' && (
//                   <div className="space-y-2">
//                     <p className="text-gray-600">Gestion des catégories de produits</p>
//                     <p className="text-sm text-gray-500">Nombre total: {categories.length}</p>
//                   </div>
//                 )}
//                 {activeView === 'sizes' && (
//                   <div className="space-y-2">
//                     <p className="text-gray-600">Gestion des tailles disponibles</p>
//                     <p className="text-sm text-gray-500">Nombre total: {sizes.length}</p>
//                   </div>
//                 )}
//                 {activeView === 'subcategories' && (
//                   <div className="space-y-2">
//                     <p className="text-gray-600">Gestion des sous-catégories</p>
//                     <p className="text-sm text-gray-500">Nombre total: {subCategories.length}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Selected Component View */}
//             <div className="flex-1">
//               {renderView()}
//             </div>
//           </div>
//         </div>
        
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default AdminPage;

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Tag, 
  Ruler,
  Users,
  ShoppingBag,
  LayoutGrid,
  ChevronRight 
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CategoryManagement from '../components/AdminFonction/CategoryManagement';
import SizeManagement from '../components/AdminFonction/SizeManagement';
import SubCategoryManagement from '../components/AdminFonction/SubCategoryManagement';
import { fetchProducts, fetchUser } from '../utils/api'; // Ajustez le chemin selon votre structure

const AdminPage = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Placeholder arrays to resolve undefined errors
  const categories = []; // Replace with actual categories from your data source
  const sizes = []; // Replace with actual sizes from your data source
  const subCategories = []; // Replace with actual subcategories from your data source

  // Dashboard sidebar card component
  const SidebarCard = ({ icon: Icon, title, view, isActive }) => (
    <div 
      onClick={() => setActiveView(view)}
      className={`
        flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-amber-200 text-amber-800 font-semibold' 
          : 'hover:bg-amber-100 text-gray-700 hover:text-amber-800'}
      `}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-amber-700' : 'text-amber-600'}`} />
      <span className={isSidebarOpen ? 'opacity-100' : 'opacity-0'}>{title}</span>
      {isActive && <ChevronRight className="ml-auto w-5 h-5" />}
    </div>
  );

  // Render the appropriate view
  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <CategoryManagement />;
      case 'sizes':
        return <SizeManagement />;
      case 'subcategories':
        return <SubCategoryManagement />;
      default:
        return <Dashboard />;
    }
  };

  // Dashboard view for the main content area avec statistiques
  const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchStats = async () => {
        setIsLoading(true);
        try {
          // Récupération des produits pour compter leur nombre
          const productsData = await fetchProducts();
          if (productsData && productsData.products) {
            setProductCount(productsData.products.length);
          }
          
          // Pour compter les utilisateurs, vous pourriez avoir besoin d'un endpoint API spécifique
          // Cette partie est un exemple et devrait être adaptée à votre API
          const userData = await fetchUser();
          // Si vous avez un endpoint qui retourne le nombre total d'utilisateurs, utilisez-le ici
          // Pour cet exemple, je suppose que nous avons accès à un userCount dans la réponse
          if (userData && userData.userCount) {
            setUserCount(userData.userCount);
          }
          
        } catch (err) {
          console.error("Erreur lors de la récupération des statistiques:", err);
          setError("Impossible de charger les statistiques");
        } finally {
          setIsLoading(false);
        }
      };

      fetchStats();
    }, []);

    return (
      <div className="bg-amber-50 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">Tableau de Bord Principal</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-amber-700">Utilisateurs</h2>
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            {isLoading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                <p className="text-3xl font-bold text-amber-800">{userCount}</p>
                <p className="text-sm text-gray-500">Utilisateurs enregistrés</p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-amber-700">Articles</h2>
              <ShoppingBag className="w-8 h-8 text-amber-600" />
            </div>
            {isLoading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                <p className="text-3xl font-bold text-amber-800">{productCount}</p>
                <p className="text-sm text-gray-500">Articles disponibles</p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Notifications</h2>
            <p>Alertes et mises à jour</p>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar component
  const Sidebar = () => (
    <div className={`
      bg-white border-r-2 border-amber-100 h-screen fixed left-0 top-0 bottom-0 
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      pt-24 overflow-y-auto mt-12
      transition-all duration-300 ease-in-out z-10
    `}>
      <div className="flex items-center justify-between mb-8 px-6">
        <h2 className={`
          text-2xl font-bold text-amber-800 
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `}>
          Menu Admin
        </h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-amber-600 hover:text-amber-800"
        >
          <ChevronRight 
            className={`w-6 h-6 transform ${isSidebarOpen ? 'rotate-180' : ''} transition-transform`} 
          />
        </button>
      </div>

      <div className="space-y-2 px-4">
        <SidebarCard 
          icon={LayoutGrid}
          title="Tableau de Bord"
          view="dashboard"
          isActive={activeView === 'dashboard'}
        />
        <SidebarCard 
          icon={Tag}
          title="Catégories"
          view="categories"
          isActive={activeView === 'categories'}
        />
        <SidebarCard 
          icon={Ruler}
          title="Tailles"
          view="sizes"
          isActive={activeView === 'sizes'}
        />
        <SidebarCard 
          icon={Layers}
          title="Sous-catégories"
          view="subcategories"
          isActive={activeView === 'subcategories'}
        />
      </div>
    </div>
  );

  return (
    <div className="flex mt-10" >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`
        flex-1 ml-${isSidebarOpen ? '64' : '20'} 
        transition-all duration-300 ease-in-out
      `}>
        <Header 
          showCategories={false} 
          setSearchTerm={setSearchTerm}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          setIsVisible={setIsVisible}
        />
        
        {/* Content with padding to account for sidebar and header */}
        <div className="mt-24 p-8">
          {/* Sidebar and selected component will be side by side */}
          <div className="flex">
            {/* Dashboard remains visible while other components are shown */}
            <div className={`
              bg-white border-r-2 border-amber-100 
              ${isSidebarOpen ? 'w-64' : 'w-20'}
              transition-all duration-300 ease-in-out
              overflow-y-auto
            `}>
              <div className="p-4">
                <h3 className={`
                  text-xl font-semibold text-amber-800 mb-4
                  ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
                  transition-opacity duration-300
                `}>
                  Détails
                </h3>
                {activeView === 'categories' && (
                  <div className="space-y-2">
                    <p className="text-gray-600">Gestion des catégories de produits</p>
                    <p className="text-sm text-gray-500">Nombre total: {categories.length}</p>
                  </div>
                )}
                {activeView === 'sizes' && (
                  <div className="space-y-2">
                    <p className="text-gray-600">Gestion des tailles disponibles</p>
                    <p className="text-sm text-gray-500">Nombre total: {sizes.length}</p>
                  </div>
                )}
                {activeView === 'subcategories' && (
                  <div className="space-y-2">
                    <p className="text-gray-600">Gestion des sous-catégories</p>
                    <p className="text-sm text-gray-500">Nombre total: {subCategories.length}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Component View */}
            <div className="flex-1">
              {renderView()}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default AdminPage;