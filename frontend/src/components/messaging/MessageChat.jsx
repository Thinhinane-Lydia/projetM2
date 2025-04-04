 


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';





const MessageChat = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem('userId');
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v2";

  // Fonction pour défiler vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // Fonction pour charger les détails de la conversation
  const fetchConversationDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setConversation(response.data.data);
  
        // Trouver l'autre participant
        const otherParticipant = response.data.data.participants.find(
          participant => participant._id.toString() !== currentUserId
        );
  
        if (!otherParticipant) {
          console.warn('Impossible de déterminer le destinataire');
        } else {
          setRecipient(otherParticipant);
        }
      } else {
        throw new Error(response.data?.message || 'Erreur lors du chargement de la conversation');
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError(`Erreur: ${err.message}`);
    }
  }, [conversationId, currentUserId, API_BASE_URL, navigate]);

  // Fonction pour charger les messages
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
        setMessages(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Erreur lors du chargement des messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [conversationId, API_BASE_URL, navigate]);

  // Effet initial pour charger la conversation et les messages
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      Promise.all([
        fetchConversationDetails(),
        fetchMessages()
      ]).finally(() => {
        setLoading(false);
      });
    }
    
    // Mettre en place une actualisation périodique des messages
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [conversationId, fetchConversationDetails, fetchMessages]);

  // Effet pour défiler vers le bas après chargement ou ajout de messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effet pour ajuster la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  // Envoyer un message
  const handleSend = async () => {
    if (!messageText.trim() || !recipient || sending) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      setSending(true);
      
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        conversationId,
        text: messageText,
        recipientId: recipient._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Ajouter le nouveau message à la liste
        setMessages(prevMessages => [...prevMessages, response.data.data]);
        // Vider le champ de texte
        setMessageText('');
      } else {
        throw new Error(response.data?.message || "Erreur lors de l'envoi du message");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setError(`Erreur d'envoi: ${err.message}`);
    } finally {
      setSending(false);
    }
//     // Ajouter cet indicateur aux messages envoyés
// {isCurrentUser && (
//   <span className="read-status">
//     {message.read ? "Lu" : "Envoyé"}
//   </span>
// )}
  };

  // Supprimer un message
  const handleDeleteMessage = async (messageId) => {
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
  };

  // Gérer l'envoi avec la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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

  // Fonction pour créer les bulles de messages
  const renderMessages = () => {
    if (messages.length === 0) {
      return <p className="no-messages">Débutez la conversation avec un message.</p>;
    }
    
    const groupedMessages = groupMessagesByDate(messages);
    
    return Object.entries(groupedMessages).map(([date, dayMessages]) => (
      <div key={date} className="message-group">
        <div className="date-separator">
          <span>{date}</span>
        </div>
        
        {dayMessages.map(message => {
          const isCurrentUser = message.senderId?._id === currentUserId;
          return (
            <div 
            key={message._id} 
            className={`message-bubble max-w-[75%] p-3 rounded-lg mb-2 ${isCurrentUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
          >
          
              {/* Ajouter le nom de l'expéditeur pour les messages reçus */}
              {!isCurrentUser && (
                <div className="message-sender-name">
                  {message.senderId?.username || 'Utilisateur'}
                </div>
              )}
              
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {formatMessageDate(message.createdAt)}
                </span>
              </div>
              
              {isCurrentUser && (
                <button 
                  onClick={() => handleDeleteMessage(message._id)} 
                  className="delete-btn"
                  aria-label="Supprimer le message"
                >
                  ❌
                </button>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  // Afficher le loader pendant le chargement
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement de la conversation...</p>
    </div>
  );
  
  // Afficher l'erreur s'il y en a une
  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button onClick={() => navigate('/messages')} className="back-button">
        Retour aux conversations
      </button>
    </div>
  );

  return (
    <div className="message-chat-container">
<div className="chat-header">
  <Link to="/messages" className="back-button">⬅ Retour</Link>
  {recipient && (
    <div className="recipient-info">
     <img 
  src={`http://localhost:3000${recipient.avatar?.url || '/uploads/default-avatar.png'}`} 
  alt={recipient.username || 'Utilisateur'} 
  className="recipient-avatar" 
/>

      <div className="recipient-details">
        <span className="recipient-name">
          {recipient.username || recipient.firstName || recipient.name || 'Utilisateur'}
        </span>
        <span className="recipient-status">
          {recipient.isOnline ? "En ligne" : "Hors ligne"}
        </span>
      </div>
    </div>
  )}
  <div className="chat-actions">
    <button className="action-button">
      <span role="img" aria-label="Options">⋮</span>
    </button>
  </div>
</div>

      <div className="messages-container">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <textarea 
          ref={textareaRef}
          value={messageText} 
          onChange={(e) => setMessageText(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Écrivez votre message..."
          disabled={!recipient || sending}
          rows="1"
        ></textarea>
        <button 
          onClick={handleSend} 
          disabled={!messageText.trim() || !recipient || sending}
          className={`send-button ${sending ? 'sending' : ''}`}
        >
          {sending ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
};

export default MessageChat;