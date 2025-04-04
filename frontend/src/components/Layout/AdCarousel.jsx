import React, { useState, useEffect } from "react";
import { MdOutlineSell } from "react-icons/md";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

const AdCarousel = ({ user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Données des panneaux publicitaires
  const adPanels = [
    {
      id: 1,
      title: "Vendez vos articles facilement",
      description: "Transformez vos articles inutilisés en argent ! Rejoignez notre communauté de vendeurs dès aujourd'hui.",
      bgColor: "bg-amber-100",
      accentColor: "text-amber-800",
      buttonText: "Devenir vendeur",
      icon: <MdOutlineSell size={32} className="text-amber-700" />
    },
    {
      id: 2,
      title: "Gagnez jusqu'à 5000 DA par mois",
      description: "Des milliers d'acheteurs recherchent vos produits. Commencez à vendre maintenant !",
      bgColor: "bg-amber-200",
      accentColor: "text-amber-900",
      buttonText: "Commencer à vendre",
      icon: <img src="/api/placeholder/32/32" alt="Money icon" className="rounded-full" />
    },
    {
      id: 3,
      title: "Zéro frais pour les nouveaux vendeurs",
      description: "Inscrivez-vous maintenant et profitez de notre offre spéciale : 0 commission pendant 30 jours !",
      bgColor: "bg-amber-50",
      accentColor: "text-amber-700",
      buttonText: "Profiter de l'offre",
      icon: <img src="/api/placeholder/32/32" alt="Discount icon" className="rounded-full" />
    }
  ];

  // Fonction pour passer au slide suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === adPanels.length - 1 ? 0 : prev + 1));
  };

  // Fonction pour revenir au slide précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? adPanels.length - 1 : prev - 1));
  };

  // Changement automatique de slide toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Gestion des clics sur les boutons d'action
  const handleActionClick = (e) => {
    if (!user) {
      e.preventDefault();
      // Vous pouvez afficher un popup ici ou rediriger vers la page de connexion
      window.location.href = "/login";
    } else {
      // Rediriger vers la page de vente
      window.location.href = "/Sell";
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-300">
      <div className="max-w-7xl mx-auto px-4 py-2 relative">
        <div className="overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {adPanels.map((panel) => (
              <div 
                key={panel.id} 
                className={`flex-shrink-0 w-full ${panel.bgColor} rounded-lg p-4 flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-white shadow-md">
                    {panel.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold ${panel.accentColor} text-lg`}>{panel.title}</h3>
                    <p className="text-sm text-gray-700">{panel.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleActionClick}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                  <span>{panel.buttonText}</span>
                  <HiArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Boutons de navigation */}
        <button 
          onClick={prevSlide} 
          className="absolute left-6 top-1/2 -mt-4 bg-white rounded-full p-1 shadow-md hover:bg-amber-100 focus:outline-none"
          aria-label="Précédent"
        >
          <HiArrowLeft size={18} className="text-amber-800" />
        </button>
        
        <button 
          onClick={nextSlide} 
          className="absolute right-6 top-1/2 -mt-4 bg-white rounded-full p-1 shadow-md hover:bg-amber-100 focus:outline-none"
          aria-label="Suivant"
        >
          <HiArrowRight size={18} className="text-amber-800" />
        </button>
        
        {/* Indicateurs de slides */}
        <div className="flex justify-center mt-2">
          {adPanels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 mx-1 rounded-full transition-all ${
                currentSlide === index ? "bg-amber-800 w-4" : "bg-amber-300"
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdCarousel;