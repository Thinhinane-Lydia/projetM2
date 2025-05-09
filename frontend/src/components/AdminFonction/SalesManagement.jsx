import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Eye, ArrowUpDown, ArrowUp, ArrowDown, Filter, Search } from 'lucide-react';
import { fetchAllOrders } from '../../utils/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SalesManagement = ({ showInDashboard = false }) => {
  // Définir la base URL pour les images
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Nouveaux états pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllOrders();
        if (response && response.success) {
          setOrders(response.orders);
        } else {
          setError("Impossible de charger les ventes");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des ventes:", err);
        setError("Une erreur est survenue lors du chargement des ventes");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (product) => {
    if (!product || !product.images) return null;

    // Vérifie si l'URL de l'image existe
    if (product.images.length > 0 && product.images[0].url) {
      return `http://localhost:8000/${product.images[0].url}`; // Ajouter le chemin complet de l'image
    }

    return "/placeholder-product.png"; // Image de remplacement si aucune image n'est disponible
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (err) {
      return 'Date invalide';
    }
  };

  // Fonction de tri
  const handleSort = (field) => {
    if (sortField === field) {
      // Si on clique sur le même champ, on inverse la direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, on change de champ et on met la direction par défaut
      setSortField(field);
      setSortDirection('desc');
    }
    // Réinitialiser la pagination
    setCurrentPage(1);
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

  // Filtrage des commandes
  const filteredOrders = orders.filter(order => {
    // Filtre par terme de recherche (recherche dans l'ID de commande et le nom de l'acheteur)
    const searchMatch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const statusMatch = statusFilter === '' || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Tri des commandes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    switch (sortField) {
      case 'date':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      case 'total':
        valueA = a.total || 0;
        valueB = b.total || 0;
        break;
      case 'items':
        valueA = a.items?.length || 0;
        valueB = b.items?.length || 0;
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
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = showInDashboard 
    ? sortedOrders.slice(0, 5) 
    : sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculer le total des ventes
  const totalSales = orders.reduce((total, order) => total + order.total, 0);

  // Récupérer les statuts uniques pour le filtre
  const uniqueStatuses = [...new Set(orders.map(order => order.status))];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="w-7 h-7 text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-700">Gestion des Ventes</h2>
        </div>
        {!isLoading && (
          <div className="text-right">
            <p className="text-amber-800 font-semibold">
              {filteredOrders.length} {filteredOrders.length > 1 ? 'commandes' : 'commande'}
            </p>
            <p className="text-amber-600 font-bold">
              Total: {totalSales.toFixed(2)} DA
            </p>
          </div>
        )}
      </div>

      {/* Recherche et filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-700"
          >
            <option value="">Tous les statuts</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Options de tri */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="text-sm text-amber-700 font-medium flex items-center mr-2">
          <Filter className="w-4 h-4 mr-1" /> Trier par:
        </div>
        <button
          onClick={() => handleSort('date')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'date' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Date <SortIcon field="date" />
        </button>
        <button
          onClick={() => handleSort('total')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'total' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Montant <SortIcon field="total" />
        </button>
        <button
          onClick={() => handleSort('items')}
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            sortField === 'items' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Articles <SortIcon field="items" />
        </button>
        {sortField && (
          <button
            onClick={() => {
              setSortField(null);
              setSortDirection('desc');
            }}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Chargement et erreurs */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-600">Chargement des ventes...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">Aucune vente trouvée</p>
        </div>
      ) : (
        <>
          {/* Liste des commandes */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-amber-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">N° Commande</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800 cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Acheteur</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800 cursor-pointer" onClick={() => handleSort('total')}>
                    <div className="flex items-center">
                      Total
                      <SortIcon field="total" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Statut</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800 cursor-pointer" onClick={() => handleSort('items')}>
                    <div className="flex items-center">
                      Articles
                      <SortIcon field="items" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {currentOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-amber-50 transition-colors cursor-pointer">
                      <td className="py-3 px-4 text-amber-800 font-medium">
                        #{order._id.substring(order._id.length - 6)}
                      </td>
                      <td className={`py-3 px-4 text-gray-700 ${sortField === 'date' ? 'font-medium text-amber-700' : ''}`}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.user?.name || 'Utilisateur inconnu'}
                      </td>
                      <td className={`py-3 px-4 text-amber-700 font-semibold ${sortField === 'total' ? 'font-medium text-amber-800' : ''}`}>
                        {order.total.toFixed(2)} DA
                      </td>
                      <td className="py-3 px-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'Livrée' ? 'bg-green-100 text-green-800' :
                            order.status === 'En transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-gray-700 ${sortField === 'items' ? 'font-medium text-amber-700' : ''}`}>
                        {order.items?.length || 0}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShowDetails(order)}
                            className="p-1 text-amber-600 hover:text-amber-800"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(order._id);
                            }}
                            className="p-1 text-amber-600 hover:text-amber-800"
                            title="Voir les articles"
                          >
                            {expandedOrderId === order._id ?
                              <ChevronUp className="w-5 h-5" /> :
                              <ChevronDown className="w-5 h-5" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan="7" className="py-3 px-4 bg-amber-50">
                          <div className="px-4 py-2">
                            <h4 className="font-medium text-amber-700 mb-2">Articles ({order.items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-amber-200 flex">
                                  {item.product?.images && item.product.images.length > 0 && (
                                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                                      <img
                                        src={getImageUrl(item.product)}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "https://via.placeholder.com/150?text=Produit";
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-amber-800">{item.product?.name || 'Produit inconnu'}</p>
                                    <div className="flex items-center mt-1">
                                      <p className="text-sm text-gray-600">Vendu par: {item.seller?.name || 'Vendeur inconnu'}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-amber-700 mt-1">{item.price.toFixed(2)} DA</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - seulement si ce n'est pas le tableau de bord */}
          {!showInDashboard && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commandes
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
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
          )}

          {showInDashboard && filteredOrders.length > 5 && (
            <div className="mt-4 text-center">
              <a
                href="/admin/sales"
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors inline-block"
              >
                Voir toutes les ventes
              </a>
            </div>
          )}
        </>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-amber-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-amber-800">
                  Détails de la commande #{selectedOrder._id.substring(selectedOrder._id.length - 6)}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-amber-800"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Informations sur la commande */}
              <div className="mb-6">
                <h4 className="font-semibold text-amber-700 mb-2">Informations générales</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date de commande</p>
                    <p className="text-amber-800">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="text-amber-800">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-amber-800 font-semibold">{selectedOrder.total.toFixed(2)} DA</p>
                  </div>
                </div>
              </div>

              {/* Acheteur */}
              <div className="mb-6">
                <h4 className="font-semibold text-amber-700 mb-2">Acheteur</h4>
                <div className="flex items-center bg-amber-50 p-3 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img
                      src={getImageUrl(selectedOrder.user?.avatar)}
                      alt={selectedOrder.user?.name || 'Acheteur'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=User";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">{selectedOrder.user?.name || 'Utilisateur inconnu'}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.email || 'Email inconnu'}</p>
                  </div>
                </div>
              </div>

              {/* Adresse de livraison */}
              {selectedOrder.shippingAddress && (
                <div className="mb-6">
                  <h4 className="font-semibold text-amber-700 mb-2">Adresse de livraison</h4>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Articles */}
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Articles ({selectedOrder.items.length})</h4>
                <div className="divide-y divide-amber-100">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="py-4 flex">
                      {item.product?.images && item.product.images.length > 0 && (
                        <div className="w-20 h-20 rounded overflow-hidden mr-4">
                          <img
                            src={getImageUrl(item.product)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=Produit";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-amber-800">{item.product?.name || 'Produit inconnu'}</p>
                          <p className="font-semibold text-amber-700">{item.price.toFixed(2)} DA</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.product?.description?.substring(0, 100) || 'Sans description'}...</p>
                        <div className="mt-2 flex items-center">
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                            <img
                              src={getImageUrl(item.seller?.avatar)}
                              alt={item.seller?.name || 'Vendeur'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150?text=Seller";
                              }}
                            />
                          </div>
                          <p className="text-xs text-amber-600">Vendu par: {item.seller?.name || 'Vendeur inconnu'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-amber-100 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;