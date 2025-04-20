import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  fetchConversationDetails, 
  checkIfUserIsBlocked,
  checkIfUserIsBlockedBy,
  getBlockedUsers,
  fetchUserProfile  
} from '../../utils/api';
import { toast } from 'react-toastify'; // Make sure you've installed this package

// Hook personnalisé pour la résolution asynchrone des noms
const useCachedDisplayName = (user, getDisplayName) => {
  const [name, setName] = useState(null);
  // Extraire l'ID de manière plus robuste pour éviter les erreurs
  const userId = user?._id || (user?.user && user.user._id);

  useEffect(() => {
    let isMounted = true;
    const fetchName = async () => {
      if (!userId) return;
      
      try {
        const resolvedName = await getDisplayName(user);
        if (isMounted) setName(resolvedName);
      } catch (error) {
        console.error('Erreur lors de la récupération du nom:', error);
        if (isMounted) setName(null);
      }
    };

    fetchName();
    return () => {
      isMounted = false;
    };
  }, [userId, user, getDisplayName]);

  // Vérifier d'abord le nom résolu, puis vérifier différents endroits où le nom pourrait être
  return name || 
         user?.name || 
         (user?.user && user.user.name) || 
         (user?.senderId && user.senderId.name) || 
         `Utilisateur ${userId?.substring(0, 5) || 'inconnu'}`;
};

const MessageChat = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userCache, setUserCache] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const optionsRef = useRef(null);
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const currentUserId = localStorage.getItem('userId');
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v2";
  const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_URL || "http://localhost:8000";
  const [isBlockedByRecipient, setIsBlockedByRecipient] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  
 
 
  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  // Ajoutez un useEffect plus robuste pour le défilement
useEffect(() => {
  // Déclenchement du défilement après le rendu des messages
  if (messages.length > 0) {
    // Petit délai pour s'assurer que le rendu est terminé
    setTimeout(scrollToBottom, 200);
  }
}, [messages]);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      const result = await getBlockedUsers();
      if (result.success) {
        setBlockedUsers(result.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs bloqués:", error);
    }
  }, []);

    // Vérifier si un utilisateur est dans la liste des bloqués
    const isUserBlocked = useCallback((userId) => {
      return blockedUsers.some(blockedUser => {
        // Gérer différentes structures possibles de l'ID utilisateur
        const blockedId = blockedUser._id || blockedUser.user || blockedUser;
        return blockedId === userId || blockedId?._id === userId;
      });
    }, [blockedUsers]);

      // Effet initial pour charger les utilisateurs bloqués
  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  // Fermer les options quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    // Si l'utilisateur est déjà dans le cache, retourner directement
    if (userCache[userId]) return userCache[userId];
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");
  
      const response = await axios.get(`${API_BASE_URL}/user/profil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
  
      if (response.data.success) {
        const userData = response.data.data;
        // Mettre à jour le cache
        setUserCache(prev => ({ ...prev, [userId]: userData })); 
        return userData;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
      throw error;
    }
  };
  

  a  
  

  // Fonction pour obtenir les détails d'un utilisateur par son ID
  const fetchUserDetails = useCallback(async (userId) => {
    // Vérifier si nous avons déjà cet utilisateur dans le cache
    if (userCache[userId]) return userCache[userId];
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return null ;
      
      const response = await axios.get(`${API_BASE_URL}/users/profil/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Mettre à jour le cache
        const userData = response.data.data;
        setUserCache(prev => ({
          ...prev,
          [userId]: userData
        }));
        
        return userData;
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
    
    return null;
  }, [API_BASE_URL, userCache]);

  const checkIfBlockedByRecipient = useCallback(async () => {
    if (!recipient) return;
    
    try {
      const recipientId = recipient._id || (recipient.user && recipient.user._id) || recipient;
      const userId = typeof recipientId === 'object' ? recipientId.toString() : recipientId;
      
      const result = await checkIfUserIsBlockedBy(userId);
      setIsBlockedByRecipient(result.isBlocked);
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de blocage:", error);
    }
  }, [recipient]);

  useEffect(() => {
    checkIfBlockedByRecipient();
  }, [recipient, checkIfBlockedByRecipient]);
  
  
  // Dans votre useEffect pour vérifier le statut de blocage
  useEffect(() => {
    const checkBlockStatus = async () => {
      if (!recipient) return;
      
      try {
        console.log("Vérification du statut de blocage pour:", recipient);
        const recipientId = recipient._id || (recipient.user && recipient.user._id) || recipient;
        const userId = typeof recipientId === 'object' ? recipientId.toString() : recipientId;
        
        console.log("ID du destinataire:", userId);
        const result = await checkIfUserIsBlocked(userId);
        console.log("Résultat de la vérification:", result);
        setIsBlocked(result.isBlocked);
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de blocage:", error);
      }
    };
    
    checkBlockStatus();
  }, [recipient]);

  // Fonction pour formater la date
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Aujourd'hui : afficher l'heure uniquement
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    // Hier : afficher "Hier" et l'heure
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Autre : afficher la date complète
    else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Fonction pour obtenir l'URL de l'avatar avec gestion des erreurs
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

  // Fonction pour obtenir le nom d'affichage d'un utilisateur - Améliorée pour gérer plus de cas
  const getDisplayName = useCallback(async (participant) => {
    if (!participant) return "Utilisateur inconnu";
    
    console.log("Tentative d'extraction du nom pour:", participant);
    
    // 1. Vérifier si le participant a un nom directement
    if (participant.name && typeof participant.name === 'string') {
      return participant.name;
    }
    
    // 2. Vérifier si le nom est dans un sous-objet 'user'
    if (participant.user && participant.user.name) {
      return participant.user.name;
    }

    // 3. Vérifier le prénom et nom
    if (participant.firstName && participant.lastName) {
      return `${participant.firstName} ${participant.lastName}`;
    }
    
    // 4. Vérifier si le prénom et nom sont dans un sous-objet 'user'
    if (participant.user && participant.user.firstName && participant.user.lastName) {
      return `${participant.user.firstName} ${participant.user.lastName}`;
    }

    // 5. Vérifier si les informations de l'expéditeur sont disponibles via senderId
    if (participant.senderId) {
      if (typeof participant.senderId === 'object' && participant.senderId.name) {
        return participant.senderId.name;
      }
    }

    // 6. Vérifier le nom d'utilisateur
    if (participant.username) {
      return participant.username;
    }
    
    // 7. Vérifier le nom d'utilisateur dans sous-objet 'user'
    if (participant.user && participant.user.username) {
      return participant.user.username;
    }

    // 8. Vérifier l'email comme solution de repli
    if (participant.email) {
      return participant.email.split('@')[0];
    }
    
    // 9. Vérifier l'email dans sous-objet 'user'
    if (participant.user && participant.user.email) {
      return participant.user.email.split('@')[0];
    }
    
    // 10. Si nous avons uniquement un ID, essayer de récupérer les informations de l'utilisateur
    const participantId = participant._id || (participant.user && participant.user._id);
    if (participantId) {
      // Vérifier si nous avons déjà les détails de l'utilisateur dans le cache
      if (userCache[participantId]) {
        const cachedUser = userCache[participantId];
        if (cachedUser.name) return cachedUser.name;
        if (cachedUser.firstName && cachedUser.lastName) 
          return `${cachedUser.firstName} ${cachedUser.lastName}`;
        if (cachedUser.username) return cachedUser.username;
      }
      
      // Sinon, essayons de récupérer les détails de l'utilisateur
      try {
        const user = await fetchUserDetails(participantId);
        if (user) {
          if (user.name) return user.name;
          if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
          if (user.username) return user.username;
          if (user.email) return user.email.split('@')[0];
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails utilisateur:', err);
      }
      
      // Si nous ne pouvons pas obtenir le nom, utiliser un identifiant court
      return `Utilisateur ${participantId.substring(0, 5)}`;
    }

    return "Utilisateur";
  }, [userCache, fetchUserDetails]);

  // Fonction pour obtenir l'autre participant
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation) return null;
    
    console.log("Recherche du participant dans:", conversation);
    
    // Vérifier si les participants sont dans un tableau
    if (Array.isArray(conversation.participants)) {
      // Recherche l'autre participant qui n'est pas l'utilisateur courant
      const otherParticipant = conversation.participants.find(p => {
        // Gérer différentes structures de données
        const participantId = p._id || (p.user && p.user._id) || p.userId || p;
        const participantIdStr = typeof participantId === 'object' 
          ? participantId.toString() 
          : participantId;
        
        return participantIdStr !== currentUserId;
      });
      
      return otherParticipant || null;
    }
    
    // Si les participants sont stockés dans un autre format
    if (conversation.participant1 && conversation.participant2) {
      const p1Id = conversation.participant1._id || conversation.participant1;
      const p2Id = conversation.participant2._id || conversation.participant2;
      
      const p1IdStr = typeof p1Id === 'object' ? p1Id.toString() : p1Id;
      const p2IdStr = typeof p2Id === 'object' ? p2Id.toString() : p2Id;
      
      if (p1IdStr === currentUserId) return conversation.participant2;
      if (p2IdStr === currentUserId) return conversation.participant1;
    }
    
    return null;
  }, [currentUserId]);

  // Utilisation de la fonction API importée
  const fetchConversationDetailsFromApi = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Appel de la fonction importée de api.js
      const conversationData = await fetchConversationDetails(conversationId);
      console.log("Conversation Details:", JSON.stringify(conversationData, null, 2)); // Log détaillé
      
      setConversation(conversationData);

      // Utiliser getOtherParticipant pour trouver le destinataire
      const otherParticipant = getOtherParticipant(conversationData);

      if (!otherParticipant) {
        console.warn('Impossible de déterminer le destinataire. Conversation:', conversationData);
      } else {
        console.log("Recipient:", JSON.stringify(otherParticipant, null, 2)); // Log détaillé
        setRecipient(otherParticipant);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError(`Erreur: ${err.message}`);
    }
  }, [conversationId, getOtherParticipant, navigate]);

  // Fonction pour charger les messages
  // Fonction pour charger les messages
  // const fetchMessages = useCallback(async () => {
  //   if (!conversationId) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }
      
  //     const response = await axios.get(`${API_BASE_URL}/messages/conversation/${conversationId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     if (response.data.success) {
  //       console.log("Messages reçus:", response.data.data);
        
  //       // Filtrer les messages des utilisateurs bloqués
  //       const filteredMessages = response.data.data.filter(message => {
  //         const senderId = message.senderId?._id || (typeof message.senderId === 'string' ? message.senderId : null);
        
  //         // Toujours afficher nos propres messages
  //         if (senderId === currentUserId) return true;
        
  //         // Vérifier si l'utilisateur qui a envoyé le message est bloqué
  //         return !isUserBlocked(senderId);
  //       });
        
        
  //       setMessages(filteredMessages);
        
  //       // Pour chaque message, préchargez les informations utilisateur si nécessaire
  //       filteredMessages.forEach(message => {
  //         if (message.senderId && typeof message.senderId === 'object' && message.senderId._id && !message.senderId.name) {
  //           fetchUserDetails(message.senderId._id);
  //         }
  //       });
  //     } else {
  //       throw new Error(response.data?.message || 'Erreur lors du chargement des messages');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching messages:', err);
  //     setError(`Erreur: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [conversationId, API_BASE_URL, navigate, fetchUserDetails, currentUserId, isUserBlocked]);
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/messages/conversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data.success) {
        console.log("Messages reçus:", response.data.data);
  
        // Filtrer les messages des utilisateurs bloqués
        const filteredMessages = response.data.data.filter(message => {
          const senderId = message.senderId?._id || (typeof message.senderId === 'string' ? message.senderId : null);
  
          // Toujours afficher nos propres messages
          if (senderId === currentUserId) return true;
  
          // Vérifier si l'utilisateur qui a envoyé le message est bloqué
          return !isUserBlocked(senderId); // Fonction `isUserBlocked` que vous avez déjà pour vérifier si l'utilisateur est bloqué
        });
  
        setMessages(filteredMessages);
  
        // Pour chaque message, préchargez les informations utilisateur si nécessaire
        filteredMessages.forEach(message => {
          if (message.senderId && typeof message.senderId === 'object' && message.senderId._id && !message.senderId.name) {
            fetchUserDetails(message.senderId._id); // Récupérer le profil de l'utilisateur si nécessaire
          }
        });
      } else {
        throw new Error(response.data?.message || 'Erreur lors du chargement des messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [conversationId, API_BASE_URL, navigate, fetchUserDetails, currentUserId, isUserBlocked]);
  

  // Marquer les messages comme lus
  const markMessagesAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !conversationId) return;
  
      const response = await axios.put(`${API_BASE_URL}/messages/read/${conversationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Mettre à jour les messages localement pour marquer comme lus
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.senderId?._id !== currentUserId && !msg.read 
            ? { ...msg, read: true } 
            : msg
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage des messages comme lus:', err);
    }
  }, [conversationId, currentUserId, API_BASE_URL]);
  

  // Effet initial pour charger la conversation et les messages
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      Promise.all([
        fetchConversationDetailsFromApi(),
        fetchMessages()
      ]).then(() => {
        markMessagesAsRead();
      }).finally(() => {
        setLoading(false);
      });
    }
    
    // Mettre en place une actualisation périodique des messages
    const interval = setInterval(() => {
      fetchMessages();
      markMessagesAsRead();
    }, 10000);

    // Nettoie l'intervalle lorsque le composant est démonté ou que la conversation change
    return () => clearInterval(interval);
}, [conversationId, fetchMessages, markMessagesAsRead]);

 

  // Effet pour ajuster la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [messageText]);

   
  const handleSend = async () => {
    if (!messageText.trim() || !recipient || sending) return;
  
    // Empêcher l'envoi si l'utilisateur a bloqué le destinataire
    if (isBlocked) {
      setError(`Vous ne pouvez pas envoyer de message à ${recipientDisplayName} car vous l'avez bloqué.`);
      return;
    }
  
    // Empêcher l'envoi si le destinataire a bloqué l'utilisateur
    if (isBlockedByRecipient) {
      setError(`Vous ne pouvez pas envoyer de message à ${recipientDisplayName} car cet utilisateur vous a bloqué.`);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      setSending(true);
      
      const recipientId = recipient._id || (recipient.user && recipient.user._id) || recipient;
      
      // Vérifiez que le message n'est pas envoyé si l'utilisateur est bloqué
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        conversationId,
        text: messageText,
        recipientId: typeof recipientId === 'object' ? recipientId.toString() : recipientId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data.success) {
        setMessages(prevMessages => [...prevMessages, response.data.data]);
        setMessageText('');
        setError(null);
        try {
          await axios.put(`${API_BASE_URL}/conversations/${conversationId}/touch`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // You could also emit an event here to notify other components to refresh
          // For example, using a context or Redux action
        } catch (updateErr) {
          console.error("Error updating conversation timestamp:", updateErr);
        }
        
        setTimeout(scrollToBottom, 100);
      } else {
        throw new Error(response.data?.message || "Erreur lors de l'envoi du message");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setError(`Erreur d'envoi: ${err.message}`);
    } finally {
      setSending(false);
    }
  };
  
  
  
  const blockUser = async (userId) => {
    try {
      if (!userId) {
        toast.error("ID utilisateur manquant");
        return { success: false };
      }
    
    // Import and use the API utility function instead
    const response = await import('../../utils/api').then(module => module.blockUser(userId));
    
    if (response.success) {
      setIsBlocked(true);
      toast.success(`Vous avez bloqué ${recipientDisplayName}`);
    } else {
      toast.error(response.message || "Erreur lors du blocage de l'utilisateur");
    }
    return response;
  } catch (error) {
    console.error("Erreur lors du blocage de l'utilisateur:", error);
    toast.error("Une erreur est survenue lors du blocage de l'utilisateur");
    return { success: false, error };
  }
};

// Définition de la fonction pour débloquer un utilisateur
const unblockUser = async (userId) => {
  try {
    if (!userId) {
      toast.error("ID utilisateur manquant");
      return { success: false };
    }
    
    // Import and use the API utility function instead
    const response = await import('../../utils/api').then(module => module.unblockUser(userId));
    
    if (response.success) {
      setIsBlocked(false);
      toast.success(`Vous avez débloqué ${recipientDisplayName}`);
    } else {
      toast.error(response.message || "Erreur lors du déblocage de l'utilisateur");
    }
    return response;
  } catch (error) {
    console.error("Erreur lors du déblocage de l'utilisateur:", error);
    toast.error("Une erreur est survenue lors du déblocage de l'utilisateur");
    return { success: false, error };
  }
};
 
const handleBlockUser = async () => {
  if (!recipient) return;

  try {
    const recipientId = recipient._id || (recipient.user && recipient.user._id) || recipient;
    const userId = typeof recipientId === 'object' ? recipientId.toString() : recipientId;

    let response;

    if (isBlocked) {
      response = await unblockUser(userId);
      if (response.success) {
        setIsBlocked(false);
        // Recharger les messages pour afficher ceux qui étaient cachés
        fetchMessages();
      }
    } else {
      if (window.confirm(`Êtes-vous sûr de vouloir bloquer ${recipientDisplayName} ? Vous ne pourrez plus recevoir ses messages.`)) {
        response = await blockUser(userId);
        if (response.success) {
          setIsBlocked(true);
          // Recharger les messages pour filtrer ceux de l'utilisateur bloqué
          fetchMessages();
        }
      }
    }

    setShowOptions(false);
  } catch (error) {
    console.error("Erreur lors de la gestion du blocage:", error);
    toast.error("Une erreur est survenue lors du blocage");
  }
};


  // Supprimer un message
  const handleDeleteMessage = async (messageId, event) => {
    event.stopPropagation();
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }
        
        await axios.delete(`${API_BASE_URL}/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      } catch (error) {
        console.error("❌ Erreur lors de la suppression du message:", error);
        setError(`Erreur: ${error.message}`);
      }
    }
  };

  // Gérer l'envoi avec la touche Entrée
  const handleKeyPress = (e) => {
    // Si la touche appuyée est "Enter" sans "Shift" (empêcher l'envoi avec "Enter")
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Empêche l'ajout de nouvelle ligne
      handleSend(); // Appel de la fonction pour envoyer le message
    }
  };
  

  // Simulation de l'indication "est en train d'écrire"
  const handleTyping = () => {
    // Dans une application réelle, vous enverriez cette information au serveur
    // via des websockets pour informer l'autre utilisateur
    setIsTyping(true);
    
    // Pour la démonstration, nous simulons la fin de la saisie après 2 secondes
    setTimeout(() => setIsTyping(false), 2000);
  };

  // Grouper les messages par date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(message);
    });
    
    return groups;
  };

  // Gestion du cache de noms d'utilisateurs pour l'affichage
  const [nameCache, setNameCache] = useState({});

  // Fonction pour obtenir le nom d'un utilisateur avec mise en cache
  const getCachedDisplayName = useCallback((user) => {
    if (!user) return "Utilisateur inconnu";
    
    const userId = user._id || (user.user && user.user._id);
    if (!userId) return "Utilisateur inconnu";
    
    // Si nous avons déjà le nom en cache, l'utiliser
    if (nameCache[userId]) return nameCache[userId];
    
    // Sinon, récupérer le nom et le mettre en cache
    getDisplayName(user).then(name => {
      setNameCache(prev => ({
        ...prev,
        [userId]: name
      }));
    });
    
    // En attendant, utiliser le mieux que nous avons
    return user.name || 
           (user.user && user.user.name) || 
           user.username || 
           (user.user && user.user.username) ||
           `Utilisateur ${userId.substring(0, 5)}`;
  }, [nameCache, getDisplayName]);

  // Appel du hook personnalisé pour le nom du destinataire - DÉPLACÉ AVANT LES CONDITIONS DE RETOUR
  const recipientDisplayName = useCachedDisplayName(recipient, getDisplayName);

  // Fonction pour créer les bulles de messages
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-amber-700 font-medium text-lg mb-2">Commencez la conversation</p>
          <p className="text-amber-500 text-sm text-center max-w-xs">
            Envoyez votre premier message à {recipientDisplayName} pour démarrer une discussion
          </p>
        </div>
      );
    }
    
    const groupedMessages = groupMessagesByDate(messages);
    
    return Object.entries(groupedMessages).map(([date, dayMessages]) => (
      <div key={date} className="message-group">
        <div className="date-separator flex items-center justify-center my-4">
          <div className="h-px bg-amber-200 flex-grow"></div>
          <span className="mx-4 px-4 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full shadow-sm">{date}</span>
          <div className="h-px bg-amber-200 flex-grow"></div>
        </div>
        
        {dayMessages.map((message, index) => {
          // Déterminer si le message est de l'utilisateur courant
          const senderId = message.senderId?._id || (typeof message.senderId === 'string' ? message.senderId : null);
          const isCurrentUser = senderId === currentUserId;
          
          // Afficher l'avatar seulement pour les nouveaux messages d'un expéditeur
          const showAvatar = !isCurrentUser && (
            index === 0 || 
            dayMessages[index - 1]?.senderId?._id !== senderId
          );
          
          return (
            <div key={message._id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
              {/* Avatar de l'expéditeur (seulement pour les messages reçus) */}
              {!isCurrentUser && showAvatar && (
                <div className="flex-shrink-0 mr-2 self-end mb-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
  src={getAvatarUrl(recipient)} 
  alt={recipientDisplayName} 
  className="relative h-12 w-12 rounded-full object-cover border-2 border-amber-300 shadow-md z-10"

                      onError={(e) => {e.target.onerror = null; e.target.src = '/default-avatar.png';}}
                    />
                  </div>
                </div>
              )}
              
              {/* Contenu du message */}
              <div 
                className={`group relative max-w-[75%] p-3 rounded-2xl ${
                  isCurrentUser 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-br-none shadow-lg shadow-amber-100 animate-fadeInRight' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-amber-100 shadow-md animate-fadeInLeft'
                }`}
              >
                <p className="mb-1 break-words">{message.content}</p>
                <div className={`flex items-center text-xs ${isCurrentUser ? 'text-amber-100' : 'text-amber-500'} justify-end`}>
                  <span className="message-time">
                    {formatMessageDate(message.createdAt)}
                  </span>
                  
                  {/* Indicateur de statut pour l'envoyeur */}
                  {isCurrentUser && (
                    <span className="ml-1 flex items-center">
                      {message.read ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              
                {/* Bouton de suppression qui apparaît au survol */}
                {isCurrentUser && (
                  <button 
                    onClick={(e) => handleDeleteMessage(message._id, e)} 
                    className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1.5 shadow-lg transform hover:scale-110 transition-all duration-200"
                    aria-label="Supprimer le message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  // Afficher le loader pendant le chargement
  if (loading) return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="w-20 h-20 relative">
        <div className="animate-ping absolute inset-0 rounded-full bg-amber-400 opacity-75"></div>
        <div className="relative rounded-full h-full w-full bg-amber-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>
      <p className="mt-6 text-amber-700 font-medium text-lg">Chargement de la conversation...</p>
    </div>
  );
  
  // Afficher l'erreur s'il y en a une
  if (error) return (
    <div className="h-screen flex flex-col justify-center items-center bg-red-50 p-6">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border border-red-100">
        <div className="flex items-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold">Erreur</h2>
        </div>
        <p className="text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/messages')} 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux conversations
        </button>
      </div>
    </div>
  );
  
  if (recipient) {
    console.log("👤 recipient object :", recipient);
    console.log("🪪 display name :", recipientDisplayName);
  }
  
  return (
    <div className="h-screen flex flex-col bg-amber-50">
      {/* En-tête du chat avec effet de verre */}
      <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-md px-6 py-4 flex items-center justify-between z-10 border-b border-amber-100">
        <div className="flex items-center">
          <Link to="/messages" className="mr-4 text-amber-600 hover:text-amber-800 transition-colors transform hover:scale-110 duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
         

          {recipient && (
            
            <div className="flex items-center">
               
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full animate-pulse opacity-40"></div>
                <img 
                  src={getAvatarUrl(recipient)} 
                  alt={recipientDisplayName} 
                  className="relative h-12 w-12 rounded-full object-cover border-2 border-amber-300 shadow-md z-10"
                  onError={(e) => {e.target.onerror = null; e.target.src = '/default-avatar.png';}}
                />
                {recipient.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white z-20"></span>
                )}
              </div>
              
              <div className="ml-3">
                <h2 className="font-medium text-gray-800 text-lg">
                  {recipientDisplayName}
                </h2>
                <p className={`text-xs ${recipient.isOnline ? 'text-green-600' : 'text-amber-600'}`}>
                  {recipient.isOnline ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={optionsRef}>
          <button 
            onClick={() => setShowOptions(!showOptions)} 
            className="p-2 rounded-full hover:bg-amber-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 overflow-hidden border border-amber-100 animate-fadeIn">
              <div className="py-1">
                <button className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher dans la conversation
                </button>
                <button className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer la conversation
                </button>
                <div className="border-t border-amber-100 my-1"></div>
{/* Remplacer le bouton existant par celui-ci */}
<button 
  onClick={handleBlockUser}
  className={`flex items-center w-full text-left px-4 py-3 text-sm ${
    isBlocked 
      ? 'text-green-600 hover:bg-green-50' 
      : 'text-red-600 hover:bg-red-50'
  } transition-colors`}
>
  <svg xmlns="http://www.w3.org/2000/svg" 
    className={`h-4 w-4 mr-3 ${isBlocked ? 'text-green-500' : 'text-red-500'}`} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d={isBlocked 
        ? "M13 10V3L4 14h7v7l9-11h-7z" // Icône "débloquer"
        : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" // Icône "bloquer"
      } 
    />
  </svg>
  {isBlocked ? "Débloquer l'utilisateur" : "Bloquer l'utilisateur"}
</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone des messages avec motif subtil */}
      <div 
  className="flex-grow overflow-y-auto p-4 bg-gradient-to-br from-amber-50 to-amber-100"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fde68a' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '12px 12px',
    height: 'calc(100vh - 140px)',  // Hauteur fixe pour soustraire l'en-tête et la zone de saisie
    display: 'flex',
    flexDirection: 'column',
  }}
  id="messagesContainer"
>
<div className="max-w-3xl mx-auto w-full flex-grow">
    {renderMessages()}
    <div ref={messagesEndRef} style={{ float: 'left', clear: 'both' }} />
  </div>
</div>

      {/* Zone de saisie stylisée */}
      <div className="bg-white border-t border-amber-200 p-5 shadow-inner">
        <div className="max-w-3xl mx-auto flex items-end">
          <div className="flex-grow bg-amber-50 rounded-2xl p-2 flex items-end border border-amber-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100 transition-all shadow-sm">
          <textarea
  ref={textareaRef}
  value={messageText}
  onChange={(e) => {
    setMessageText(e.target.value);
    handleTyping(); // Signaler que l'utilisateur est en train d'écrire
  }}
  onKeyDown={handleKeyPress} // Utiliser onKeyDown au lieu de onKeyPress
  placeholder={isBlockedByRecipient
    ? `Vous ne pouvez pas envoyer de message à ${recipientDisplayName}` 
    : "Écrivez votre message..."}
  disabled={!recipient || sending || isBlockedByRecipient} // Désactiver si l'utilisateur est bloqué
  className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-36 overflow-auto py-2 px-3 text-gray-700 placeholder-amber-400"
  rows="1"
/>

 
            
<button 
  onClick={handleSend} 
  disabled={!messageText.trim() || !recipient || sending || isBlockedByRecipient}
  className={`flex-shrink-0 ml-2 p-3 rounded-full ${
    !messageText.trim() || !recipient || sending || isBlockedByRecipient
      ? 'bg-amber-300 text-amber-100 cursor-not-allowed' 
      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transform hover:scale-105'
  } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md`}
>
  {sending ? (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )}
</button>
 
          </div>
        </div>
      </div>
    </div>
  );
};


export default MessageChat;

