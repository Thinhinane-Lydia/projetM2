// import React, { useState, useEffect } from 'react';
// import axios from "axios";
// import { 
//   Layers, 
//   Tag, 
//   Ruler,
//   Users,
//   ShoppingBag,
//   LayoutGrid,
//   ChevronRight,
//   LogOut,
//   Eye,
//   LineChart
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// import CategoryManagement from '../components/AdminFonction/CategoryManagement';
// import SizeManagement from '../components/AdminFonction/SizeManagement';
// import SubCategoryManagement from '../components/AdminFonction/SubCategoryManagement';
// import UserList from '../components/AdminFonction/UserList';
// import ProductList from '../components/AdminFonction/ProductList';
// import SalesManagement from '../components/AdminFonction/SalesManagement';
// import { fetchProducts, fetchUser, logout, fetchAllUsers } from '../utils/api';

// const AdminPage = () => {
//   const navigate = useNavigate();
//   const [activeView, setActiveView] = useState('dashboard');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showProducts, setShowProducts] = useState(false);
//   const [showUsers, setShowUsers] = useState(false);
//   const [showSales, setShowSales] = useState(false);
  
//   // Fonction de déconnexion
//   const handleLogout = async () => {
//     try {
//       const response = await logout();
      
//       if (response.success) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('userRole');
        
//         toast.success('Déconnexion réussie');
//         navigate('/login');
//       } else {
//         toast.error('Erreur lors de la déconnexion');
//       }
//     } catch (error) {
//       console.error('Erreur de déconnexion:', error);
//       toast.error('Une erreur est survenue lors de la déconnexion');
//     }
//   };

//   // Vérification du rôle admin et récupération des informations de l'utilisateur
//   useEffect(() => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole !== "admin") {
//       toast.error("Accès non autorisé");
//       navigate("/");
//       return;
//     }
    
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
//   }, [navigate]);

//   // Dashboard sidebar card component
//   const SidebarCard = ({ icon: Icon, title, view, isActive }) => (
//     <div 
//       onClick={() => setActiveView(view)}
//       className={`
//         flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300
//         mt-10
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
//         return <Dashboard 
//           user={user} 
//           loading={loading} 
//           showProducts={showProducts} 
//           setShowProducts={setShowProducts}
//           showUsers={showUsers}
//           setShowUsers={setShowUsers}
//           showSales={showSales}
//           setShowSales={setShowSales}
//           onLogout={handleLogout}
//           setActiveView={setActiveView}
//         />;
//       case 'products':
//         return <ProductList />;
//       case 'categories':
//         return <CategoryManagement />;
//       case 'sizes':
//         return <SizeManagement />;
//       case 'subcategories':
//         return <SubCategoryManagement />;
//       case 'users':
//         return <UserList />;
//       case 'sales':
//         return <SalesManagement />;
//       default:
//         return <Dashboard 
//           user={user} 
//           loading={loading} 
//           showProducts={showProducts} 
//           setShowProducts={setShowProducts}
//           showUsers={showUsers}
//           setShowUsers={setShowUsers}
//           showSales={showSales}
//           setShowSales={setShowSales}
//           onLogout={handleLogout}
//           setActiveView={setActiveView}
//         />;
//     }
//   };
//   // Dashboard view for the main content area avec statistiques
//   const Dashboard = ({ 
//     user, 
//     loading, 
//     showProducts, 
//     setShowProducts, 
//     showUsers, 
//     setShowUsers,
//     showSales,
//     setShowSales,
//     onLogout,
//     setActiveView
//   }) => {
//     const [userCount, setUserCount] = useState(0);
//     const [productCount, setProductCount] = useState(0);
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//       const fetchStats = async () => {
//         setIsLoading(true);
//         try {
//           // Récupération des produits pour compter leur nombre
//           const productsData = await fetchProducts();
//           if (productsData && productsData.products) {
//             setProductCount(productsData.products.length);
//           }
          
//           // Récupération des utilisateurs
//           const usersData = await fetchAllUsers();
//           if (usersData && usersData.users) {
//             setUsers(usersData.users);
//             setUserCount(usersData.users.length);
//           }
          
//         } catch (err) {
//           console.error("Erreur lors de la récupération des statistiques:", err);
//           setError("Impossible de charger les statistiques");
//         } finally {
//           setIsLoading(false);
//         }
//       };
    
//       fetchStats();
//     }, []);

//     // Fonction pour basculer l'affichage des produits
//     const toggleProductsView = () => {
//       setShowProducts(!showProducts);
//     };

//     // Fonction pour basculer l'affichage des utilisateurs
//     const toggleUsersView = () => {
//       setShowUsers(!showUsers);
//     };

//     // Fonction pour basculer l'affichage des ventes
//     const toggleSalesView = () => {
//       setShowSales(!showSales);
//     };

//     // Fonction pour rediriger vers la vue complète des produits
//     const goToProductsView = () => {
//       setActiveView('products');
//     };

//     // Fonction pour rediriger vers la vue complète des utilisateurs
//     const goToUsersView = () => {
//       setActiveView('users');
//     };

//     // Fonction pour rediriger vers la vue complète des ventes
//     const goToSalesView = () => {
//       setActiveView('sales');
//     };

//     return (
//       <div className="bg-amber-50 min-h-screen p-8">
//         {/* Section d'information administrateur */}
//         <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 mb-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-amber-700 mb-4">Informations Administrateur</h2>
//             <button 
//               onClick={onLogout}
//               className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
//             >
//               <LogOut className="w-5 h-5" />
//               <span className="text-sm">Déconnexion</span>
//             </button>
//           </div>
//           <div className="flex items-center">
//             {loading ? (
//               <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
//             ) : user ? (
//               <div className="flex items-center">
//                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200">
//                   <img 
//                     src={`http://localhost:8000${user.avatar?.url}`} 
//                     alt="Avatar Admin" 
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://via.placeholder.com/150?text=Admin";
//                     }}
//                   />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-lg font-semibold text-amber-800">{user.username || user.name || "Administrateur"}</p>
//                   <p className="text-sm text-gray-600">{user.email}</p>
//                   <p className="text-xs text-amber-600 mt-1">{user.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-red-500">Impossible de charger les informations administrateur</p>
//             )}
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-amber-800 mb-6">Tableau de Bord Principal</h1>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Carte Utilisateurs */}
//           <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-amber-700">Utilisateurs</h2>
//               <Users className="w-8 h-8 text-amber-600" />
//             </div>
//             {isLoading ? (
//               <p className="text-gray-500">Chargement...</p>
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : (
//               <div>
//                 <p className="text-3xl font-bold text-amber-800">{userCount}</p>
//                 <p className="text-sm text-gray-500">Utilisateurs enregistrés</p>
//                 <div className="flex space-x-2 mt-3">
//                   <button 
//                     onClick={goToUsersView}
//                     className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
//                   >
//                     Vue complète
//                   </button>
//                   <button 
//                     onClick={toggleUsersView}
//                     className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     {showUsers ? "Masquer" : "Aperçu"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Carte Articles */}
//           <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-amber-700">Articles</h2>
//               <ShoppingBag className="w-8 h-8 text-amber-600" />
//             </div>
//             {isLoading ? (
//               <p className="text-gray-500">Chargement...</p>
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : (
//               <div>
//                 <p className="text-3xl font-bold text-amber-800">{productCount}</p>
//                 <p className="text-sm text-gray-500">Articles disponibles</p>
//                 <div className="flex space-x-2 mt-3">
//                   <button 
//                     onClick={goToProductsView}
//                     className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
//                   >
//                     Vue complète
//                   </button>
//                   <button 
//                     onClick={toggleProductsView}
//                     className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     {showProducts ? "Masquer" : "Aperçu"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Carte Ventes */}
//           <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-amber-700">Ventes</h2>
//               <LineChart className="w-8 h-8 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Gestion des ventes et commandes</p>
//               <div className="flex space-x-2 mt-3">
//                 <button 
//                   onClick={goToSalesView}
//                   className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
//                 >
//                   Vue complète
//                 </button>
//                 <button 
//                   onClick={toggleSalesView}
//                   className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
//                 >
//                   <Eye className="w-4 h-4 mr-2" />
//                   {showSales ? "Masquer" : "Aperçu"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section pour afficher les produits dans le tableau de bord */}
//         {showProducts && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Articles</h2>
//             <ProductList />
//           </div>
//         )}

//         {/* Section pour afficher les utilisateurs dans le tableau de bord */}
//         {showUsers && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Utilisateurs</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {users.slice(0, 6).map((userData) => (
//                 <div 
//                   key={userData._id} 
//                   className="bg-white p-4 rounded-xl shadow-md border border-amber-100 flex items-center"
//                 >
//                   <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
//                     <img 
//                       src={`http://localhost:8000${userData.avatar?.url}`} 
//                       alt={userData.username} 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/150?text=User";
//                       }}
//                     />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-amber-800">{userData.username}</p>
//                     <p className="text-sm text-gray-600">{userData.email}</p>
//                     <p className="text-xs text-amber-600">{userData.role}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section pour afficher les ventes dans le tableau de bord */}
//         {showSales && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Ventes</h2>
//             <SalesManagement showInDashboard={true} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Sidebar component
//   const Sidebar = () => (
//     <div className={`
//       bg-white border-r-2 border-amber-100 h-screen fixed left-0 top-0 bottom-0 
//       ${isSidebarOpen ? 'w-64' : 'w-20'}
//       transition-all duration-300 ease-in-out z-10
//     `}>
//       <div className="flex items-center justify-between mb-8 px-6 pt-6">
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

//       {/* Info utilisateur dans la sidebar */}
//       {user && isSidebarOpen && (
//         <div className="px-6 mb-6 pb-6 border-b border-amber-100">
//           <div className="flex items-center">
//             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200">
//               <img 
//                 src={`http://localhost:8000${user.avatar?.url}`} 
//                 alt="Avatar" 
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "https://via.placeholder.com/150?text=Admin";
//                 }}
//               />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-semibold text-amber-800">{user.username || user.name || "Admin"}</p>
//               <p className="text-xs text-gray-500 truncate">{user.email}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="space-y-2 px-4">
//         <SidebarCard 
//           icon={LayoutGrid}
//           title="Tableau de Bord"
//           view="dashboard"
//           isActive={activeView === 'dashboard'}
//         />
//         <SidebarCard 
//           icon={Users}
//           title="Utilisateurs"
//           view="users"
//           isActive={activeView === 'users'}
//         />
//         <SidebarCard 
//           icon={ShoppingBag}
//           title="Articles"
//           view="products"
//           isActive={activeView === 'products'}
//         />
//         <SidebarCard 
//           icon={LineChart}
//           title="Ventes"
//           view="sales"
//           isActive={activeView === 'sales'}
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
//     <div className="flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content Area */}
//       <div className={`
//         flex-1 
//         ${isSidebarOpen ? 'ml-64' : 'ml-20'} 
//         transition-all duration-300 ease-in-out
//       `}>
//         {/* Content with padding to account for sidebar */}
//         <div className="p-8">
//           {/* Sidebar and selected component will be side by side */}
//           <div className="flex">
//             {/* Selected Component View */}
//             <div className="flex-1">
//               {renderView()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminPage;

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { 
  Layers, 
  Tag, 
  Ruler,
  Users,
  ShoppingBag,
  LayoutGrid,
  ChevronRight,
  LogOut,
  Eye,
  LineChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CategoryManagement from '../components/AdminFonction/CategoryManagement';
import SizeManagement from '../components/AdminFonction/SizeManagement';
import SubCategoryManagement from '../components/AdminFonction/SubCategoryManagement';
import UserList from '../components/AdminFonction/UserList';
import ProductList from '../components/AdminFonction/ProductList';
import SalesManagement from '../components/AdminFonction/SalesManagement';
import { fetchProducts, fetchUser, logout, fetchAllUsers, fetchAllOrders } from '../utils/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showSales, setShowSales] = useState(false);
  
  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      const response = await logout();
      
      if (response.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        
        toast.success('Déconnexion réussie');
        navigate('/login');
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  // Vérification du rôle admin et récupération des informations de l'utilisateur
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Accès non autorisé");
      navigate("/");
      return;
    }
    
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
  }, [navigate]);

  // Dashboard sidebar card component
  const SidebarCard = ({ icon: Icon, title, view, isActive }) => (
    <div 
      onClick={() => setActiveView(view)}
      className={`
        flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300
        mt-10
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
        return <Dashboard 
          user={user} 
          loading={loading} 
          showProducts={showProducts} 
          setShowProducts={setShowProducts}
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          showSales={showSales}
          setShowSales={setShowSales}
          onLogout={handleLogout}
          setActiveView={setActiveView}
        />;
      case 'products':
        return <ProductList />;
      case 'categories':
        return <CategoryManagement />;
      case 'sizes':
        return <SizeManagement />;
      case 'subcategories':
        return <SubCategoryManagement />;
      case 'users':
        return <UserList />;
      case 'sales':
        return <SalesManagement />;
      default:
        return <Dashboard 
          user={user} 
          loading={loading} 
          showProducts={showProducts} 
          setShowProducts={setShowProducts}
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          showSales={showSales}
          setShowSales={setShowSales}
          onLogout={handleLogout}
          setActiveView={setActiveView}
        />;
    }
  };
  // Dashboard view for the main content area avec statistiques
  const Dashboard = ({ 
    user, 
    loading, 
    showProducts, 
    setShowProducts, 
    showUsers, 
    setShowUsers,
    showSales,
    setShowSales,
    onLogout,
    setActiveView
  }) => {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [totalSalesAmount, setTotalSalesAmount] = useState(0);
    const [users, setUsers] = useState([]);
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
          
          // Récupération des utilisateurs
          const usersData = await fetchAllUsers();
          if (usersData && usersData.users) {
            setUsers(usersData.users);
            setUserCount(usersData.users.length);
          }
          
          // Récupération des ventes
          const ordersData = await fetchAllOrders();
          if (ordersData && ordersData.success && ordersData.orders) {
            setOrderCount(ordersData.orders.length);
            
            // Calculer le montant total des ventes
            const totalAmount = ordersData.orders.reduce((total, order) => total + order.total, 0);
            setTotalSalesAmount(totalAmount);
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

    // Fonction pour basculer l'affichage des produits
    const toggleProductsView = () => {
      setShowProducts(!showProducts);
    };

    // Fonction pour basculer l'affichage des utilisateurs
    const toggleUsersView = () => {
      setShowUsers(!showUsers);
    };

    // Fonction pour basculer l'affichage des ventes
    const toggleSalesView = () => {
      setShowSales(!showSales);
    };

    // Fonction pour rediriger vers la vue complète des produits
    const goToProductsView = () => {
      setActiveView('products');
    };

    // Fonction pour rediriger vers la vue complète des utilisateurs
    const goToUsersView = () => {
      setActiveView('users');
    };

    // Fonction pour rediriger vers la vue complète des ventes
    const goToSalesView = () => {
      setActiveView('sales');
    };

    return (
      <div className="bg-amber-50 min-h-screen p-8">
        {/* Section d'information administrateur */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-700 mb-4">Informations Administrateur</h2>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200">
                  <img 
                    src={`http://localhost:8000${user.avatar?.url}`} 
                    alt="Avatar Admin" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=Admin";
                    }}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-amber-800">{user.username || user.name || "Administrateur"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-amber-600 mt-1">{user.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-500">Impossible de charger les informations administrateur</p>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-amber-800 mb-6">Tableau de Bord Principal</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Utilisateurs */}
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
                <div className="flex space-x-2 mt-3">
                  <button 
                    onClick={goToUsersView}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                  >
                    Vue complète
                  </button>
                  <button 
                    onClick={toggleUsersView}
                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showUsers ? "Masquer" : "Aperçu"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Carte Articles */}
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
                <div className="flex space-x-2 mt-3">
                  <button 
                    onClick={goToProductsView}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                  >
                    Vue complète
                  </button>
                  <button 
                    onClick={toggleProductsView}
                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showProducts ? "Masquer" : "Aperçu"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Carte Ventes */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-amber-700">Ventes</h2>
              <LineChart className="w-8 h-8 text-amber-600" />
            </div>
            {isLoading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                <p className="text-3xl font-bold text-amber-800">{orderCount}</p>
                <p className="text-sm text-gray-500">Commandes enregistrées</p>
                <p className="text-base font-semibold text-amber-700 mt-1">
                  Total: {totalSalesAmount.toFixed(2)} DA
                </p>
                <div className="flex space-x-2 mt-3">
                  <button 
                    onClick={goToSalesView}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                  >
                    Vue complète
                  </button>
                  <button 
                    onClick={toggleSalesView}
                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showSales ? "Masquer" : "Aperçu"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section pour afficher les produits dans le tableau de bord */}
        {showProducts && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Articles</h2>
            <ProductList />
          </div>
        )}

        {/* Section pour afficher les utilisateurs dans le tableau de bord */}
        {showUsers && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Utilisateurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.slice(0, 6).map((userData) => (
                <div 
                  key={userData._id} 
                  className="bg-white p-4 rounded-xl shadow-md border border-amber-100 flex items-center"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={`http://localhost:8000${userData.avatar?.url}`} 
                      alt={userData.username} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=User";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">{userData.username}</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                    <p className="text-xs text-amber-600">{userData.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section pour afficher les ventes dans le tableau de bord */}
        {showSales && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Aperçu des Ventes</h2>
            <SalesManagement showInDashboard={true} />
          </div>
        )}
      </div>
    );
  };

  // Sidebar component
  const Sidebar = () => (
    <div className={`
      bg-white border-r-2 border-amber-100 h-screen fixed left-0 top-0 bottom-0 
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      transition-all duration-300 ease-in-out z-10
    `}>
      <div className="flex items-center justify-between mb-8 px-6 pt-6">
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

      {/* Info utilisateur dans la sidebar */}
      {user && isSidebarOpen && (
        <div className="px-6 mb-6 pb-6 border-b border-amber-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200">
              <img 
                src={`http://localhost:8000${user.avatar?.url}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Admin";
                }}
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-amber-800">{user.username || user.name || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 px-4">
        <SidebarCard 
          icon={LayoutGrid}
          title="Tableau de Bord"
          view="dashboard"
          isActive={activeView === 'dashboard'}
        />
        <SidebarCard 
          icon={Users}
          title="Utilisateurs"
          view="users"
          isActive={activeView === 'users'}
        />
        <SidebarCard 
          icon={ShoppingBag}
          title="Articles"
          view="products"
          isActive={activeView === 'products'}
        />
        <SidebarCard 
          icon={LineChart}
          title="Ventes"
          view="sales"
          isActive={activeView === 'sales'}
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
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`
        flex-1 
        ${isSidebarOpen ? 'ml-64' : 'ml-20'} 
        transition-all duration-300 ease-in-out
      `}>
        {/* Content with padding to account for sidebar */}
        <div className="p-8">
          {/* Sidebar and selected component will be side by side */}
          <div className="flex">
            {/* Selected Component View */}
            <div className="flex-1">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;