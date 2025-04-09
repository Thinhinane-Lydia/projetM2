import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const receiptRef = useRef(null);

  useEffect(() => {
    // Récupération des détails de la commande depuis le localStorage
    const storedOrderDetails = localStorage.getItem('orderDetails');
    
    if (storedOrderDetails) {
      try {
        const parsedDetails = JSON.parse(storedOrderDetails);
        setOrderDetails(parsedDetails);
      } catch (error) {
        console.error('Erreur lors du parsing des détails de commande:', error);
      }
    } else {
      // Rediriger vers la page d'accueil si aucune donnée de commande n'est trouvée
      navigate('/');
    }
    
    setIsLoading(false);
    
    // Nettoyer le panier après l'affichage de la confirmation
    return () => {
      // Cette logique pourrait être déplacée vers un bouton "Retour à l'accueil" si vous préférez
      // localStorage.removeItem('orderDetails');
    };
  }, [navigate]);

  // Fonction pour télécharger le reçu en PDF
  const handleDownloadReceipt = () => {
    // Chargement dynamique de html2pdf.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    
    script.onload = () => {
      const element = document.getElementById('receipt-content');
      const opt = {
        margin: 10,
        filename: `recu-paiement-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Utilisation de window.html2pdf pour éviter les erreurs TypeScript/ESLint
      window.html2pdf().set(opt).from(element).save();
    };
    
    document.body.appendChild(script);
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Animations
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4">
        <h1 className="text-2xl font-semibold text-amber-800 mb-4">Aucune commande trouvée</h1>
        <p className="text-gray-600 mb-6">Nous n'avons pas pu récupérer les détails de votre commande.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      {/* Header avec logo */}
      <motion.div 
        className="bg-white shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-amber-800">Mon Paiement</h1>
            <button 
              onClick={() => navigate('/')}
              className="text-amber-800 hover:text-amber-600 transition-colors duration-300"
            >
              Accueil
            </button>
          </div>
        </div>
      </motion.div>

      {/* Fil d'Ariane */}
      <div className="container mx-auto py-4 px-4 text-sm text-gray-500">
        <span className="text-amber-800 hover:text-amber-600 cursor-pointer" onClick={() => navigate('/')}>Accueil</span> &gt; 
        <span className="text-amber-800 hover:text-amber-600 cursor-pointer" onClick={() => navigate('/cart')}> Panier</span> &gt; 
        <span className="text-amber-800 hover:text-amber-600 cursor-pointer" onClick={() => navigate('/checkout')}> Paiement</span> &gt; 
        <span className="text-amber-800 font-semibold"> Confirmation</span>
      </div>

      <motion.div 
        className="container mx-auto py-6 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8 mx-auto max-w-3xl"
          variants={staggerContainer}
        >
          {/* Contenu du reçu à télécharger */}
          <div id="receipt-content" ref={receiptRef}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-amber-800 mb-2">Reçu de paiement</h1>
              <div className="mb-4 text-5xl text-green-500">✓</div>
              <p className="text-gray-600">Commande confirmée le {formatDate(new Date())}</p>
            </div>

 

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-200">Résumé de la commande</h2>
              <div className="space-y-2">
                {orderDetails.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <div>
                      <span className="font-medium">{item.product?.name}</span>
                    </div>
                    <div className="font-medium">{item.product?.price.toFixed(2)} DA</div>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Sous-total</span>
                  <span>{(orderDetails.orderTotal - (orderDetails.shippingMethod === 'standard' ? 400 : 800)).toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Frais de livraison</span>
                  <span>{(orderDetails.shippingMethod === 'standard' ? 400 : 800).toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-amber-800 border-t border-gray-200 mt-2 pt-2">
                  <span>Total</span>
                  <span>{orderDetails.orderTotal.toFixed(2)} DA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-200">Détails de livraison</h2>
                <p className="mb-2"><strong>Adresse:</strong> {orderDetails.shippingInfo?.address}, {orderDetails.shippingInfo?.postalCode} {orderDetails.shippingInfo?.city}, {orderDetails.shippingInfo?.wilaya}</p>
                <p className="mb-2"><strong>Mode de livraison:</strong> {orderDetails.shippingMethod === 'standard' ? 'Livraison standard (3-5 jours)' : 'Livraison express (1-2 jours)'}</p>
                <p className="mb-2"><strong>Date estimée de livraison:</strong> {
                  orderDetails.shippingMethod === 'standard' 
                    ? formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))
                    : formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))
                }</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-200">Détails du paiement</h2>
                <p className="mb-2"><strong>Méthode de paiement:</strong> {
                  orderDetails.paymentMethod === 'card' ? 'Carte bancaire (CIB, EDAHABIA)' : 
                  orderDetails.paymentMethod === 'ccp' ? 'CCP (Chèque Postal)' : 
                  'Paiement à la livraison'
                }</p>
                {orderDetails.paymentMethod === 'card' && (
                  <p className="mb-2"><strong>Numéro de carte:</strong> **** **** **** {orderDetails.paymentDetails?.cardNumber?.slice(-4) || '****'}</p>
                )}
                <p className="mb-2"><strong>Statut du paiement:</strong> <span className="text-green-500 font-semibold">Payé</span></p>
              </div>
            </div>

            {/* Pied de page du reçu */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Mon Paiement - Document généré le {formatDate(new Date())}</p>
              <p>Ce reçu sert de preuve de paiement pour votre commande.</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mt-6" variants={fadeIn}>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors duration-300"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-300"
            >
              Télécharger le reçu
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;