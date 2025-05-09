import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCommentsByProduct, createComment, deleteComment, fetchUser } from "../../utils/api";
import { FiSend, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Composant MiniRatingSelector modernisé pour la sélection des étoiles
const MiniRatingSelector = ({ currentRating, onRatingChange, hoverState = false }) => {
  const [hover, setHover] = useState(0);
  const totalStars = 5;
  
  // Gestion de la position de la souris pour un rating précis
  const handleStarMove = (event, starIndex) => {
    if (!hoverState) return;
    
    const starElement = event.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    
    // Arrondir à 0.1 près pour permettre des valeurs comme 1.5, 2.8, etc.
    const decimalValue = Math.round(position * 10) / 10;
    const newRating = starIndex + decimalValue;
    
    setHover(newRating);
  };
  
  const handleStarClick = () => {
    if (hover > 0) {
      onRatingChange(hover);
    }
  };
  
  const resetHover = () => {
    if (hoverState) {
      setHover(0);
    }
  };
  
  // Obtenir le texte descriptif simplifié pour la note
  const getRatingText = (value) => {
    if (value >= 4.5) return "Excellent";
    if (value >= 3.5) return "Très bien";
    if (value >= 2.5) return "Bien";
    if (value >= 1.5) return "Moyen";
    if (value > 0) return "Décevant";
    return "";
  };
  
  return (
    <div className="flex items-center">
      <div className="flex relative">
        {Array.from({ length: totalStars }).map((_, starIndex) => (
          <motion.div 
            key={starIndex} 
            className="relative cursor-pointer mx-0.5"
            whileHover={{ scale: hoverState ? 1.05 : 1 }}
            whileTap={{ scale: hoverState ? 0.95 : 1 }}
            onMouseMove={(e) => handleStarMove(e, starIndex + 1)}
            onMouseLeave={resetHover}
            onClick={handleStarClick}
          >
            {/* Étoile de base (arrière-plan) */}
            <div className="text-sm text-neutral-200 relative">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
              </svg>
            </div>
            
            {/* Étoile remplie avec dégradé */}
            <div 
              className="absolute top-0 left-0 overflow-hidden text-sm"
              style={{ 
                width: `${Math.min(100, Math.max(0, 
                  ((hoverState && hover > starIndex ? hover - starIndex : 
                  (currentRating > starIndex ? currentRating - starIndex : 0)) * 100)
                ))}%` 
              }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#starGradient)" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
      
      {(currentRating > 0 || (hoverState && hover > 0)) && (
        <motion.div 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-2 text-sm flex items-center bg-gradient-to-r from-amber-50 to-amber-100 py-0.5 px-2 rounded-full shadow-sm"
        >
          <span className="font-medium text-amber-600">
            {(hoverState && hover > 0 ? hover : currentRating).toFixed(1)}
          </span>
          <span className="text-neutral-600 ml-1 hidden sm:inline text-sm">
            {getRatingText(hoverState && hover > 0 ? hover : currentRating)}
          </span>
        </motion.div>
      )}
    </div>
  );
};

// Composant MiniRatingDisplay modernisé pour l'affichage des étoiles en lecture seule
const MiniRatingDisplay = ({ rating, showValue = true, showLabel = false }) => {
  // S'assurer que le rating est un nombre valide
  const ratingValue = parseFloat(rating) || 0;
  const totalStars = 5;

  // Obtenir le texte descriptif pour la note
  const getRatingText = (value) => {
    if (value >= 4.5) return "Excellent";
    if (value >= 3.5) return "Très bien";
    if (value >= 2.5) return "Bien";
    if (value >= 1.5) return "Moyen";
    if (value > 0) return "Décevant";
    return "";
  };
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {Array.from({ length: totalStars }).map((_, index) => (
          <div key={index} className="relative mx-0.5">
            {/* Étoile de base (contour) */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-neutral-200">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
            </svg>
            
            {/* Étoile remplie avec effet de dégradé */}
            {ratingValue > index && (
              <div 
                className="absolute top-0 left-0 overflow-hidden"
                style={{ 
                  width: `${Math.min(100, Math.max(0, (ratingValue - index) * 100))}%` 
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <defs>
                    <linearGradient id="starGradientDisplay" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#starGradientDisplay)" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showValue && (
        <div className="ml-1.5 text-sm flex items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-amber-600"
          >
            {ratingValue.toFixed(1)}
          </motion.span>
          
          {showLabel && (
            <span className="ml-1 text-neutral-500 hidden sm:inline text-sm">
              {getRatingText(ratingValue)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const ProductComments = ({ productId, onRatingUpdate }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [showComments, setShowComments] = useState(false); // État pour afficher/masquer les commentaires

  // Récupérer l'utilisateur courant
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setCurrentUser(userData.user);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur courant:", err);
      }
    };
    
    getCurrentUser();
  }, []);

  // Calculer la moyenne des ratings
  const calculateAverageRating = (productComments) => {
    if (!productComments || productComments.length === 0) return 0;
    
    // Filtrer les commentaires qui ont une note valide (non null/undefined)
    const validRatings = productComments.filter(comment => 
      comment.rating !== null && comment.rating !== undefined && !isNaN(comment.rating)
    );
    
    if (validRatings.length === 0) return 0;
    
    const totalRating = validRatings.reduce((acc, comment) => acc + parseFloat(comment.rating), 0);
    return totalRating / validRatings.length;
  };

  // Récupérer les commentaires
  useEffect(() => {
    const getComments = async () => {
      try {
        setLoading(true);
        const productComments = await fetchCommentsByProduct(productId);
        setComments(productComments);
        
        // Calculer la moyenne des ratings
        const avgRating = calculateAverageRating(productComments);
        setAverageRating(avgRating);
        
        // Notifier le composant parent de la mise à jour du rating
        if (onRatingUpdate) {
          onRatingUpdate({
            rating: avgRating,
            count: productComments.length
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement des commentaires:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      getComments();
    } else {
      setLoading(false);
    }
  }, [productId, onRatingUpdate]);

  // Soumettre un nouveau commentaire
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!productId) {
      alert("Erreur: ID du produit manquant");
      return;
    }
    
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const commentData = {
        product: productId,
        text: newComment,
        rating: rating
      };
      
      const response = await createComment(commentData);
      
      if (response.success) {
        // Animation de succès
        const updatedComments = [response.comment, ...comments];
        setComments(updatedComments);
        
        // Calculer la moyenne des ratings
        const avgRating = calculateAverageRating(updatedComments);
        setAverageRating(avgRating);
        
        // Afficher automatiquement les commentaires si masqués
        if (!showComments) {
          setShowComments(true);
        }
        
        // Notifier le composant parent
        if (onRatingUpdate) {
          onRatingUpdate({
            rating: avgRating,
            count: updatedComments.length
          });
        }
        
        setNewComment("");
        setRating(0);
      } else {
        alert("Erreur lors de l'ajout du commentaire: " + (response.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      
      if (response.success) {
        const updatedComments = comments.filter(comment => comment._id !== commentId);
        setComments(updatedComments);
        
        // Recalculer la moyenne des ratings
        const avgRating = calculateAverageRating(updatedComments);
        setAverageRating(avgRating);
        
        // Notifier le composant parent
        if (onRatingUpdate) {
          onRatingUpdate({
            rating: avgRating,
            count: updatedComments.length
          });
        }
      } else {
        alert("Erreur lors de la suppression du commentaire: " + (response.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du commentaire:", err);
    }
  };

  // Vérifier si l'utilisateur est l'auteur du commentaire
  const isCommentAuthor = (comment) => {
    if (!comment || !comment.user) return false;
    return comment.user.isCurrentUser || (currentUser && comment.user._id === currentUser._id);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Gérer le clic sur une étoile
  const handleRatingClick = (value) => {
    setRating(value);
  };

  // Basculer l'affichage des commentaires
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-md">
      <div className="border-b border-neutral-100 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium text-neutral-800">
            Qu'en pensez-vous ?
          </span>
          {comments.length > 0 && (
            <div className="flex items-center ml-3 text-xs text-neutral-500">
              <span>{comments.length} avis</span>
              <div className="ml-2">
                <MiniRatingDisplay rating={averageRating} showValue={false} />
              </div>
            </div>
          )}
        </div>
        {comments.length > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={toggleComments}
            className="flex items-center text-sm text-blue-600 hover:underline transition px-2 py-1 rounded-full hover:bg-blue-50"
          >
            {showComments ? (
              <>
                <span className="mr-1">Masquer les avis</span>
                <FiChevronUp size={16} />
              </>
            ) : (
              <>
                <span className="mr-1">Voir les avis</span>
                <FiChevronDown size={16} />
              </>
            )}
          </motion.button>
        )}
      </div>
      
      {/* Zone de commentaire */}
      <div className="p-4">
        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="mb-5">
            <div className="mb-3">
              <div className="mb-2">
                <label className="text-xs text-neutral-600 mb-1 block">Votre note</label>
                <MiniRatingSelector 
                  currentRating={rating} 
                  onRatingChange={handleRatingClick} 
                  hoverState={true} 
                />
              </div>
              <div className="bg-neutral-100 rounded-lg p-1 relative flex items-start">
                <textarea
                  className="w-full p-2 bg-transparent border-none outline-none text-sm placeholder-neutral-500 resize-none min-h-16"
                  placeholder="Ajoutez un commentaire pour lancer la conversation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="2"
                  required
                ></textarea>
                <div className="self-end p-1">
                  <button 
                    type="submit"
                    className="p-1.5 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-5 bg-neutral-100 p-4 rounded-lg text-center">
            <p className="text-neutral-600 mb-3 text-sm">Vous devez être connecté pour laisser un avis.</p>
            <button 
              onClick={() => navigate("/login")} 
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
            >
              Se connecter
            </button>
          </div>
        )}
        
        {/* Liste des commentaires avec animation */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {loading ? (
                <div className="flex justify-center py-5">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-neutral-500 italic text-sm">
                    Aucun avis pour ce produit. Soyez le premier à donner votre opinion !
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <motion.div
                        key={comment._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-neutral-100 pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center mr-2">
                              {comment.user && comment.user.avatar ? (
                                <img 
                                  src={comment.user.avatar.url ? 
                                    (comment.user.avatar.url.startsWith("http") ? 
                                      comment.user.avatar.url : 
                                      `http://localhost:8000${comment.user.avatar.url}`) :
                                    (comment.user.avatar.startsWith("http") ? 
                                      comment.user.avatar : 
                                      `http://localhost:8000/${comment.user.avatar}`)}
                                  alt={comment.user && comment.user.name || "Utilisateur"} 
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-bold text-neutral-500">
                                  {comment.user && comment.user.name ? comment.user.name.charAt(0).toUpperCase() : "?"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-800 text-sm">
                                {comment.user && comment.user.name ? comment.user.name : "Utilisateur anonyme"}
                              </p>
                              <div className="flex items-center">
                                <span className="text-xs text-neutral-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                                {comment.rating > 0 && (
                                  <div className="ml-2">
                                    <MiniRatingDisplay rating={comment.rating} showValue={false} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Option de suppression */}
                          {isCommentAuthor(comment) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteComment(comment._id)}
                              className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
                            >
                              <FiTrash2 className="text-red-600" size={14} />
                            </motion.button>
                          )}
                        </div>
                        <p className="text-neutral-700 text-sm ml-10">{comment.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Message pour inciter à voir les commentaires quand ils sont masqués */}
        {!showComments && comments.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <button 
              onClick={toggleComments}
              className="text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto"
            >
              <span className="mr-1">Voir les {comments.length} avis</span>
              <FiChevronDown size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductComments;