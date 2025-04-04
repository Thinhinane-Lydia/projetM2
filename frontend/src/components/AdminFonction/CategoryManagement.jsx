
import { useState, useEffect } from "react";
import { 
  Pencil, 
  Trash2, 
  PlusCircle, 
  X, 
  Tag, 
  ImagePlus 
} from "lucide-react";
import { createCategory, updateCategory, deleteCategory, fetchCategories } from "../../utils/api";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoading(true);
        const result = await fetchCategories();
        if (result.success) {
          setCategories(result.categories);
        } else {
          console.error("Erreur lors de la récupération des catégories", result.message);
        }
      } catch (error) {
        console.error("Erreur de récupération des catégories", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCategories();
  }, []);

  // Create category
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name, image };
    try {
      const result = await createCategory(categoryData);
      if (result.success) {
        setCategories([...categories, result.category]);
        setName("");
        setImage("");
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de création de catégorie", error);
    }
  };

  // Update category
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      console.error("Aucune catégorie sélectionnée pour modification.");
      return;
    }
    const categoryData = { name, image };
    try {
      const result = await updateCategory(selectedCategoryId, categoryData);
      if (result.success) {
        const updatedCategories = categories.map((category) =>
          category._id === selectedCategoryId ? { ...category, name, image } : category
        );
        setCategories(updatedCategories);
        setSelectedCategoryId(null);
        setName("");
        setImage("");
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de mise à jour de catégorie", error);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories(categories.filter((category) => category._id !== id));
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de suppression de catégorie", error);
    }
  };

  // Select category for editing
  const handleSelectCategory = (category) => {
    setSelectedCategoryId(category._id);
    setName(category.name);
    setImage(category.image);
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
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-200 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Tag className="w-10 h-10 text-white" strokeWidth={2} />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Gestion des Catégories</h2>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Create/Update Category Section */}
          <div className="space-y-6 bg-amber-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <PlusCircle className="w-6 h-6 text-amber-600" />
              <span>{selectedCategoryId ? "Modifier la catégorie" : "Créer une catégorie"}</span>
            </h3>
            <form onSubmit={selectedCategoryId ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nom de la catégorie" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="URL de l'image" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              </div>
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl transition-colors duration-300 transform hover:scale-[1.02]"
                >
                  {selectedCategoryId ? <Pencil size={20} /> : <PlusCircle size={20} />}
                  <span>{selectedCategoryId ? "Modifier" : "Créer"}</span>
                </button>
                {selectedCategoryId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setName("");
                      setImage("");
                    }}
                    className="flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <X size={20} />
                    <span>Annuler</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <Tag className="w-6 h-6 text-amber-600" />
              <span>Liste des catégories</span>
            </h3>
            {categories && categories.length > 0 ? (
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="bg-white border-2 border-amber-200 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-4">
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-14 h-14 object-cover rounded-full border-2 border-amber-300"
                        />
                      )}
                      <span className="font-medium text-gray-800 text-lg">{category.name}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleSelectCategory(category)}
                        className="text-amber-600 hover:text-amber-800 transition-colors transform hover:scale-110"
                        title="Modifier"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-110"
                        title="Supprimer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-amber-100 rounded-xl p-8 text-amber-800">
                <p>Aucune catégorie disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;