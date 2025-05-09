import React, { useState, useEffect } from "react";
import { fetchUser, updateUserProfile } from "../../utils/api";
import { toast } from "react-toastify";
import { 
  Camera, User, Phone, Mail, MapPin, 
  Loader2, Check
} from "lucide-react";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUser();
        
        if (response.success && response.user) {
          const u = response.user;
          setUser(u);
          setName(u.name || "");
          setPhoneNumber(u.phoneNumber || "");
          
          if (u.addresses && u.addresses.length > 0 && u.addresses[0].address1) {
            setAddress(u.addresses[0].address1);
          } else {
            setAddress("");
          }
          
          // Correction ici: même logique que dans InfoPers.jsx
          if (u.avatar && u.avatar.url) {
            setPreviewUrl(`http://localhost:8000${u.avatar.url}`);
          }
        } else {
          toast.error("Impossible de charger le profil");
        }
      } catch (err) {
        toast.error("Erreur inattendue");
      }
    };
    loadUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      formData.append("name", name);
      if (phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (address) formData.append("address", address);
      if (avatarFile) formData.append("avatar", avatarFile);

      const result = await updateUserProfile(formData);

      if (result.success) {
        setFormSubmitted(true);
        setTimeout(() => {
          toast.success("Profil mis à jour avec succès !");
          setFormSubmitted(false);
          if (result.user) {
            setUser(result.user);
            // Si l'avatar a été mis à jour dans la réponse
            if (result.user.avatar && result.user.avatar.url) {
              setPreviewUrl(`http://localhost:8000${result.user.avatar.url}`);
            }
          }
        }, 1500);
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      toast.error("Erreur inattendue lors de la mise à jour");
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin mb-4">
            <Loader2 className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header with avatar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Votre Profil</h2>
            
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mx-auto">
                {previewUrl ? (
                  <img 
                    src={previewUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-600">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer hover:bg-amber-50 shadow-md">
                <Camera className="h-4 w-4 text-amber-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
        </div>
          
        {/* Form content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Identity Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-md">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Identité</h3>
              </div>
              
              <div className="group">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            
            <hr className="my-6" />
            
            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-md">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Contact</h3>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <label className="text-sm text-gray-500 block">
                      Email (non modifiable)
                    </label>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de téléphone
                </label>
                <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                  <div className="flex items-center justify-center px-4 bg-gray-50">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full px-4 py-3 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <hr className="my-6" />
            
            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-md">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Localisation</h3>
              </div>
              
              <div className="group">
                <label 
                  htmlFor="address" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse complète
                </label>
                <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-4 py-3 focus:outline-none"
                  />
                  <div className="flex items-center px-4">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="bg-gray-50 px-6 py-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70 relative"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Enregistrement...
                </span>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
          
          {/* Success overlay */}
          {formSubmitted && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-md z-50">
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-gray-800">Profil mis à jour</p>
                <p className="text-sm text-gray-500">Vos modifications ont été enregistrées</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;