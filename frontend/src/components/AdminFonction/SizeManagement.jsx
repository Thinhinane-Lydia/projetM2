
import { useState, useEffect } from "react";
import { 
  Ruler, 
  Trash2, 
  PlusCircle, 
  Tag 
} from "lucide-react";
import { fetchSizes, createSize, deleteSize } from "../../utils/api";

const SizeManagement = () => {
  const [sizes, setSizes] = useState([]); 
  const [name, setName] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer toutes les tailles
  useEffect(() => {
    const getSizes = async () => {
      setIsLoading(true);
      const result = await fetchSizes();
      if (result.success) {
        setSizes(result.sizes);
      } else {
        console.error("Erreur lors de la récupération des tailles", result.message);
      }
      setIsLoading(false);
    };

    getSizes();
  }, []); 

  // Ajouter une nouvelle taille
  const handleAddSize = async (e) => {
    e.preventDefault();
    const sizeData = { name };
    const result = await createSize(sizeData);
    if (result.success) {
      setSizes([...sizes, result.size]); 
      setName(""); 
    } else {
      console.error("Erreur:", result.message);
    }
  };

  // Supprimer une taille
  const handleDeleteSize = async (sizeId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette taille ?")) return;

    const response = await deleteSize(sizeId);

    if (response.success) {
      const updatedSizes = sizes.filter((size) => size._id !== sizeId);
      setSizes(updatedSizes);
    } else {
      alert("Erreur lors de la suppression de la taille !");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6 md:p-12 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-200 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Ruler className="w-10 h-10 text-white" strokeWidth={2} />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Gestion des Tailles</h2>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Ajouter une nouvelle taille */}
          <div className="space-y-6 bg-amber-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <PlusCircle className="w-6 h-6 text-amber-600" />
              <span>Ajouter une nouvelle taille</span>
            </h3>
            <form onSubmit={handleAddSize} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nom de la taille" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              </div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl transition-colors duration-300 transform hover:scale-[1.02]"
              >
                <PlusCircle size={20} />
                <span>Ajouter la taille</span>
              </button>
            </form>
          </div>

          {/* Liste des tailles */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <Ruler className="w-6 h-6 text-amber-600" />
              <span>Liste des tailles</span>
            </h3>
            {sizes && sizes.length > 0 ? (
              <div className="grid gap-4">
                {sizes.map((size) => (
                  <div 
                    key={size._id} 
                    className="bg-white border-2 border-amber-200 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span className="font-medium text-gray-800 text-lg">{size.name}</span>
                    <button 
                      onClick={() => handleDeleteSize(size._id)}
                      className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-110"
                      title="Supprimer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-amber-100 rounded-xl p-8 text-amber-800">
                <p>Aucune taille disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeManagement;