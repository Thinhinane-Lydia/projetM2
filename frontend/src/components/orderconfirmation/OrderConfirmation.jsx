import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaPrint, FaShoppingBag } from 'react-icons/fa';
 
 


const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Utilisez votre endpoint API existant pour récupérer les détails de la commande
        const { data } = await axios.get(`/api/v2/order/get-order/${orderId}`, {
          withCredentials: true
        });
        
        if (data.success) {
          setOrder(data.order);
        } else {
          setError("Impossible de récupérer les détails de la commande");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
        setError("Une erreur est survenue lors de la récupération de la commande");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("Numéro de commande manquant");
      setLoading(false);
    }
  }, [orderId]);

  const handlePrintInvoice = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button
            className={styles.returnButton}
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.confirmationContainer}>
        <div className={styles.confirmationHeader}>
          <FaCheckCircle size={60} color="#2ecc71" />
          <h1>Commande Confirmée!</h1>
          <p>Merci pour votre achat. Votre commande a bien été enregistrée.</p>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.orderDetails}>
            <h2>Détails de la commande</h2>
            <div className={styles.orderInfoGrid}>
              <div>
                <p><strong>Numéro de commande:</strong></p>
                <p><strong>Date:</strong></p>
                <p><strong>Statut:</strong></p>
                <p><strong>Mode de paiement:</strong></p>
              </div>
              <div>
                <p>{order.orderNumber || orderId}</p>
                <p>{formatDate(order.createdAt)}</p>
                <p>{order.status}</p>
                <p>{order.paymentInfo.type}</p>
              </div>
            </div>
          </div>

          <div className={styles.shippingDetails}>
            <h2>Informations de livraison</h2>
            <div className={styles.address}>
              <p><strong>{order.shippingAddress.name}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p><strong>Téléphone:</strong> {order.shippingAddress.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h2>Récapitulatif de la commande</h2>
          <div className={styles.productList}>
            <div className={styles.productHeader}>
              <span>Produit</span>
              <span>Prix unitaire</span>
              <span>Quantité</span>
              <span>Total</span>
            </div>
            
            {order.cart.map((item) => (
              <div key={item._id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <img 
                    src={item.images[0]?.url || '/placeholder.png'} 
                    alt={item.name} 
                    className={styles.productImage} 
                  />
                  <span>{item.name}</span>
                </div>
                <span>{item.price.toFixed(2)} €</span>
                <span>{item.qty}</span>
                <span>{(item.price * item.qty).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className={styles.orderTotal}>
            <div className={styles.totalRow}>
              <span>Sous-total:</span>
              <span>{order.totalPrice.toFixed(2)} €</span>
            </div>
            <div className={styles.totalRow}>
              <span>Frais de livraison:</span>
              <span>{order.shippingPrice.toFixed(2)} €</span>
            </div>
            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
              <span>Total:</span>
              <span>{(order.totalPrice + order.shippingPrice).toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={styles.printButton} 
            onClick={handlePrintInvoice}
          >
            <FaPrint /> Imprimer la facture
          </button>
          <button 
            className={styles.continueButton}
            onClick={() => navigate('/')}
          >
            <FaShoppingBag /> Continuer mes achats
          </button>
        </div>

        <div className={styles.helpSection}>
          <h3>Besoin d'aide?</h3>
          <p>
            Pour toute question concernant votre commande, n'hésitez pas à 
            <a href="/messages"> nous contacter</a>.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;