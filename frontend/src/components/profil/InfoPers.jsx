import React, { useEffect, useState } from "react";
import { fetchUser, logout } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import LogoutConfirmPopup from "../Popup/LogoutConfirmPopup"; // Importez le composant popup

const InfoPers = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // État pour contrôler l'affichage du popup
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                const response = await fetchUser();
                if (response.success && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error("Erreur récupération utilisateur :", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

    // Fonction pour ouvrir le popup de confirmation
    const openLogoutConfirmation = () => {
        setShowLogoutPopup(true);
    };

    // Fonction de déconnexion (appelée après confirmation)
    const confirmLogout = async () => {
        try {
            const response = await logout();
            if (response.success) {
                // Redirection vers la page de connexion
                navigate("/");
            } else {
                console.error("Échec de la déconnexion:", response.message);
                // Optionnel: ajouter une notification d'erreur ici
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    // Fonction utilitaire pour obtenir l'adresse
    const getAddress = () => {
        if (user.addresses && user.addresses.length > 0 && user.addresses[0].address1) {
            return user.addresses[0].address1;
        }
        return 'Non renseignée';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-amber-50 shadow-md rounded-lg p-6 max-w-md mx-auto text-center">
                <p className="text-amber-800">Impossible de charger les informations utilisateur.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-6">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-amber-200 max-w-4xl mx-auto">
                {/* Bannière avec dégradé */}
                <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-700 relative">
                    {/* Avatar positionné sur la bannière */}
                    <div className="absolute -bottom-14 left-8 md:left-12">
                        <img
                            src={user.avatar?.url ? `http://localhost:8000${user.avatar.url}` : "/default-avatar.png"}
                            alt="Photo de profil"
                            className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-white"
                        />
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="px-6 py-8 md:py-6 md:flex md:justify-between md:items-end">
                    {/* Nom et email */}
                    <div className="mt-14 md:mt-0 md:ml-32">
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-amber-600 font-medium mt-1">{user.email}</p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-3">
                        <button 
                        onClick={() => navigate("/Edit")}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Modifier mon profil
                        </button>
                        <button 
                            onClick={openLogoutConfirmation} // Modifié pour ouvrir le popup au lieu de déconnecter directement
                            className="border border-red-500 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 10-2 0v4a1 1 0 102 0V5zm2.707 8.707a1 1 0 01-1.414 0L9 11.414l-2.293 2.293a1 1 0 01-1.414-1.414l2.293-2.293-2.293-2.293a1 1 0 011.414-1.414L9 8.586l2.293-2.293a1 1 0 011.414 1.414L10.414 10l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Se déconnecter
                        </button>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 bg-amber-50 p-6 rounded-xl">
                        <div className="flex items-center">
                            <div className="bg-amber-100 p-3 rounded-full mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Membre depuis:</span>
                                <p className="text-gray-800 font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="bg-amber-100 p-3 rounded-full mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Téléphone:</span>
                                <p className="text-gray-800 font-medium">{user.phoneNumber || 'Non renseigné'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="bg-amber-100 p-3 rounded-full mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Adresse:</span>
                                <p className="text-gray-800 font-medium">{getAddress()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup de confirmation de déconnexion */}
            <LogoutConfirmPopup 
                isOpen={showLogoutPopup}
                onClose={() => setShowLogoutPopup(false)}
                onConfirm={() => {
                    setShowLogoutPopup(false);
                    confirmLogout();
                }}
            />
        </div>
    );
};

export default InfoPers;