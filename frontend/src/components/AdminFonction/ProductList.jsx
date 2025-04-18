import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCommentsByProduct, deleteProduct, fetchUser } from '../../utils/api';
import { Edit, Trash2, Search, Eye, ShoppingBag, Star, Shield, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductDetail from '../InfoProduct/ProductDetail'; // Ajustez le chemin selon votre structure

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productsWithRatings, setProductsWithRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [ratings, setRatings] = useState({});
  const [avatarErrors, setAvatarErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // États pour gérer la popup de détail produit
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);

  // États pour les filtres de tri
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await fetchUser();
        if (userData && userData.user) {
          setCurrentUser(userData.user);
          setIsAdmin(userData.user.role === 'admin');
          console.log("Statut admin:", userData.user.role === 'admin');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des informations utilisateur:", err);
      }
    };

    getCurrentUser();
  }, []);

  // Fonction pour calculer la moyenne des ratings
  const calculateAverageRating = (comments) => {
    if (!comments || comments.length === 0) return 0;
    
    const validRatings = comments.filter(comment => 
      comment.rating !== null && comment.rating !== undefined && !isNaN(comment.rating)
    );
    
    if (validRatings.length === 0) return 0;
    
    const totalRating = validRatings.reduce((acc, comment) => acc + parseFloat(comment.rating), 0);
    return totalRating / validRatings.length;
  };

  // Fonction pour rendre l'avatar du vendeur
  const renderSellerAvatar = (seller, productId) => {
    if (!seller) {
      return (
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-amber-600">?</span>
        </div>
      );
    }

    const isAvatarError = avatarErrors[productId];

    if (seller.avatar && !isAvatarError) {
      let avatarUrl;
      
      if (typeof seller.avatar === 'object' && seller.avatar.url) {
        avatarUrl = seller.avatar.url.startsWith("http") 
          ? seller.avatar.url 
          : `http://localhost:8000${seller.avatar.url}`;
      } else if (typeof seller.avatar === 'string') {
        avatarUrl = seller.avatar.startsWith("http") 
          ? seller.avatar 
          : `http://localhost:8000/${seller.avatar}`;
      } else {
        return (
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-amber-600">
              {seller.name?.charAt(0) || "?"}
            </span>
          </div>
        );
      }

      return (
        <img
          src={avatarUrl}
          alt={seller.name || "Vendeur"}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200"
          onError={() => {
            setAvatarErrors(prev => ({
              ...prev,
              [productId]: true
            }));
          }}
        />
      );
    }

    // Fallback: affiche la première lettre du nom du vendeur
    return (
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-amber-600">
          {seller.name?.charAt(0) || "?"}
        </span>
      </div>
    );
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts();
        
        if (response && response.products) {
          setProducts(response.products);
          
          // Récupérer le nombre de commentaires et la moyenne des ratings pour chaque produit
          const commentsData = {};
          const ratingsData = {};
          
          await Promise.all(
            response.products.map(async (product) => {
              try {
                const comments = await fetchCommentsByProduct(product._id);
                commentsData[product._id] = comments.length;
                
                // Calculer la moyenne des ratings
                ratingsData[product._id] = calculateAverageRating(comments);
              } catch (error) {
                console.error(`Erreur lors de la récupération des commentaires pour ${product._id}:`, error);
                commentsData[product._id] = 0;
                ratingsData[product._id] = 0;
              }
            })
          );
          
          setCommentCounts(commentsData);
          setRatings(ratingsData);
          
          // Associer les ratings aux produits
          const productsWithRatingsData = response.products.map(product => ({
            ...product,
            rating: ratingsData[product._id] || 0,
            ratingCount: commentsData[product._id] || 0
          }));
          
          setProductsWithRatings(productsWithRatingsData);
          console.log("Produits chargés avec évaluations:", productsWithRatingsData.length);
        } else {
          setError("Format de réponse incorrect");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Fonction de tri des produits
  const handleSort = (field) => {
    if (sortField === field) {
      // Si on clique sur le même champ, on inverse la direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, on change de champ et on met la direction par défaut
      setSortField(field);
      setSortDirection('desc'); // Par défaut, prix le plus élevé d'abord
    }
    // Réinitialiser la pagination
    setCurrentPage(1);
  };

  // Filtrer les produits selon le terme de recherche
  const filteredProducts = productsWithRatings.filter(product => {
    const title = product.title || product.name || '';
    const description = product.description || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Trier les produits filtrés
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    switch (sortField) {
      case 'price':
        valueA = a.price || 0;
        valueB = b.price || 0;
        break;
      case 'rating':
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      case 'comments':
        valueA = a.ratingCount || 0;
        valueB = b.ratingCount || 0;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  // Logique de pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Vérifier si l'utilisateur peut supprimer un produit (propriétaire ou admin)
  const canDeleteProduct = (product) => {
    if (!currentUser || !product.seller) return false;
    return isAdmin || (product.seller._id === currentUser._id);
  };

  // Ouvrir la popup de détail produit (pour admin) ou naviguer vers la page de détail (pour utilisateurs)
  const handleViewProduct = (productId) => {
    if (isAdmin) {
      setSelectedProductId(productId);
      setShowProductPopup(true);
    } else {
      navigate(`/InfoProduct/${productId}`);
    }
  };

  // Fermer la popup
  const handleClosePopup = () => {
    setShowProductPopup(false);
    setSelectedProductId(null);
  };

  // Gérer la suppression d'un produit depuis la liste
  const handleDelete = async (productId) => {
    if (confirmDelete === productId) {
      try {
        const response = await deleteProduct(productId);
        if (response && response.success) {
          setProductsWithRatings(productsWithRatings.filter(product => product._id !== productId));
          setProducts(products.filter(product => product._id !== productId));
          toast.success("Produit supprimé avec succès");
        } else {
          toast.error(response?.message || "Erreur lors de la suppression");
        }
      } catch (err) {
        console.error("Erreur lors de la suppression du produit:", err);
        toast.error("Erreur lors de la suppression");
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(productId);
      // Timer pour réinitialiser l'état de confirmation après 3 secondes
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Gérer la suppression d'un produit depuis la popup
  const handleProductDeleted = (productId) => {
    setProductsWithRatings(productsWithRatings.filter(product => product._id !== productId));
    setProducts(products.filter(product => product._id !== productId));
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(price);
  };

  // Composant pour afficher les étoiles de rating
  const RatingDisplay = ({ rating }) => {
    const ratingValue = parseFloat(rating) || 0;
    return (
      <div className="flex items-center">
        <Star className={`w-4 h-4 ${ratingValue >= 1 ? 'text-amber-500 fill-amber-500' : 'text-amber-300'}`} />
        <span className="ml-1 text-xs text-gray-600">{ratingValue.toFixed(1)}</span>
      </div>
    );
  };

  // Composant pour afficher l'icône de tri
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-amber-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-amber-600" />
      : <ArrowDown className="w-4 h-4 ml-1 text-amber-600" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
      {/* Afficher la popup de détail produit si nécessaire */}
      {showProductPopup && selectedProductId && (
        <ProductDetail 
          productId={selectedProductId} 
          isPopup={true}
          onClose={handleClosePopup}
          onProductDeleted={handleProductDeleted}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShoppingBag className="w-6 h-6 text-amber-600 mr-2" />
          <h2 className="text-xl font-semibold text-amber-700">Liste des Produits</h2>
          {isAdmin && (
            <div className="ml-3 flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Mode Admin
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Options de filtre */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="text-sm text-amber-700 font-medium flex items-center mr-2">
          Filtres:
        </div>
        <button
          onClick={() => handleSort('price')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'price' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Prix <SortIcon field="price" />
        </button>
        <button
          onClick={() => handleSort('rating')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'rating' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Évaluation <SortIcon field="rating" />
        </button>
        <button
          onClick={() => handleSort('comments')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'comments' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Commentaires <SortIcon field="comments" />
        </button>
        {sortField && (
          <button
            onClick={() => {
              setSortField(null);
              setSortDirection('asc');
            }}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {productsWithRatings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun produit disponible</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Prix
                      <SortIcon field="price" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Vendeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('rating')}>
                    <div className="flex items-center">
                      Évaluation
                      <SortIcon field="rating" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('comments')}>
                    <div className="flex items-center">
                      Commentaires
                      <SortIcon field="comments" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-amber-100">
                        {product.images && product.images.length > 0 ? (
                        <img
                        src={
                          product.images && product.images[0]?.url?.startsWith("http")
                            ? product.images[0].url
                            : `http://localhost:8000/${product.images[0]?.url}`
                        }
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x300?text=Pas+d'image";
                        }}
                      />
                      
                        ) : (
                          <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                            <span className="text-amber-400 text-xs">Aucune image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.title || product.name || "Sans titre"}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{product.description || "Aucune description"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className={sortField === 'price' ? 'font-medium text-amber-700' : ''}>
                        {formatPrice(product.price || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderSellerAvatar(product.seller, product._id)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {product.seller?.name || "Utilisateur inconnu"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={sortField === 'rating' ? 'font-medium text-amber-700' : ''}>
                        <RatingDisplay rating={product.rating || 0} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className={sortField === 'comments' ? 'font-medium text-amber-700' : ''}>
                        {product.ratingCount || 0} avis
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-amber-600 hover:text-amber-900"
                          onClick={() => handleViewProduct(product._id)}
                          title={isAdmin ? "Voir (Admin)" : "Voir"}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {(isAdmin || (currentUser && product.seller && product.seller._id === currentUser._id)) && (
                          <button 
                            className={`${confirmDelete === product._id ? 'text-red-600' : 'text-gray-400'} hover:text-red-900`}
                            onClick={() => handleDelete(product._id)}
                            title={isAdmin ? "Supprimer (Admin)" : "Supprimer"}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Affichage de {indexOfFirstProduct + 1} à {Math.min(indexOfLastProduct, sortedProducts.length)} sur {sortedProducts.length} produits
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === i + 1
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;