import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchUserProducts } from "../../utils/api";

const MesVentes = ({ searchTerm = "" }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [soldProducts, setSoldProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const getUserSoldProducts = async () => {
            try {
                setIsLoading(true);
                const userResponse = await fetchUser();
                
                if (userResponse.success && userResponse.user) {
                    setUser(userResponse.user);
                    // Récupérer tous les produits de l'utilisateur
                    const userProducts = await fetchUserProducts(userResponse.user._id);
                    // Filtrer pour ne garder que les produits vendus
                    const sold = userProducts.filter(product => product.etat === "vendu");
                    setSoldProducts(sold);
                    setFilteredProducts(sold);
                } else {
                    // Gérer le cas où l'utilisateur n'est pas authentifié
                    navigate("/login"); // Rediriger vers la page de connexion si nécessaire
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des produits vendus :", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserSoldProducts();
    }, [navigate]);

    // Effet pour filtrer les produits quand searchTerm change
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(soldProducts);
        } else {
            const filtered = soldProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, soldProducts]);

    // Navigation vers la page de détail du produit
    const handleProductClick = (productId) => {
        navigate(`/InfoProduct/${productId}`);
    };

    // Navigation vers Ma Boutique
    const navigateToMyShop = () => {
        navigate("/MaBoutique");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-amber-800 bg-amber-50 p-4 rounded-lg">Veuillez vous connecter pour voir vos ventes</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800">Mes Ventes</h2>
                
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-green-50 rounded-xl p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-green-800">
                        {searchTerm ? "Aucun produit vendu ne correspond à votre recherche" : "Vous n'avez pas encore vendu de produits"}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {searchTerm ? "Essayez avec d'autres termes" : "Vos produits vendus s'afficheront ici une fois qu'ils seront marqués comme vendus"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div 
                            key={product._id} 
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100 cursor-pointer"
                            onClick={() => handleProductClick(product._id)}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={product.images[0]?.url ? `http://localhost:8000/${product.images[0].url}` : "/placeholder-product.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg">
                                    Vendu
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-600 h-12 overflow-hidden">{product.description}</p>

                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-green-700">{product.price} DA</p>
                                    <p className="text-sm text-gray-500">
                                        Vendu le {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MesVentes;