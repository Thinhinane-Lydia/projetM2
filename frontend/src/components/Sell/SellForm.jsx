import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCategories, fetchSubCategories, fetchSizesBySubCategory, createProduct, updateProduct, fetchUser, fetchProducts } from "../../utils/api";

const SellForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    size: "",
    brand: "",
    material: "",
    color: "",
    condition: "",
    images: [],
    seller: ""
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  // Chargement du produit si en mode édition
  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        const data = await fetchProducts();
        const existingProduct = data.products.find((p) => p._id === id);
        if (existingProduct) {
          setProduct({
            name: existingProduct.name,
            description: existingProduct.description,
            category: existingProduct.category,
            subCategory: existingProduct.subCategory,
            price: existingProduct.price,
            size: existingProduct.size || "",
            brand: existingProduct.brand,
            material: existingProduct.material,
            color: existingProduct.color,
            condition: existingProduct.condition,
            images: existingProduct.images || [],
            seller: existingProduct.seller,
          });
          
          if (existingProduct.images && existingProduct.images.length > 0) {
            const imageUrls = existingProduct.images.map(img => typeof img === 'object' && img.url ? img.url : img);
            setPreviewImages(imageUrls);
          }
        }
      };
      loadProduct();
    }
  }, [id]);
  
  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUser();
      if (userData.success) {
        setProduct((prev) => ({ ...prev, seller: userData.user._id }));
      }
    };
    loadUser();
  }, [id]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.categories);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (product.category) {
      const loadSubCategories = async () => {
        try {
          const data = await fetchSubCategories(product.category);
          setSubCategories(data.subCategories);
        } catch (error) {
          console.error("Erreur fetchSubCategories:", error);
        }
      };
      loadSubCategories();
    } else {
      setSubCategories([]);
      setProduct((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [product.category]);
  
  useEffect(() => {
    if (product.subCategory) {
      const loadSizes = async () => {
        try {
          const data = await fetchSizesBySubCategory(product.subCategory);
          setSizes(data.sizes || []);
        } catch (error) {
          console.error("Erreur fetchSizesBySubCategory:", error);
        }
      };
      loadSizes();
    } else {
      setSizes([]);
      setProduct((prev) => ({ ...prev, size: "" }));
    }
  }, [product.subCategory]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: ""});
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      return;
    }
    
    setProduct((prev) => {
      const updatedImages = [...prev.images, ...files].filter(img => img instanceof File);
      return { ...prev, images: updatedImages };
    });
  
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation finale avant soumission
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (key === "images") {
        product.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      } else if (product[key]) {
        formData.append(key, product[key]);
      }
    });

    try {
      let response;
      if (id) {
        response = await updateProduct(id, formData);
      } else {
        response = await createProduct(formData);
      }

      if (response.success) {
        showNotification(id ? "Article modifié avec succès!" : "Article ajouté avec succès!");
        navigate("/Profil");
      } else {
        showNotification(`Erreur: ${response.message || "Une erreur est survenue."}`, "error");
      }
    } catch (error) {
      console.error("Erreur pendant la soumission:", error);
      showNotification("Une erreur s'est produite. Veuillez réessayer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setPreviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setProduct((prev) => {
      const updatedImages = prev.images.filter((_, index) => index !== indexToRemove);
      return { ...prev, images: updatedImages };
    });
  };

  const validateStep = (step) => {
    let newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!product.name.trim()) {
        newErrors.name = "Le nom est requis";
        isValid = false;
      }
      if (!product.category) {
        newErrors.category = "La catégorie est requise";
        isValid = false;
      }
      if (!product.subCategory && subCategories.length > 0) {
        newErrors.subCategory = "La sous-catégorie est requise";
        isValid = false;
      }
      if (!product.price || product.price <= 0) {
        newErrors.price = "Entrez un prix valide";
        isValid = false;
      }
    } else if (step === 2) {
      if (sizes.length > 0 && !product.size) {
        newErrors.size = "La taille est requise";
        isValid = false;
      }
      if (!product.brand) {
        newErrors.brand = "La marque est requise";
        isValid = false;
      }
      if (!product.color) {
        newErrors.color = "La couleur est requise";
        isValid = false;
      }
      if (!product.material) {
        newErrors.material = "La matière est requise";
        isValid = false;
      }
      if (!product.condition) {
        newErrors.condition = "L'état est requis";
        isValid = false;
      }
    } else if (step === 3) {
      if (!product.description.trim()) {
        newErrors.description = "La description est requise";
        isValid = false;
      }
      if (previewImages.length === 0) {
        newErrors.images = "Au moins une image est requise";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = (e) => {
    // Empêcher la soumission du formulaire lors du clic sur "Suivant"
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e) => {
    // Empêcher la soumission du formulaire lors du clic sur "Précédent"
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  const showNotification = (message, type = "success") => {
    // Cette fonction serait remplacée par votre système de notification
    alert(message);
  };

  const formSteps = [
    // Étape 1: Informations de base
    <div key="step1" className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Informations de base</h3>
      
      <div className="relative">
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={product.name} 
          onChange={handleChange} 
          placeholder="Nom du produit" 
          className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div className="relative">
        <select 
          id="category" 
          name="category" 
          value={product.category} 
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      
      {subCategories.length > 0 && (
        <div className="relative">
          <select 
            id="subCategory" 
            name="subCategory" 
            value={product.subCategory} 
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.subCategory ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Sélectionner une sous-catégorie</option>
            {subCategories.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
          </select>
          {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center">
          <span className="absolute left-4 text-gray-500">DA</span>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={product.price} 
            onChange={handleChange} 
            placeholder="Prix" 
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
          />
        </div>
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>
    </div>,
    
    // Étape 2: Caractéristiques
    <div key="step2" className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Caractéristiques</h3>
      
      {Array.isArray(sizes) && sizes.length > 0 && (
        <div className="relative">
          <select 
            id="size" 
            name="size" 
            value={product.size} 
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.size ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Sélectionner une taille</option>
            {sizes.map((size) => <option key={size._id} value={size._id}>{size.name}</option>)}
          </select>
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>
      )}
      
      <div className="relative">
        <select 
          id="brand" 
          name="brand" 
          value={product.brand} 
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.brand ? 'border-red-500' : 'border-gray-200'}`}
        >
          <option value="">Sélectionner une marque</option>
          {["Dr. Martens","Zara", "Nike", "Adidas","H&M","Chanel","Gucci","Shein","Puma","New Balance","Levis","PULL&BEAR","stradivarius","Bershka","Primark","autre"].map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <select 
            id="color" 
            name="color" 
            value={product.color} 
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.color ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Sélectionner une couleur</option>
            {["argent","Or","blanc","noir","rouge","bleu","rose","marron","beige","vert","jaune","orange","violet","gris","melange de couleurs","autre"].map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
        </div>
        
        <div className="relative">
          <select 
            id="material" 
            name="material" 
            value={product.material} 
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.material ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Sélectionner une matière</option>
            {["Daim","Velours","Foulard","viscose","Coton","Lin","Laine","Soie","Polyester","Nylon","Denim","Cuir","Satin","Acier inoxydable","Argent","Plaqué Or","Jean","Autre"].map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
          {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
        </div>
      </div>
      
      <div className="relative">
        <div className="grid grid-cols-3 gap-2">
          {["Neuf", "Bon état", "Usé"].map((condition) => (
            <label 
              key={condition} 
              className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                product.condition === condition 
                  ? 'bg-amber-100 border-amber-500 text-amber-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name="condition"
                value={condition}
                checked={product.condition === condition}
                onChange={handleChange}
                className="hidden"
              />
              {condition}
            </label>
          ))}
        </div>
        {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
      </div>
    </div>,
    
    // Étape 3: Description et photos
    <div key="step3" className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Description et Photos</h3>
      
      <div className="relative">
        <textarea 
          id="description" 
          name="description" 
          value={product.description} 
          onChange={handleChange} 
          placeholder="Décrivez votre article en détail (état, particularités, défauts éventuels...)" 
          rows="5" 
          className={`w-full px-4 py-3 bg-gray-50 rounded-lg border-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div className="space-y-4">
        <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 px-4 transition-all duration-300 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 bg-white border-gray-300 hover:border-amber-500 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-amber-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Cliquez pour ajouter</span> ou glissez et déposez
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 5 MB)</p>
          </div>
          <input 
            type="file" 
            id="images" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange} 
            className="hidden" 
          />
        </label>
        {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
        
        {previewImages.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previewImages.map((src, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={src} 
                    alt={`Prévisualisation ${index + 1}`} 
                    className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
            {id ? "Modifier votre article" : "Ajouter un nouvel article"}
          </h2>
          <p className="text-gray-500 mt-2">Complétez les détails de votre article en {formSteps.length} étapes simples</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between">
            {[...Array(formSteps.length)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    currentStep > i + 1 
                      ? 'bg-green-500' 
                      : currentStep === i + 1 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                        : 'bg-gray-300'
                  }`}
                >
                  {currentStep > i + 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-1 ${currentStep === i + 1 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                  {i === 0 ? 'Base' : i === 1 ? 'Détails' : 'Finaliser'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / (formSteps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {formSteps[currentStep - 1]}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button" // Changé de type="button" pour empêcher la soumission du formulaire
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Précédent
              </button>
            )}
            
            {currentStep < formSteps.length ? (
              <button
                type="button" // Changé de type="button" pour empêcher la soumission du formulaire
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:opacity-90 transition-all duration-300 flex items-center"
              >
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <button
                type="submit" // Celui-ci reste en type="submit" car c'est le bouton final
                disabled={isSubmitting}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:opacity-90 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    {id ? "Mettre à jour" : "Mettre en vente"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellForm;