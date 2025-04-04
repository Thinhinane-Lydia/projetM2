import React, { useState, useEffect } from 'react';
import { fetchUser, updateUserProfile } from "../../utils/api";
import { toast } from 'react-hot-toast';

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    avatar: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setUser(userData.user);
          setFormData({
            name: userData.user.name || '',
            email: userData.user.email || '',
            phoneNumber: userData.user.phoneNumber || '',
            avatar: null
          });
        }
        setLoading(false);
      } catch (error) {
        toast.error('Impossible de charger le profil');
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      // Créer un preview de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedFormData = new FormData();
    
    // N'ajouter que les champs modifiés
    if (formData.name !== user.name) updatedFormData.append('name', formData.name);
    if (formData.email !== user.email) updatedFormData.append('email', formData.email);
    if (formData.phoneNumber !== user.phoneNumber) updatedFormData.append('phoneNumber', formData.phoneNumber);
    if (formData.avatar) updatedFormData.append('avatar', formData.avatar);

    try {
      const result = await updateUserProfile(updatedFormData);
      
      if (result.success) {
        toast.success('Profil mis à jour avec succès');
        // Optionnel : mettre à jour l'état local ou rediriger
      } else {
        toast.error(result.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Modifier mon profil</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
            <img 
              src={preview || user.avatar.url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Mettre à jour mon profil
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;