import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCommentsByProduct, createComment, deleteComment, fetchUser } from "../../utils/api";
import { FiSend, FiTrash2 } from "react-icons/fi";
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

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-5">
        <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
          <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          Avis clients
        </h2>
        
        {/* Formulaire de commentaire */}
        {currentUser ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitComment} 
            className="mb-5 bg-gradient-to-br from-neutral-50 to-amber-50 p-4 rounded-lg border border-neutral-100 shadow-sm"
          >
            <div className="mb-3">
              <label className="block text-neutral-700 text-sm font-medium mb-1.5">Votre évaluation</label>
              <div className="mb-1.5">
                <MiniRatingSelector 
                  currentRating={rating} 
                  onRatingChange={handleRatingClick} 
                  hoverState={true} 
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-neutral-700 text-sm font-medium mb-1.5">Votre avis</label>
              <textarea
                className="w-full p-3 border border-neutral-200 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-500 outline-none transition bg-white text-sm shadow-sm"
                rows="2"
                placeholder="Partagez votre expérience avec ce produit..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm rounded-lg hover:shadow-md transition flex items-center justify-center shadow-sm"
            >
              <FiSend className="mr-1.5" size={14} />
              Publier mon avis
            </motion.button>
          </motion.form>
        ) : (
          <div className="mb-5 bg-gradient-to-br from-neutral-50 to-amber-50 p-4 rounded-lg border border-neutral-100 text-center shadow-sm">
            <p className="text-neutral-600 mb-3 text-sm">Vous devez être connecté pour laisser un avis.</p>
            <button 
              onClick={() => navigate("/login")} 
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm rounded-lg hover:shadow-md transition flex items-center justify-center mx-auto shadow-sm"
            >
              <FiSend className="mr-1.5" size={14} />
              Se connecter
            </button>
          </div>
        )}
        
        {/* Liste des commentaires */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-700 text-sm">
              {comments.length} avis client{comments.length !== 1 ? 's' : ''}
            </h3>
            
            {comments.length > 0 && (
              <div className="flex items-center">
                <MiniRatingDisplay 
                  rating={averageRating} 
                  showValue={true} 
                  showLabel={false}
                />
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center py-5">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6 bg-gradient-to-br from-neutral-50 to-amber-50 rounded-lg shadow-sm">
              <svg className="w-12 h-12 text-neutral-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
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
                    className="p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-amber-50 hover:shadow-md transition-all duration-300 border border-neutral-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-amber-100 rounded-full flex items-center justify-center mr-2 shadow-sm">
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
                            <span className="text-sm font-bold text-amber-600">
                              {comment.user && comment.user.name ? comment.user.name.charAt(0).toUpperCase() : "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-800 text-sm">
                            {comment.user && comment.user.name ? comment.user.name : "Utilisateur anonyme"}
                          </p>
                          <div className="flex items-center mt-0.5">
                            <MiniRatingDisplay 
                              rating={comment.rating} 
                              showValue={true} 
                            />
                            <span className="text-xs text-neutral-500 ml-1.5">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Option de suppression */}
                      {isCommentAuthor(comment) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1.5 rounded-full hover:bg-white transition-colors"
                        >
                          <FiTrash2 className="text-red-600" size={14} />
                        </motion.button>
                      )}
                    </div>
                    <p className="mt-2 text-neutral-700 bg-white p-2.5 rounded-lg text-sm shadow-sm">{comment.text}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComments;