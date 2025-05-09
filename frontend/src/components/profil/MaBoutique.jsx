import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchUserProducts, deleteProduct } from "../../utils/api";

const MaBoutique = ({ searchTerm = "" }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [animateEntry, setAnimateEntry] = useState(true);

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
            // Redémarrer l'animation quand les résultats de recherche changent
            setAnimateEntry(false);
            setTimeout(() => setAnimateEntry(true), 50);
        }
    }, [searchTerm, products]);

    // const handleDelete = async (e, productId) => {
    //     e.stopPropagation(); // Empêcher la navigation lors du clic sur le bouton supprimer
    //     if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    //     const response = await deleteProduct(productId);
    //     if (response.success) {
    //         // Animation de suppression
    //         const productElement = document.getElementById(`product-${productId}`);
    //         if (productElement) {
    //             productElement.classList.add('animate-delete');
    //             setTimeout(() => {
    //                 const updatedProducts = products.filter(product => product._id !== productId);
    //                 setProducts(updatedProducts);
    //                 setFilteredProducts(updatedProducts.filter(product =>
    //                     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                     product.description.toLowerCase().includes(searchTerm.toLowerCase())
    //                 ));
    //             }, 500);
    //         }
    //     } else {
    //         alert("Erreur lors de la suppression du produit !");
    //     }
    // };
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 h-64">
                <div className="relative">
                    <div className="animate-ping absolute h-16 w-16 rounded-full bg-amber-400 opacity-75"></div>
                    <div className="animate-spin relative h-16 w-16 rounded-full border-4 border-transparent border-t-amber-600 border-b-amber-600"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-amber-800 bg-amber-50 p-4 rounded-lg">Veuillez vous connecter pour voir vos produits</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-6 animate-slideInFromTop">
                <h2 className="text-2xl font-bold text-amber-800 relative">
                    Ma Boutique
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-500 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
                </h2>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate("/Sell")}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center transform hover:scale-105 hover:rotate-1 relative overflow-hidden group" 
                    >
                        <span className="absolute w-0 h-0 rounded-full bg-white opacity-10 transform scale-0 group-hover:scale-100 group-hover:w-96 group-hover:h-96 transition-all duration-700"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="relative z-10">Ajouter un produit</span>
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-amber-50 rounded-xl p-12 text-center animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    {filteredProducts.map((product, index) => (
                        <div 
                            id={`product-${product._id}`}
                            key={product._id} 
                            className={`bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 cursor-pointer flex flex-col
                                      ${animateEntry ? 'animate-productEntry' : ''}
                                      ${hoveredProductId === product._id ? 'z-10 transform scale-105 shadow-2xl' : 'z-0'}`}
                            onClick={() => handleProductClick(product._id)}
                            style={{
                                animationDelay: `${index * 120}ms`,
                                transformOrigin: 'center'
                            }}
                            onMouseEnter={() => setHoveredProductId(product._id)}
                            onMouseLeave={() => setHoveredProductId(null)}
                        >
                            <div className="relative w-full pt-[140%] overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`http://localhost:8000/${product.images[0].url}`}
                                        alt={product.name}
                                        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                                               ${hoveredProductId === product._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholder-product.png";
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="/placeholder-product.png"
                                        alt="Placeholder"
                                        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700
                                               ${hoveredProductId === product._id ? 'scale-110 filter brightness-110' : 'scale-100'}`}
                                    />
                                )}
                                
                                {/* Overlay au survol avec effet de gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                                           transition-opacity duration-300 
                                           ${hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'}`}>
                                </div>
                                
                                {/* Badge prix flottant */}
                                <div className={`absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg
                                            transform transition-all duration-500
                                            ${hoveredProductId === product._id ? 'translate-y-0 rotate-0 scale-110' : '-translate-y-20 rotate-12'}`}>
                                    {product.price} DA
                                </div>

                                {/* Actions au survol en bas de l'image */}
                                <div className={`absolute bottom-0 left-0 right-0 flex justify-center p-3 gap-4
                                            transform transition-all duration-500
                                            ${hoveredProductId === product._id ? 'translate-y-0' : 'translate-y-16'}`}>
                                    <button
                                        onClick={(e) => handleEditClick(e, product._id)}
                                        className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                                        aria-label="Modifier"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, product._id)}
                                        className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                                        aria-label="Supprimer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className={`p-4 flex-grow flex flex-col transition-all duration-300
                                        ${hoveredProductId === product._id ? 'bg-amber-50' : 'bg-white'}`}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-all duration-300
                                         relative group overflow-hidden">
                                    {product.name}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform transition-transform duration-300
                                              ${hoveredProductId === product._id ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes productEntry {
                    0% {
                        opacity: 0;
                        transform: perspective(1000px) rotateY(10deg) translateY(50px);
                        filter: blur(5px);
                    }
                    100% {
                        opacity: 1;
                        transform: perspective(1000px) rotateY(0) translateY(0);
                        filter: blur(0);
                    }
                }
                
                @keyframes slideInFromTop {
                    0% {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes delete {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.05) rotate(3deg);
                    }
                    100% {
                        transform: scale(0);
                        opacity: 0;
                    }
                }
                
                .animate-productEntry {
                    animation: productEntry 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                
                .animate-slideInFromTop {
                    animation: slideInFromTop 0.5s ease-out forwards;
                }
                
                .animate-delete {
                    animation: delete 0.5s forwards;
                }
            `}</style>
        </div>
    );
};

export default MaBoutique;