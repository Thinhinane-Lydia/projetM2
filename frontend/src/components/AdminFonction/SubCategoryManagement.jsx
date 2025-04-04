
import { useState, useEffect } from "react";
import { 
  Layers, 
  Pencil, 
  Trash2, 
  PlusCircle, 
  X, 
  Tag, 
  ImagePlus 
} from "lucide-react";
import { 
  fetchSubCategories, 
  fetchCategories, 
  fetchSizes, 
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory 
} from "../../utils/api";

const SubCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories, sizes, and subcategories
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const categoriesResult = await fetchCategories();
        const sizesResult = await fetchSizes();

        if (categoriesResult.success) setCategories(categoriesResult.categories);
        if (sizesResult.success) setSizes(sizesResult.sizes);
      } catch (error) {
        console.error("Erreur de chargement initial", error);
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const getSubCategories = async () => {
      if (selectedCategory) {
        try {
          const result = await fetchSubCategories(selectedCategory);
          if (result.success) {
            setSubCategories(result.subCategories);
          } else {
            console.error("Erreur lors de la récupération des sous-catégories", result.message);
          }
        } catch (error) {
          console.error("Erreur de récupération des sous-catégories", error);
        }
      }
    };
    getSubCategories();
  }, [selectedCategory]);

  // Create subcategory
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const subCategoryData = { 
      name, 
      category: selectedCategory, 
      sizes: selectedSizes, 
      image 
    };
    try {
      const result = await createSubCategory(subCategoryData);
      if (result.success) {
        setSubCategories([...subCategories, result.subCategory]);
        resetForm();
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de création de sous-catégorie", error);
    }
  };

  // Update subcategory
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubCategoryId) {
      console.error("Aucune sous-catégorie sélectionnée pour modification.");
      return;
    }

    const subCategoryData = { 
      name, 
      category: selectedCategory, 
      sizes: selectedSizes, 
      image 
    };

    try {
      const result = await updateSubCategory(selectedSubCategoryId, subCategoryData);
      if (result.success) {
        const updatedSubCategories = subCategories.map((subCategory) =>
          subCategory._id === selectedSubCategoryId
            ? { ...subCategory, ...subCategoryData }
            : subCategory
        );
        setSubCategories(updatedSubCategories);
        resetForm();
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de mise à jour de sous-catégorie", error);
    }
  };

  // Delete subcategory
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) return;

    try {
      const result = await deleteSubCategory(id);
      if (result.success) {
        setSubCategories(subCategories.filter((subCategory) => subCategory._id !== id));
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur de suppression de sous-catégorie", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedSubCategoryId(null);
    setName("");
    setImage("");
    setSelectedCategory("");
    setSelectedSizes([]);
  };

  // Select subcategory for editing
  const handleSelectSubCategory = (subCategory) => {
    setSelectedSubCategoryId(subCategory._id);
    setName(subCategory.name);
    setImage(subCategory.image);
    setSelectedCategory(subCategory.category._id);
    setSelectedSizes(subCategory.sizes.map(size => size._id));
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
            <Layers className="w-10 h-10 text-white" strokeWidth={2} />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Gestion des Sous-catégories</h2>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Create/Update SubCategory Section */}
          <div className="space-y-6 bg-amber-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <PlusCircle className="w-6 h-6 text-amber-600" />
              <span>{selectedSubCategoryId ? "Modifier la sous-catégorie" : "Créer une sous-catégorie"}</span>
            </h3>
            <form onSubmit={selectedSubCategoryId ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
              {/* Nom de la sous-catégorie */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nom de la sous-catégorie" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              </div>

              {/* URL de l'image */}
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

              {/* Sélection de la catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>

              {/* Sélection des tailles */}
              <select
                multiple
                value={selectedSizes}
                onChange={(e) => setSelectedSizes(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all h-32"
              >
                {sizes.map((size) => (
                  <option key={size._id} value={size._id}>{size.name}</option>
                ))}
              </select>

              {/* Boutons d'action */}
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl transition-colors duration-300 transform hover:scale-[1.02]"
                >
                  {selectedSubCategoryId ? <Pencil size={20} /> : <PlusCircle size={20} />}
                  <span>{selectedSubCategoryId ? "Modifier" : "Créer"}</span>
                </button>
                {selectedSubCategoryId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <X size={20} />
                    <span>Annuler</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* SubCategories List Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <Layers className="w-6 h-6 text-amber-600" />
              <span>Liste des sous-catégories</span>
            </h3>
            {subCategories && subCategories.length > 0 ? (
              <div className="grid gap-4">
                {subCategories.map((subCategory) => (
                  <div 
                    key={subCategory._id} 
                    className="bg-white border-2 border-amber-200 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-4">
                      {subCategory.image && (
                        <img 
                          src={subCategory.image} 
                          alt={subCategory.name} 
                          className="w-14 h-14 object-cover rounded-full border-2 border-amber-300"
                        />
                      )}
                      <div>
                        <span className="font-medium text-gray-800 text-lg block">{subCategory.name}</span>
                        <span className="text-sm text-gray-500">
                          {subCategory.category.name} | {subCategory.sizes.map(size => size.name).join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleSelectSubCategory(subCategory)}
                        className="text-amber-600 hover:text-amber-800 transition-colors transform hover:scale-110"
                        title="Modifier"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(subCategory._id)}
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
                <p>Aucune sous-catégorie disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryManagement;