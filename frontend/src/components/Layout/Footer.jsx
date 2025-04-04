import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdLocalShipping, MdPayment, MdSecurity } from "react-icons/md";
import logo from "../../Assests/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-100 border-t-2 border-amber-500 shadow-inner shadow-amber-800/30 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="logo" className="w-24 h-auto" />
            </Link>
            <p className="text-neutral-600 text-sm mb-4">
              Votre marketplace de confiance pour acheter et vendre des produits de qualité.
            </p>
            <div className="flex space-x-4 text-amber-800">
              <a href="#" className="hover:text-amber-950 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-amber-950 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-amber-950 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-amber-950 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-amber-800 font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Vendre
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-amber-800 font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  Politique de confidentialité
                </Link>
              </li>
             
              <li>
                <Link to="/faq" className="text-neutral-600 hover:text-amber-800 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-800 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-neutral-600 text-sm">
                <IoMdMail className="mr-2 text-amber-800" size={18} />
                <span>support@votresite.com</span>
              </li>
              <li className="flex items-center text-neutral-600 text-sm">
                <RiCustomerService2Fill className="mr-2 text-amber-800" size={18} />
                <span>+213 (0) 123 456 789</span>
              </li>
            </ul>
           
          </div>
        </div>

        {/* Icônes de service */}
        <div className="border-t border-neutral-300 mt-8 pt-6 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="flex flex-col items-center">
            <MdLocalShipping size={28} className="text-amber-800 mb-2" />
            <span className="text-neutral-600 text-xs">Livraison Rapide</span>
          </div>
          <div className="flex flex-col items-center">
            <MdSecurity size={28} className="text-amber-800 mb-2" />
            <span className="text-neutral-600 text-xs">Paiement Sécurisé</span>
          </div>
          <div className="flex flex-col items-center">
            <MdPayment size={28} className="text-amber-800 mb-2" />
            <span className="text-neutral-600 text-xs">Plusieurs Méthodes de Paiement</span>
          </div>
          <div className="flex flex-col items-center">
            <RiCustomerService2Fill size={28} className="text-amber-800 mb-2" />
            <span className="text-neutral-600 text-xs">Support Client 24/7</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-neutral-500 text-xs">
          <p>&copy; {currentYear} Votre Site. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;