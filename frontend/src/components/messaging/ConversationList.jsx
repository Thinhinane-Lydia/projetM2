 



// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { searchUsers } from '../../utils/api';

// const ConversationsList = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const navigate = useNavigate();
  
//   const currentUserId = localStorage.getItem('userId');
//   const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v2";

//   // Utilisation de useCallback pour optimiser les fonctions
//   const fetchConversations = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Vous devez être connecté");
//       }
      
//       const response = await axios.get(`${API_BASE_URL}/conversations`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
      
//       if (response.data.success) {
//         setConversations(response.data.data);
//       } else {
//         throw new Error(response.data.message || "Erreur lors de la récupération des conversations");
//       }
//     } catch (err) {
//       console.error("Error fetching conversations:", err);
//       setError(`Erreur: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchConversations();
    
//     // Rafraîchir périodiquement les conversations
//     const interval = setInterval(fetchConversations, 30000); // 30 secondes
    
//     return () => clearInterval(interval);
//   }, [fetchConversations]);

//   // Fonction pour rechercher un utilisateur avec debounce
//   const handleSearchUser = useCallback(async () => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       return;
//     }
  
//     try {
//       setIsSearching(true);
//       const response = await searchUsers(searchQuery);
      
//       if (response.success) {
//         // Filtrer l'utilisateur actuel des résultats
//         const filteredResults = response.data.filter(
//           user => user._id !== currentUserId
//         );
//         setSearchResults(filteredResults);
//       } else {
//         console.error("❌ Échec de la recherche:", response.message);
//       }
//     } catch (error) {
//       console.error("❌ Erreur lors de la recherche :", error);
//     } finally {
//       setIsSearching(false);
//     }
//   }, [searchQuery, currentUserId]);

//   // Effet pour la recherche avec délai
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchQuery.trim()) {
//         handleSearchUser();
//       }
//     }, 500); // 500ms de délai
    
//     return () => clearTimeout(timeoutId);
//   }, [searchQuery, handleSearchUser]);

//   // Fonction pour obtenir le nom d'affichage
//   const getDisplayName = useCallback((participant) => {
//     if (!participant) return "Utilisateur inconnu";
    
//     if (participant.username) return participant.username;
//     if (participant.firstName && participant.lastName) return `${participant.firstName} ${participant.lastName}`;
//     if (participant.firstName) return participant.firstName;
//     if (participant.name) return participant.name;
    
  
//     return "Utilisateur";
//   }, []);

//   // Fonction pour obtenir l'autre participant
//   const getOtherParticipant = useCallback((conversation) => {
//     if (!conversation || !conversation.participants || conversation.participants.length === 0) {
//       return null;
//     }
    
//     return conversation.participants.find(p => p._id !== currentUserId) || conversation.participants[0];
//   }, [currentUserId]);

//   // Fonction pour démarrer une conversation
//   const startConversation = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Vous devez être connecté");
//       }
      
//       setLoading(true);
//       const response = await axios.post(
//         `${API_BASE_URL}/conversations/start`,
//         { userId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
  
//       if (response.data.success) {
//         setSearchQuery('');
//         setSearchResults([]);
//         navigate(`/messages/${response.data.conversationId}`);
//       } else {
//         throw new Error(response.data.message || "Erreur lors de la création de la conversation");
//       }
//     } catch (error) {
//       console.error("Erreur API startConversation:", error);
//       setError(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="conversations-container">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Rechercher un utilisateur..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="search-input"
//         />
//         {isSearching && <span className="search-loading">Recherche en cours...</span>}
//       </div>

//       {searchResults.length > 0 && (
//         <div className="search-results">
//           <h3>Résultats de recherche</h3>
//           {searchResults.map((user) => (
//           <div className="user-search-result" key={user._id} onClick={() => startConversation(user._id)}>
//           <img src={user.avatar?.url || '/default-avatar.png'} alt={getDisplayName(user)} />
//           <div>
//             <p className="user-name">{getDisplayName(user)}</p>
//             {/* Retirer l'affichage de l'email ici */}
//           </div>
//         </div>
//           ))}
//         </div>
//       )}

//       <div className="conversations-list">
//         <h2>Mes conversations</h2>
//         {loading ? (
//           <div className="loading">Chargement des conversations...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : conversations.length > 0 ? (
//           conversations.map(conversation => {
//             const otherParticipant = getOtherParticipant(conversation);
//             const lastMessage = conversation.lastMessage ? conversation.lastMessage.content : "";
//             const lastMessageDate = conversation.lastMessage ? new Date(conversation.lastMessage.createdAt) : null;
            
//             return (
//               <Link 
//                 to={`/messages/${conversation._id}`} 
//                 key={conversation._id}
//                 className="conversation-item"
//               >
//                 <div className="conversation-avatar">
//                   <img 
//                     src={otherParticipant?.avatar?.url || '/default-avatar.png'} 
//                     alt="Avatar" 
//                     className="user-avatar"
//                   />
//                 </div>
//                 // Modifier la partie d'affichage du dernier message
// <div className="conversation-info">
//   <p className="conversation-name">{getDisplayName(otherParticipant)}</p>
//   <div className="message-preview">
//     {lastMessage && (
//       <>
//         <p className="last-message">
//           {lastMessage.length > 30 ? `${lastMessage.substring(0, 30)}...` : lastMessage}
//         </p>
//         {lastMessageDate && (
//           <p className="message-date">{lastMessageDate.toLocaleString('fr-FR', { 
//             hour: '2-digit', 
//             minute: '2-digit',
//             day: 'numeric',
//             month: 'short'
//           })}</p>
//         )}
//       </>
//     )}
//   </div>
// </div>
//               </Link>
//             );
//           })
//         ) : (
//           <div className="no-conversations">
//             <p>Vous n'avez pas encore de conversations</p>
//             <p>Utilisez la recherche pour trouver des utilisateurs</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConversationsList;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchUsers } from '../../utils/api';
import '../../App.css';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem('userId');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v2';

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

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = useCallback((participant) => {
    if (!participant) return "Utilisateur inconnu";
    
    if (participant.username) return participant.username;
    if (participant.firstName && participant.lastName) return `${participant.firstName} ${participant.lastName}`;
    if (participant.firstName) return participant.firstName;
    
    return "Utilisateur";
  }, []);

  // Fonction pour obtenir l'autre participant
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation?.participants?.length) return null;
    
    return conversation.participants.find(p => p._id !== currentUserId) || null;
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

  return (
    <div className="conversations-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          aria-label="Rechercher un utilisateur"
        />
        {isSearching && <div className="search-loading">Recherche en cours...</div>}
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Résultats de recherche</h3>
          {searchResults.map((user) => (
            <div 
              className="user-search-result" 
              key={user._id} 
              onClick={() => startConversation(user._id)}
              role="button"
              tabIndex={0}
              aria-label={`Démarrer une conversation avec ${getDisplayName(user)}`}
            >
              <img 
                src={user.avatar?.url || '/default-avatar.png'} 
                alt={`Avatar de ${getDisplayName(user)}`} 
                className="user-avatar"
                loading="lazy"
              />
              <span className="user-name">{getDisplayName(user)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="conversations-list">
        <h2>Mes conversations</h2>
        
        {loading ? (
          <div className="loading-spinner">Chargement des conversations...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : conversations.length > 0 ? (
          <div className="conversation-items">
            {conversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;
              
              const lastMessage = conversation.lastMessage?.content || "";
              const lastMessageDate = conversation.lastMessage?.createdAt || null;
              const isUnread = conversation.lastMessage?.sender !== currentUserId && 
                              !conversation.lastMessage?.read;
              
              return (
                <Link 
                  to={`/messages/${conversation._id}`} 
                  key={conversation._id}
                  className={`conversation-item ${isUnread ? 'unread' : ''}`}
                >
                  <div className="conversation-avatar">
                    <img 
                      src={otherParticipant?.avatar?.url || '/default-avatar.png'} 
                      alt={`Avatar de ${getDisplayName(otherParticipant)}`} 
                      className="user-avatar"
                      loading="lazy"
                    />
                    {otherParticipant.isOnline && <span className="online-indicator"></span>}
                  </div>
                  
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{getDisplayName(otherParticipant)}</span>
                      {lastMessageDate && (
                        <span className="message-time">{formatLastMessageTime(lastMessageDate)}</span>
                      )}
                    </div>
                    
                    {lastMessage && (
                      <div className="message-preview">
                        <p className="last-message">
                          {lastMessage.length > 40 ? `${lastMessage.substring(0, 40)}...` : lastMessage}
                        </p>
                        {isUnread && <span className="unread-indicator"></span>}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="no-conversations">
            <p>Vous n'avez pas encore de conversations</p>
            <p>Utilisez la recherche pour trouver des utilisateurs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;