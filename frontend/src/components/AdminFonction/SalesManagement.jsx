
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Eye } from 'lucide-react';
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

  // Calculer le total des ventes
  const totalSales = orders.reduce((total, order) => total + order.total, 0);

  // Filtrer pour afficher uniquement les commandes récentes dans le tableau de bord
  const displayedOrders = showInDashboard ? orders.slice(0, 5) : orders;

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
              {orders.length} {orders.length > 1 ? 'commandes' : 'commande'}
            </p>
            <p className="text-amber-600 font-bold">
              Total: {totalSales.toFixed(2)} DA {/* Affichage en Dinar Algérien */}
            </p>
          </div>
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
      ) : orders.length === 0 ? (
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
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Acheteur</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Statut</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {displayedOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-amber-50 transition-colors cursor-pointer">
                      <td className="py-3 px-4 text-amber-800 font-medium">
                        #{order._id.substring(order._id.length - 6)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.user?.name || 'Utilisateur inconnu'}
                      </td>
                      <td className="py-3 px-4 text-amber-700 font-semibold">
                        {order.total.toFixed(2)} DA {/* Affichage en Dinar Algérien */}
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
                        <td colSpan="6" className="py-3 px-4 bg-amber-50">
                          <div className="px-4 py-2">
                            <h4 className="font-medium text-amber-700 mb-2">Articles ({order.items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-amber-200 flex">
                                  {item.product?.images && item.product.images.length > 0 && (
                                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                                      <img
                                        src={getImageUrl(item.product)} // Utilisation de la fonction pour obtenir l'URL de l'image
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "https://via.placeholder.com/150?text=Produit"; // Image de remplacement si aucune image n'est trouvée
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-amber-800">{item.product?.name || 'Produit inconnu'}</p>
                                    <div className="flex items-center mt-1">
                                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                        <img
                                          src={getImageUrl(item.product?.images[0])}  // Utilisation de la fonction getImageUrl pour l'image du produit
                                          alt={item.product?.name || "Image du produit"}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150?text=Produit"; // Image de remplacement si l'image produit est manquante
                                          }}
                                        />
                                      </div>
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

          {showInDashboard && orders.length > 5 && (
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
                      src={getImageUrl(selectedOrder.user?.avatar)}  // Utilisation de la fonction getImageUrl pour l'acheteur
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
                            src={getImageUrl(item.product)} // Utilisation de la fonction pour obtenir l'URL de l'image
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=Produit"; // Image de remplacement si aucune image n'est trouvée
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
                              src={getImageUrl(item.seller?.avatar)}  // Utilisation de la fonction getImageUrl pour le vendeur
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