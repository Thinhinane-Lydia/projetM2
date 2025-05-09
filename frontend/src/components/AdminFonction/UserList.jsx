import React, { useState, useEffect } from 'react';
import { Trash2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAllUsers, deleteUser } from '../../utils/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fonction pour charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers();
      console.log("Réponse de l'API:", response);
      
      // Vérifier et traiter les différents formats de réponse
      if (response && response.users) {
        setUsers(response.users);
      } else if (response && Array.isArray(response)) {
        setUsers(response);
      } else if (response && typeof response === 'object' && Object.keys(response).length > 0) {
        const possibleUsers = Object.values(response).find(val => Array.isArray(val));
        if (possibleUsers) {
          setUsers(possibleUsers);
        } else {
          setError("Format de réponse non reconnu");
        }
      } else {
        setError("Aucun utilisateur n'a été trouvé");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors du chargement des utilisateurs");
      console.error("Erreur lors du chargement des utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);
      
      if (response.success) {
        // Supprimer l'utilisateur de la liste
        setUsers(users.filter(user => user._id !== userId));
        
        // Afficher un message de succès
        toast.success("Utilisateur supprimé avec succès");
        
        // Fermer la boîte de confirmation
        setShowDeleteConfirm(null);
      } else {
        // Afficher un message d'erreur
        toast.error(response.message || "Impossible de supprimer l'utilisateur");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-amber-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-800 mb-2">Liste des Utilisateurs</h1>
      </div>
      
      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Utilisateurs ({users.length})
          </h2>
          
          {users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-neutral-500 italic">
                Aucun utilisateur trouvé.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user, index) => (
                <div
                  key={user._id || index}
                  className="p-4 rounded-lg bg-gradient-to-br from-neutral-50 to-amber-50 border border-neutral-100 shadow-sm relative"
                >
                  <div className="flex items-start">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-amber-200 shadow-sm">
                      {user.avatar ? (
                        <img 
                          src={`http://localhost:8000${user.avatar.url}`}
                          alt={`Avatar de ${user.name || 'utilisateur'}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=User";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-amber-300 flex items-center justify-center text-amber-800 font-bold text-xl">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="font-semibold text-neutral-800">
                        {user.name || "Utilisateur sans nom"}
                      </p>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {user.email || "Email non disponible"}
                      </p>
                      <p className="text-xs text-amber-600">
                        Rôle: {user.role || "Non défini"}
                      </p>
                    </div>
                    
                    {/* Bouton de suppression */}
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => setShowDeleteConfirm(user._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Boîte de confirmation de suppression */}
                  {showDeleteConfirm === user._id && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 z-10 flex flex-col items-center justify-center p-4">
                      <div className="text-center">
                        <Info className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                        <p className="text-neutral-800 font-semibold mb-2">
                          Voulez-vous vraiment supprimer cet utilisateur ?
                        </p>
                        <p className="text-sm text-neutral-600 mb-4">
                          {user.name} ({user.email})
                        </p>
                        <div className="flex justify-center space-x-4">
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Confirmer
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;