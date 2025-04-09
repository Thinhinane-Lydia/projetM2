import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchUsers, fetchUser } from '../../utils/api';
import '../../App.css';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem('userId');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v2';
  const IMAGE_BASE_URL = 'http://localhost:8000';

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetchUser();
        if (response.success) {
          setUser(response.user);
        } else {
          console.error("❌ Échec de la récupération des informations utilisateur:", response.message);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
      } finally {
        setUserLoading(false);
      }
    };
    
    getUserInfo();
  }, []);

  // Utilisation de useCallback pour optimiser les fonctions
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      if (response.data.success) {
        // Afficher les données pour le débogage
        console.log("Conversations reçues:", response.data.data);
        setConversations(response.data.data);
      } else {
        throw new Error(response.data.message || "Erreur lors de la récupération des conversations");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des conversations:", err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate]);

  // Effet pour charger les conversations
  useEffect(() => {
    fetchConversations();
    
    // Rafraîchir périodiquement les conversations
    const interval = setInterval(fetchConversations, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Fonction pour rechercher un utilisateur
  const handleSearchUser = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
  
    try {
      setIsSearching(true);
      const response = await searchUsers(searchQuery);
      
      if (response.success) {
        // Filtrer l'utilisateur actuel des résultats
        const filteredResults = response.data.filter(
          user => user._id !== currentUserId
        );
        // Afficher les résultats pour le débogage
        console.log("Résultats de recherche:", filteredResults);
        setSearchResults(filteredResults);
      } else {
        console.error("❌ Échec de la recherche:", response.message);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la recherche :", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, currentUserId]);

  // Effet pour la recherche avec délai (debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchUser();
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms de délai pour une réactivité améliorée
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearchUser]);

  // Fonction améliorée pour obtenir le nom d'affichage
  const getDisplayName = useCallback((participant) => {
    // Afficher les données de participant pour le débogage
    console.log("Données participant:", participant);
    
    if (!participant) return "Utilisateur inconnu";
    
    // Vérification des différentes possibilités de nom
    // 1. Priorité au champ 'name' direct
    if (participant.name && typeof participant.name === 'string') {
      return participant.name;
    }
    
    if (participant.user?.name && typeof participant.user.name === 'string') {
      return participant.user.name;
    }
    
    
    // 2. Vérifier si le nom est dans un sous-objet 'user'
    if (participant.user && participant.user.name) {
      return participant.user.name;
    }
    
    // 3. Utiliser username comme fallback
    if (participant.username) {
      return participant.username;
    }
    
    // 4. Vérifier si username est dans un sous-objet 'user'
    if (participant.user && participant.user.username) {
      return participant.user.username;
    }
    
    // 5. Utiliser prénom et nom si disponibles
    if (participant.firstName && participant.lastName) {
      return `${participant.firstName} ${participant.lastName}`;
    }
    
    // 6. Vérifier si prénom et nom sont dans un sous-objet 'user'
    if (participant.user && participant.user.firstName && participant.user.lastName) {
      return `${participant.user.firstName} ${participant.user.lastName}`;
    }
    
    // 7. Juste le prénom si disponible
    if (participant.firstName) {
      return participant.firstName;
    }
    
    // 8. Prénom depuis sous-objet 'user'
    if (participant.user && participant.user.firstName) {
      return participant.user.firstName;
    }
    
    // 9. Utiliser l'email comme dernier recours sans le domaine
    if (participant.email) {
      return participant.email.split('@')[0];
    }
    
    // 10. Email depuis sous-objet 'user'
    if (participant.user && participant.user.email) {
      return participant.user.email.split('@')[0];
    }
    
    // Si aucune information n'est disponible, utiliser l'ID pour éviter "Utilisateur anonyme"
    if (participant._id) {
      return `Utilisateur #${participant._id.substring(0, 5)}`;
    }
    
    return "Utilisateur";
  }, []);

  // Fonction améliorée pour obtenir l'avatar URL avec gestion des erreurs
  const getAvatarUrl = useCallback((participant) => {
    if (!participant) return '/default-avatar.png';
    
    // 1. Vérifier si avatar est un objet avec URL
    if (participant.avatar && participant.avatar.url) {
      const avatarUrl = participant.avatar.url;
      if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
      }
      return `${IMAGE_BASE_URL}${avatarUrl}`;
    } 
    
    // 2. Vérifier si avatar est dans un sous-objet 'user'
    if (participant.user && participant.user.avatar) {
      if (participant.user.avatar.url) {
        const avatarUrl = participant.user.avatar.url;
        if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
          return avatarUrl;
        }
        return `${IMAGE_BASE_URL}${avatarUrl}`;
      } else if (typeof participant.user.avatar === 'string') {
        const avatarUrl = participant.user.avatar;
        if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
          return avatarUrl;
        }
        return `${IMAGE_BASE_URL}/${avatarUrl}`;
      }
    }
    
    // 3. Vérifier si avatar est une chaîne directe
    if (participant.avatar && typeof participant.avatar === 'string') {
      const avatarUrl = participant.avatar;
      if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
      }
      return `${IMAGE_BASE_URL}/${avatarUrl}`;
    }
    
    // 4. Si aucun avatar n'est trouvé, utiliser l'avatar par défaut
    return '/default-avatar.png';
  }, [IMAGE_BASE_URL]);

  // Fonction pour obtenir l'autre participant avec meilleure gestion
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation) return null;
    
    // Vérifier si nous avons participants comme tableau
    if (Array.isArray(conversation.participants)) {
      // Chercher un participant qui n'est pas l'utilisateur courant
      const otherParticipant = conversation.participants.find(p => {
        // Vérifier si l'identifiant est directement sur l'objet ou dans un sous-objet 'user'
        const participantId = p._id || (p.user && p.user._id);
        return participantId !== currentUserId;
      });
      
      return otherParticipant || null;
    }
    
    // Si les participants sont stockés dans un autre format
    // Par exemple, directement comme un objet 'otherUser'
    if (conversation.otherUser) {
      return conversation.otherUser;
    }
    
    // Si nous avons un format où les utilisateurs sont dans 'users' plutôt que 'participants'
    if (Array.isArray(conversation.users)) {
      return conversation.users.find(u => u._id !== currentUserId) || null;
    }
    
    // Si aucun participant n'est trouvé
    return null;
  }, [currentUserId]);

  // Fonction pour démarrer une conversation
  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/conversations/start`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/messages/${response.data.conversationId}`);
      } else {
        throw new Error(response.data.message || "Erreur lors de la création de la conversation");
      }
    } catch (error) {
      console.error("❌ Erreur lors du démarrage de la conversation:", error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Formatter la date du dernier message
  const formatLastMessageTime = (dateString) => {
    if (!dateString) return '';
    
    const messageDate = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Si c'est aujourd'hui, afficher seulement l'heure
    if (messageDate >= today) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } 
    // Si c'est hier, afficher "Hier"
    else if (messageDate >= yesterday) {
      return 'Hier';
    } 
    // Sinon afficher la date
    else {
      return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Ajouter ce debug pour identifier les problèmes de noms d'utilisateurs
  useEffect(() => {
    if (conversations.length > 0) {
      console.log("Données pour debug des noms d'utilisateurs:", conversations.map(conv => ({
        id: conv._id,
        otherParticipant: getOtherParticipant(conv),
        displayName: getOtherParticipant(conv) ? getDisplayName(getOtherParticipant(conv)) : 'Non trouvé'
      })));
    }
  }, [conversations, getOtherParticipant, getDisplayName]);

  return (
    <div className="max-w-4xl mx-auto bg-amber-50 min-h-screen shadow-lg">
      <div className="p-4 md:p-6">
        {/* En-tête avec le profil utilisateur - Seulement nom affiché */}
        <div className="flex items-center justify-between mb-6 border-b border-amber-200 pb-4">
          <h1 className="text-2xl font-bold text-amber-800">Messagerie</h1>
          
          {userLoading ? (
            <div className="w-10 h-10 rounded-full bg-amber-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center">
              <div className="mr-3 text-right hidden sm:block">
                <p className="font-medium text-amber-800">{getDisplayName(user)}</p>
                {/* L'email a été supprimé ici selon votre demande */}
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300">
                <img 
                  src={getAvatarUrl(user)}
                  alt="Votre profil" 
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.onerror = null; e.target.src = '/default-avatar.png';}}
                />
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-amber-600 hover:text-amber-800 transition-colors font-medium">
              Se connecter
            </Link>
          )}
        </div>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-amber-900 placeholder-amber-400 shadow-sm"
            aria-label="Rechercher un utilisateur"
          />
          <div className="absolute right-4 top-3">
            {isSearching ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-amber-600 rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md mb-6 p-2 border border-amber-200">
            <h3 className="text-amber-800 font-medium px-3 py-2 border-b border-amber-200">Résultats de recherche</h3>
            <div className="max-h-64 overflow-y-auto">
              {searchResults.map((searchUser) => (
                <div 
                  className="flex items-center p-3 hover:bg-amber-100 cursor-pointer rounded-md transition-colors duration-200" 
                  key={searchUser._id} 
                  onClick={() => startConversation(searchUser._id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Démarrer une conversation avec ${getDisplayName(searchUser)}`}
                >
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-300">
                    <img 
                      src={getAvatarUrl(searchUser)} 
                      alt={`Avatar de ${getDisplayName(searchUser)}`} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {e.target.onerror = null; e.target.src = '/default-avatar.png';}}
                    />
                  </div>
                  <span className="ml-3 font-medium text-amber-900">{getDisplayName(searchUser)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="conversations-list">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b border-amber-200">Mes conversations</h2>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <span className="ml-3 text-amber-700">Chargement des conversations...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map(conversation => {
                const otherParticipant = getOtherParticipant(conversation);
                if (!otherParticipant) return null;
                
                const lastMessage = conversation.lastMessage?.content || "";
                const lastMessageDate = conversation.lastMessage?.createdAt || null;
                const isUnread = conversation.lastMessage?.sender !== currentUserId && 
                                !conversation.lastMessage?.read;
                
                // Utiliser getDisplayName pour afficher le nom correct
                const participantName = getDisplayName(otherParticipant);
                
                return (
                  <Link 
                    to={`/messages/${conversation._id}`} 
                    key={conversation._id}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-amber-100 ${isUnread ? 'bg-amber-200' : 'bg-white'} shadow-sm`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-amber-300">
                        <img 
                          src={getAvatarUrl(otherParticipant)} 
                          alt={`Avatar de ${participantName}`} 
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {e.target.onerror = null; e.target.src = '/default-avatar.png';}}
                        />
                      </div>
                      {otherParticipant.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium truncate ${isUnread ? 'text-amber-900' : 'text-amber-800'}`}>
                          {participantName}
                        </span>
                        {lastMessageDate && (
                          <span className="text-xs text-amber-600 flex-shrink-0 ml-2">
                            {formatLastMessageTime(lastMessageDate)}
                          </span>
                        )}
                      </div>
                      
                      {lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${isUnread ? 'text-amber-900 font-medium' : 'text-amber-700'}`}>
                            {lastMessage.length > 40 ? `${lastMessage.substring(0, 40)}...` : lastMessage}
                          </p>
                          {isUnread && (
                            <span className="h-2 w-2 bg-amber-600 rounded-full flex-shrink-0 ml-2"></span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-amber-100 p-8 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-amber-800 font-medium mb-2">Vous n'avez pas encore de conversations</p>
              <p className="text-amber-600">Utilisez la recherche pour trouver des utilisateurs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsList;