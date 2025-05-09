
import React, { useState, useEffect } from 'react';
import { useCart } from '../components/cart/Cart';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
 // Import Header and Footer components
import Header from "../components/Layout/Header";
import Footer from '../components/Layout/Footer';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('payment');
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour le formulaire de livraison
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    wilaya: 'Alger',
  });
  
  // États pour les options de livraison et paiement
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  
  const [ccpInfo, setCcpInfo] = useState({
    ccpNumber: '',
    ccpKey: '',
    holderName: '',
  });
  
  // Animation de chargement
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    // Simuler un court délai pour l'animation de chargement
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);
  }, []);
  
  // Calcul des coûts
  const subtotal = cart.reduce((total, item) => total + (item.product?.price || 0)  , 0);
  const shippingCost = shippingMethod === 'standard' ? 400 : 
                       shippingMethod === 'express' ? 800 : 0;
 
  const total = subtotal + shippingCost;

  // Gestion des changements pour les formulaires
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCcpChange = (e) => {
    const { name, value } = e.target;
    setCcpInfo(prev => ({ ...prev, [name]: value }));
  };

  // Validation du formulaire
// Ajoutez ce state pour gérer l'affichage des notifications
const [toast, setToast] = useState({
  visible: false,
  message: '',
});

// Modifiez votre fonction de validation pour utiliser le toast au lieu de l'alerte
const validateForm = () => {
  // Validation basique des champs obligatoires
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'postalCode', 'city'];
  for (const field of requiredFields) {
    if (!shippingInfo[field]) {
      setToast({
        visible: true,
        message: `Veuillez compléter tous les champs du formulaire de paiement avant de continuer.`
      });
      setTimeout(() => setToast({ visible: false, message: '' }), 5000); // Disparaît après 5 secondes
      return false;
    }
  }

  // Le reste de votre validation...
  return true;
};
  // Fonction pour gérer la navigation entre les étapes
  const handleStepNavigation = (step) => {
    if (step === 'cart') {
      navigate('/cart');
    } else if (step === 'payment') {
      setCurrentStep('payment');
    } else if (step === 'confirmation') {
      if (validateForm()) {
        setCurrentStep('confirmation');
        handleCheckout();
      } else {
        alert('Veuillez compléter tous les champs du formulaire de paiement avant de continuer.');
      }
    }
  };

  // Soumission de la commande
  const handleCheckout = async () => {
    if (!validateForm()) return;
  
    try {
      setIsProcessing(true);
      
      // Formatage de l'adresse en une seule chaîne de caractères
      const formattedAddress = `${shippingInfo.address}, ${shippingInfo.postalCode} ${shippingInfo.city}, ${shippingInfo.wilaya}`;
      
      // Préparation des données à envoyer
      const orderData = {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        shippingAddress: formattedAddress,
        shippingMethod,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardInfo : 
                        paymentMethod === 'ccp' ? ccpInfo : null,
        orderItems: cart.map(item => ({
          productId: item.product.id || item.product._id,
        
          price: item.product.price
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      };
  
      console.log("Données de commande envoyées:", orderData);
      
      const response = await axios.post(
        'http://localhost:8000/api/v2/order/checkout',
        orderData,
        { 
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      console.log("Réponse du serveur:", response.data);
  
      if (response.status === 201 || response.status === 200) {
        // Stockage des infos de commande pour la page de confirmation
        localStorage.setItem('orderDetails', JSON.stringify({
          orderId: response.data.orderId || 'N/A',
          orderDate: new Date().toISOString(),
          orderTotal: total,
          shippingInfo,
          shippingMethod,
          paymentMethod,
          orderItems: cart
        }));
        
        navigate('/OrderConfirmation');
      }
    } catch (error) {
      console.error('Erreur lors de la commande', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      alert('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Liste des wilayas d'Algérie
  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
    'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
    'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
    'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
    'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
    'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
    'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
    'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El Meghaier', 'El Meniaa'
  ].sort();

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

  return (
    <div className="bg-amber-50 min-h-screen font-sans mb-10">
        {/* Add Header component */}
        <Header showCategories={false} setSearchTerm={setSearchTerm} 
        showAdCarousel={false}/>
 

      {/* En-tête avec étapes cliquables */}
      <motion.div 
        className="container mx-auto py-6 px-4"
        initial="hidden"
        animate={isPageLoaded ? "visible" : "hidden"}
        variants={fadeIn}
      >
 

<motion.div 
  className="mb-8 py-6 relative"
  variants={fadeIn}
>
  <div className="flex justify-between items-center">
    <div className="w-full max-w-lg relative">
      {/* Ligne grise de fond */}
      <div className="absolute h-0.5 bg-gray-200 w-full top-5 left-0"></div>
      
      {/* Ligne colorée de progression qui s'ajuste selon l'étape actuelle */}
      <div 
        className={`absolute h-0.5 bg-amber-600 top-5 left-0 transition-all duration-500 ease-in-out`}
        style={{ 
          width: currentStep === 'cart' ? '0%' : 
                 currentStep === 'payment' ? '50%' : '100%' 
        }}
      ></div>
      
      <div className="flex justify-between items-center relative z-10">
        {/* Étape 1: Panier */}
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          onClick={() => handleStepNavigation('cart')}
        >
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 cursor-pointer transition-all duration-300 ${
              currentStep === 'cart' 
                ? 'bg-amber-600 border-2 border-amber-600 text-white' 
                : 'bg-amber-600 border-2 border-amber-600 text-white'
            }`}
          >
            1
          </div>
          <span 
            className={`text-xs font-medium ${
              currentStep === 'cart' ? 'text-amber-700' : 'text-amber-600'
            }`}
          >
            Panier
          </span>
        </motion.div>
        
        {/* Étape 2: Paiement */}
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          onClick={() => handleStepNavigation('payment')}
        >
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 cursor-pointer transition-all duration-300 ${
              currentStep === 'payment' || currentStep === 'confirmation'
                ? 'bg-amber-600 border-2 border-amber-600 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}
          >
            2
          </div>
          <span 
            className={`text-xs font-medium ${
              currentStep === 'payment' ? 'text-amber-700' : currentStep === 'confirmation' ? 'text-amber-600' : 'text-gray-400'
            }`}
          >
            Paiement
          </span>
        </motion.div>
        
        {/* Étape 3: Confirmation */}
        <motion.div 
          className="flex flex-col items-center"
        >
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 cursor-pointer transition-all duration-300 ${
              currentStep === 'confirmation' 
                ? 'bg-amber-600 border-2 border-amber-600 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}
          >
            3
          </div>
          <span 
            className={`text-xs font-medium ${
              currentStep === 'confirmation' ? 'text-amber-700' : 'text-gray-400'
            }`}
          >
            Confirmation
          </span>
        </motion.div>
      </div>
    </div>
    
 
  </div>
</motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Formulaire côté gauche */}
          <motion.div 
            className="w-full md:w-2/3"
            variants={staggerContainer}
            initial="hidden"
            animate={isPageLoaded ? "visible" : "hidden"}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              variants={fadeIn}
              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-amber-800">Adresse de livraison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                    Prénom*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                    Nom*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                    Téléphone*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                    Adresse*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postalCode">
                    Code postal*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                    Ville*
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="wilaya">
                    Wilaya*
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                    id="wilaya"
                    name="wilaya"
                    value={shippingInfo.wilaya}
                    onChange={handleShippingChange}
                    required
                  >
                    {wilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <input
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                  type="checkbox"
                  id="useSameAddress"
                  checked={useSameAddress}
                  onChange={() => setUseSameAddress(!useSameAddress)}
                />
                <label className="text-sm text-gray-700" htmlFor="useSameAddress">
                  Utiliser comme adresse de facturation
                </label>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              variants={fadeIn}
              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-amber-800">Mode de livraison</h2>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center" 
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-full mr-2"
                    type="radio"
                    id="standard"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <label className="text-sm text-gray-700" htmlFor="standard">
                    Livraison standard (3-5 jours) - 400 DA
                  </label>
                </motion.div>

                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-full mr-2"
                    type="radio"
                    id="express"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <label className="text-sm text-gray-700" htmlFor="express">
                    Livraison express (1-2 jours) - 800 DA
                  </label>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              variants={fadeIn}
              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-xl font-semibold mb-4 text-amber-800">Paiement</h2>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-full mr-2"
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label className="text-sm text-gray-700" htmlFor="card">
                    Carte bancaire (CIB, EDAHABIA)
                  </label>
                </motion.div>

                {paymentMethod === 'card' && (
                  <motion.div 
                    className="pl-6 pt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardNumber">
                          Numéro de carte*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expiryDate">
                          Date d'expiration*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/AA"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvv">
                          Code de sécurité*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardName">
                          Nom sur la carte*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-full mr-2"
                    type="radio"
                    id="ccp"
                    name="payment"
                    value="ccp"
                    checked={paymentMethod === 'ccp'}
                    onChange={() => setPaymentMethod('ccp')}
                  />
                  <label className="text-sm text-gray-700" htmlFor="ccp">
                    CCP (Chèque Postal)
                  </label>
                </motion.div>

                {paymentMethod === 'ccp' && (
                  <motion.div 
                    className="pl-6 pt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ccpNumber">
                          Numéro CCP*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="ccpNumber"
                          name="ccpNumber"
                          value={ccpInfo.ccpNumber}
                          onChange={handleCcpChange}
                          placeholder="0000000"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ccpKey">
                          Clé CCP*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="ccpKey"
                          name="ccpKey"
                          value={ccpInfo.ccpKey}
                          onChange={handleCcpChange}
                          placeholder="00"
                          required
                        />
                      </div>

                      <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="holderName">
                          Nom du titulaire*
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors duration-300"
                          type="text"
                          id="holderName"
                          name="holderName"
                          value={ccpInfo.holderName}
                          onChange={handleCcpChange}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded-full mr-2"
                    type="radio"
                    id="cashOnDelivery"
                    name="payment"
                    value="cashOnDelivery"
                    checked={paymentMethod === 'cashOnDelivery'}
                    onChange={() => setPaymentMethod('cashOnDelivery')}
                  />
                  <label className="text-sm text-gray-700" htmlFor="cashOnDelivery">
                    Paiement à la livraison
                  </label>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Résumé de commande côté droit - Modification du résumé pour enlever images et scrollbar */}
          <motion.div 
            className="w-full md:w-1/3"
            variants={staggerContainer}
            initial="hidden"
            animate={isPageLoaded ? "visible" : "hidden"}
          >
<motion.div 
  className="bg-white rounded-lg shadow-md p-6 sticky top-6 border-l-4 border-amber-500"
  variants={fadeIn}
  whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
>
<h2 className="text-xl font-semibold mb-4 text-orange-500">Résumé de la commande</h2>
<div className="mb-4">
  {cart.length > 0 ? (
    <div className="space-y-3 mb-4">
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <div>
            <span className="font-medium">{item.product?.name}</span>
          
          </div>
          <div className="font-medium">{(item.product?.price ).toFixed(2)} DA</div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">Votre panier est vide</p>
  )}
</div>

<div className="border-t border-gray-200 pt-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Sous-total</span>
    <span className="font-medium">{subtotal.toFixed(2)} DA</span>
  </div>
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Frais de livraison</span>
    <span className="font-medium">{shippingCost.toFixed(2)} DA</span>
  </div>
  <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 mt-2">
    <span>Total</span>
    <span className="text-orange-600">{total.toFixed(2)} DA</span>
  </div>
</div>

<motion.button
  className={`w-full bg-orange-500 text-white py-3 rounded-md mt-6 font-medium transition-all duration-300 ${
    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
  }`}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    if (!isProcessing) {
      handleStepNavigation('confirmation');
    }
  }}
  disabled={isProcessing}
>
  {isProcessing ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Traitement en cours...
    </div>
  ) : (
    'Passer commande'
  )}
</motion.button>

<div className="mt-4 text-xs text-gray-500 text-center">
  En passant votre commande, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
</div>
</motion.div>
</motion.div>
</div>
</motion.div>
{/* Toast notification */}
{toast.visible && (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-amber-800 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{toast.message}</span>
    <button 
      onClick={() => setToast({ visible: false, message: '' })}
      className="ml-4 text-white hover:text-gray-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </motion.div>
)}
<Footer/>
</div>
);
};

export default CheckoutPage;
