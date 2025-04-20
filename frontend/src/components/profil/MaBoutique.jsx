// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchUser, fetchUserProducts, deleteProduct } from "../../utils/api";

// const MaBoutique = ({ searchTerm = "" }) => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [products, setProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [filteredProducts, setFilteredProducts] = useState([]);

//     useEffect(() => {
//         const getUserProducts = async () => {
//             try {
//                 setIsLoading(true);
//                 const userResponse = await fetchUser();
                
//                 if (userResponse.success && userResponse.user) {
//                     setUser(userResponse.user);
//                     // Passez l'ID de l'utilisateur pour récupérer ses produits
//                     const userProducts = await fetchUserProducts(userResponse.user._id);
//                     setProducts(userProducts);
//                     setFilteredProducts(userProducts);
//                 } else {
//                     // Gérer le cas où l'utilisateur n'est pas authentifié
//                     navigate("/login"); // Rediriger vers la page de connexion si nécessaire
//                 }
//             } catch (error) {
//                 console.error("Erreur lors de la récupération des produits :", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         getUserProducts();
//     }, [navigate]);

//     // Effet pour filtrer les produits quand searchTerm change
//     useEffect(() => {
//         if (searchTerm.trim() === "") {
//             setFilteredProducts(products);
//         } else {
//             const filtered = products.filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.description.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredProducts(filtered);
//         }
//     }, [searchTerm, products]);

//     const handleDelete = async (e, productId) => {
//         e.stopPropagation(); // Empêcher la navigation lors du clic sur le bouton supprimer
//         if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

//         const response = await deleteProduct(productId);
//         if (response.success) {
//             const updatedProducts = products.filter(product => product._id !== productId);
//             setProducts(updatedProducts);
//             setFilteredProducts(updatedProducts.filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.description.toLowerCase().includes(searchTerm.toLowerCase())
//             ));
//         } else {
//             alert("Erreur lors de la suppression du produit !");
//         }
//     };

//     // Navigation vers la page de détail du produit
//     const handleProductClick = (productId) => {
//         navigate(`/InfoProduct/${productId}`);
//     };

//     // Navigation vers la page d'édition du produit
//     const handleEditClick = (e, productId) => {
//         e.stopPropagation(); // Empêcher la navigation vers la page info produit
//         navigate(`/Sell/${productId}`);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center p-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
//             </div>
//         );
//     }

//     if (!user) {
//         return <p className="text-center text-amber-800 bg-amber-50 p-4 rounded-lg">Veuillez vous connecter pour voir vos produits</p>;
//     }

//     return (
//         <div className="max-w-6xl mx-auto p-4">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-amber-800">Ma Boutique</h2>
//                 <button
//                     onClick={() => navigate("/Sell")}
//                     className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center" >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                     </svg>
//                     Ajouter un produit
//                 </button>
//             </div>

//             {filteredProducts.length === 0 ? (
//                 <div className="bg-amber-50 rounded-xl p-12 text-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                     </svg>
//                     <h3 className="mt-4 text-xl font-semibold text-amber-800">
//                         {searchTerm ? "Aucun produit ne correspond à votre recherche" : "Vous n'avez pas encore de produits"}
//                     </h3>
//                     <p className="mt-2 text-gray-600">
//                         {searchTerm ? "Essayez avec d'autres termes" : "Commencez à vendre en ajoutant votre premier article"}
//                     </p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {filteredProducts.map((product) => (
//                         <div 
//                             key={product._id} 
//                             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-amber-100 cursor-pointer"
//                             onClick={() => handleProductClick(product._id)}
//                         >
//                             <div className="h-48 overflow-hidden relative">
//                                 <img
//                                     src={product.images[0]?.url ? `http://localhost:8000/${product.images[0].url}` : "/placeholder-product.png"}
//                                     alt={product.name}
//                                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                                 />
//                             </div>

//                             <div className="p-4">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
//                                 <p className="text-sm text-gray-600 h-12 overflow-hidden">{product.description}</p>

//                                 <div className="mt-4 flex justify-between items-center">
//                                     <p className="text-xl font-bold text-amber-700">{product.price} DA</p>
//                                     <div className="flex space-x-2">
//                                         <button
//                                             onClick={(e) => handleEditClick(e, product._id)}
//                                             className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             onClick={(e) => handleDelete(e, product._id)}
//                                             className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MaBoutique;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchUserProducts, deleteProduct } from "../../utils/api";

const MaBoutique = ({ searchTerm = "" }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const getUserProducts = async () => {
            try {
                setIsLoading(true);
                const userResponse = await fetchUser();
                
                if (userResponse.success && userResponse.user) {
                    setUser(userResponse.user);
                    // Récupérer tous les produits de l'utilisateur
                    const userProducts = await fetchUserProducts(userResponse.user._id);
                    // Filtrer pour ne garder que les produits disponibles
                    const availableProducts = userProducts.filter(product => product.etat === "disponible");
                    setProducts(availableProducts);
                    setFilteredProducts(availableProducts);
                } else {
                    // Gérer le cas où l'utilisateur n'est pas authentifié
                    navigate("/login"); // Rediriger vers la page de connexion si nécessaire
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserProducts();
    }, [navigate]);

    // Effet pour filtrer les produits quand searchTerm change
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleDelete = async (e, productId) => {
        e.stopPropagation(); // Empêcher la navigation lors du clic sur le bouton supprimer
        if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

        const response = await deleteProduct(productId);
        if (response.success) {
            const updatedProducts = products.filter(product => product._id !== productId);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            alert("Erreur lors de la suppression du produit !");
        }
    };

    // Navigation vers la page de détail du produit
    const handleProductClick = (productId) => {
        navigate(`/InfoProduct/${productId}`);
    };

    // Navigation vers la page d'édition du produit
    const handleEditClick = (e, productId) => {
        e.stopPropagation(); // Empêcher la navigation vers la page info produit
        navigate(`/Sell/${productId}`);
    };

    // Navigation vers la page des ventes
    const navigateToSoldProducts = () => {
        navigate("/MesVentes");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-amber-800 bg-amber-50 p-4 rounded-lg">Veuillez vous connecter pour voir vos produits</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-800">Ma Boutique</h2>
                <div className="flex space-x-3">
                   
                    <button
                        onClick={() => navigate("/Sell")}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center" 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter un produit
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-amber-50 rounded-xl p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-amber-800">
                        {searchTerm ? "Aucun produit ne correspond à votre recherche" : "Vous n'avez pas encore de produits disponibles"}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {searchTerm ? "Essayez avec d'autres termes" : "Commencez à vendre en ajoutant votre premier article"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div 
                            key={product._id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-amber-100 cursor-pointer"
                            onClick={() => handleProductClick(product._id)}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={product.images[0]?.url ? `http://localhost:8000/${product.images[0].url}` : "/placeholder-product.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-600 h-12 overflow-hidden">{product.description}</p>

                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-amber-700">{product.price} DA</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => handleEditClick(e, product._id)}
                                            className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, product._id)}
                                            className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MaBoutique;