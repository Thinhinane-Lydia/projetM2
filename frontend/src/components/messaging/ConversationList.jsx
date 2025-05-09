import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchUsers, fetchUser, fetchConversations, fetchLastMessage } from '../../utils/api';
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

  // Charger les conversations
  // const loadConversations = useCallback(async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }
      
  //     // Utiliser la fonction fetchConversations au lieu d'appeler axios directement
  //     const response = await fetchConversations();
      
  //     if (response.success) {
  //       // Afficher les données pour le débogage
  //       console.log("Conversations reçues:", response.data);
  //       setConversations(response.data);
  //     } else {
  //       throw new Error(response.message || "Erreur lors de la récupération des conversations");
  //     }
  //   } catch (err) {
  //     console.error("❌ Erreur lors de la récupération des conversations:", err);
  //     setError(`Erreur: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [navigate]);
// Mise à jour de la fonction loadConversations dans ConversationsList.jsx
const loadConversations = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    // Utiliser la fonction fetchConversations mise à jour
    const response = await fetchConversations();
    
    if (response.success) {
      // Log pour débogage
      console.log("Conversations avec derniers messages:", response.data);
      
      // Mettre à jour l'état avec les conversations complètes (y compris derniers messages)
      setConversations(response.data);
    } else {
      throw new Error(response.message || "Erreur lors de la récupération des conversations");
    }
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des conversations:", err);
    setError(`Erreur: ${err.message}`);
  } finally {
    setLoading(false);
  }
}, [navigate]);

// Amélioration de la fonction getLastMessageContent pour gérer plus de cas
const getLastMessageContent = useCallback((conversation) => {
  if (!conversation) return "Pas encore de messages";
  
  // Vérification plus détaillée du dernier message
  if (!conversation.lastMessage) return "Pas encore de messages";
  
  // Si lastMessage est un objet avec un contenu
  if (typeof conversation.lastMessage === 'object' && conversation.lastMessage !== null) {
    // Vérifier content en priorité
    if (conversation.lastMessage.content) {
      return conversation.lastMessage.content;
    }
    
    // Si on a un texte
    if (conversation.lastMessage.text) {
      return conversation.lastMessage.text;
    }
  }
  
  // Si lastMessage est une chaîne de caractères (ID)
  if (typeof conversation.lastMessage === 'string') {
    return "Chargement du message...";
  }
  
  return "Pas encore de messages";
}, []);
  // Effet pour charger les conversations
  useEffect(() => {
    loadConversations();
    
    // Rafraîchir périodiquement les conversations
    const interval = setInterval(loadConversations, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, [loadConversations]);

  // Fonction de recherche d'utilisateurs
  const handleSearchUser = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchUsers(searchQuery);

      if (response.success) {
        // Filtrer les résultats pour exclure l'utilisateur actuel
        const filteredResults = response.data.filter(
          (user) => user._id !== currentUserId
        );
        setSearchResults(filteredResults);
      } else {
        console.error("❌ Échec de la recherche:", response.message);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la recherche:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, currentUserId]);

  // Effet pour gérer la recherche avec un délai (debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchUser();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearchUser]);

  // Fonction améliorée pour obtenir le nom d'affichage
  const getDisplayName = useCallback((participant) => {
    // Afficher les données de participant pour le débogage
    console.log("Données participant:", participant);
    
    if (!participant) return "Utilisateur inconnu";
    
    // Vérification des différentes possibilités de nom
    if (participant.name && typeof participant.name === 'string') {
      return participant.name;
    }
    
    if (participant.user?.name && typeof participant.user.name === 'string') {
      return participant.user.name;
    }
    
    if (participant.username) {
      return participant.username;
    }
    
    if (participant.user && participant.user.username) {
      return participant.user.username;
    }
    
    if (participant.firstName && participant.lastName) {
      return `${participant.firstName} ${participant.lastName}`;
    }
    
    if (participant.user && participant.user.firstName && participant.user.lastName) {
      return `${participant.user.firstName} ${participant.user.lastName}`;
    }
    
    if (participant.firstName) {
      return participant.firstName;
    }
    
    if (participant.user && participant.user.firstName) {
      return participant.user.firstName;
    }
    
    if (participant.email) {
      return participant.email.split('@')[0];
    }
    
    if (participant.user && participant.user.email) {
      return participant.user.email.split('@')[0];
    }
    
    if (participant._id) {
      return `Utilisateur #${participant._id.substring(0, 5)}`;
    }
    
    return "Utilisateur";
  }, []);
  
  // Fonction améliorée pour obtenir l'avatar URL avec gestion des erreurs
  const getAvatarUrl = useCallback((participant) => {
    if (!participant) return '/default-avatar.png';
    
    if (participant.avatar && participant.avatar.url) {
      const avatarUrl = participant.avatar.url;
      if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
      }
      return `${IMAGE_BASE_URL}${avatarUrl}`;
    } 
    
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
    
    if (participant.avatar && typeof participant.avatar === 'string') {
      const avatarUrl = participant.avatar;
      if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
      }
      return `${IMAGE_BASE_URL}/${avatarUrl}`;
    }
    
    return '/default-avatar.png';
  }, [IMAGE_BASE_URL]);

  // Fonction pour obtenir l'autre participant
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation) return null;
    
    if (Array.isArray(conversation.participants)) {
      const otherParticipant = conversation.participants.find(p => {
        const participantId = p._id || (p.user && p.user._id);
        return participantId !== currentUserId;
      });
      
      return otherParticipant || null;
    }
    
    if (conversation.otherUser) {
      return conversation.otherUser;
    }
    
    if (Array.isArray(conversation.users)) {
      return conversation.users.find(u => u._id !== currentUserId) || null;
    }
    
    return null;
  }, [currentUserId]);

  // Fonction pour démarrer une conversation
  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/conversations/start`,
        { userId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
  
      console.log("Réponse de l'API pour démarrer la conversation:", response.data);
  
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
    
    if (messageDate >= today) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } 
    else if (messageDate >= yesterday) {
      return 'Hier';
    } 
    else {
      return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Fonction améliorée pour obtenir le contenu du dernier message
  // const getLastMessageContent = useCallback((conversation) => {
  //   if (!conversation) return "Pas encore de messages";
    
  //   if (!conversation.lastMessage) return "Pas encore de messages";
    
  //   if (typeof conversation.lastMessage === 'object' && conversation.lastMessage.content) {
  //     return conversation.lastMessage.content;
  //   }
    
  //   return "Chargement du message...";
  // }, []);

  // Charger les derniers messages manquants
  useEffect(() => {
    const loadMissingLastMessages = async () => {
      // Identifier les conversations nécessitant le chargement de leur dernier message
      const conversationsNeedingMessages = conversations.filter(conv => 
        conv.lastMessage && (
          typeof conv.lastMessage === 'string' || 
          (typeof conv.lastMessage === 'object' && conv.lastMessage._id && !conv.lastMessage.content)
        )
      );
      
      // Journalisation pour le débogage
      if (conversationsNeedingMessages.length > 0) {
        console.log(`Chargement des derniers messages pour ${conversationsNeedingMessages.length} conversations`);
      }
      
      // Traiter chaque conversation séquentiellement pour éviter les problèmes de race condition
      for (const conv of conversationsNeedingMessages) {
        try {
          console.log(`Tentative de chargement du dernier message pour la conversation ${conv._id}`);
          
          const response = await fetchLastMessage(conv._id);
          
          console.log(`Réponse du serveur pour le dernier message:`, response);
          
          if (response && response.success && response.data) {
            // Mettre à jour la conversation dans l'état local
            setConversations(prevConvs => 
              prevConvs.map(prevConv => 
                prevConv._id === conv._id 
                  ? {...prevConv, lastMessage: response.data} 
                  : prevConv
              )
            );
            console.log(`Message chargé avec succès pour la conversation ${conv._id}`);
          } else {
            console.warn(`Aucune donnée de message reçue pour la conversation ${conv._id}`);
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du message pour la conversation ${conv._id}:`, error);
        }
      }
    };
    
    if (conversations.length > 0) {
      loadMissingLastMessages();
    }
  }, [conversations]);

  // Pour le débogage - analyser les données des conversations
  useEffect(() => {
    if (conversations.length > 0) {
      console.log("Données des conversations (pour débogage):", 
        conversations.map(conv => ({
          id: conv._id,
          lastMessage: conv.lastMessage,
          otherParticipant: getOtherParticipant(conv),
          displayName: getOtherParticipant(conv) ? getDisplayName(getOtherParticipant(conv)) : 'Non trouvé'
        }))
      );
    }
  }, [conversations, getOtherParticipant, getDisplayName]);

  return (
    <div className="max-w-4xl mx-auto bg-amber-50 min-h-screen shadow-lg">
      <div className="p-4 md:p-6">
        {/* En-tête avec le profil utilisateur */}
        <div className="flex items-center justify-between mb-6 border-b border-amber-200 pb-4">
          <h1 className="text-2xl font-bold text-amber-800">Messagerie</h1>
          
          {userLoading ? (
            <div className="w-10 h-10 rounded-full bg-amber-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center">
              <div className="mr-3 text-right hidden sm:block">
                <p className="font-medium text-amber-800">{getDisplayName(user)}</p>
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
        
        {/* Barre de recherche */}
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

        {/* Résultats de recherche */}
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

        {/* Liste des conversations */}
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
                
                const lastMessageContent = getLastMessageContent(conversation);
                const lastMessageDate = conversation.lastMessage?.createdAt || null;
                
                const isUnread = conversation.lastMessage && 
                                conversation.lastMessage.senderId && 
                                conversation.lastMessage.senderId !== currentUserId && 
                                !conversation.lastMessage.read;
                
                const lastMessageSenderId = conversation.lastMessage?.senderId;
                
                let messagePrefix = '';
                if (lastMessageSenderId) {
                  messagePrefix = lastMessageSenderId === currentUserId ? 'Vous : ' : '';
                }
                
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
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${isUnread ? 'text-amber-900 font-medium' : 'text-amber-700'}`}>
                          {messagePrefix}{lastMessageContent.length > 40 ? `${lastMessageContent.substring(0, 40)}...` : lastMessageContent}
                        </p>
                        {isUnread && (
                          <span className="h-2 w-2 bg-amber-600 rounded-full flex-shrink-0 ml-2"></span>
                    )}
                  </div>
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