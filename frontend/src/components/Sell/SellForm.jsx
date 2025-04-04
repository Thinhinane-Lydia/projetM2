



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
  
  // // 🔥 Chargement du produit si en mode édition
  // useEffect(() => {
  //   if (id) {
  //     const loadProduct = async () => {
  //       const data = await fetchProducts();
  //       const existingProduct = data.products.find((p) => p._id === id);
  //       if (existingProduct) {
  //         setProduct({
  //           name: existingProduct.name,
  //           description: existingProduct.description,
  //           category: existingProduct.category,
  //           subCategory: existingProduct.subCategory,
  //           price: existingProduct.price,
  //           size: existingProduct.size || "",
  //           brand: existingProduct.brand,
  //           material: existingProduct.material,
  //           color: existingProduct.color,
  //           condition: existingProduct.condition,
  //           images: existingProduct.images || [],
  //           seller: existingProduct.seller,
  //         });
          
  //         // 🔥 Préchargement des images
  //         setPreviewImages(existingProduct.images.map(img => img.url));
  //         console.log("🔍 Produit chargé :", existingProduct);
  //         console.log("🛒 Vendeur du produit :", existingProduct.seller);
  //       }
  //     };
  //     loadProduct();
  //   }
  // }, [id]);
  // 🔥 Chargement du produit si en mode édition
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
          // Stocker les métadonnées des images existantes
          images: existingProduct.images || [],
          seller: existingProduct.seller,
        });
        
        // 🔥 Préchargement des images
        if (existingProduct.images && existingProduct.images.length > 0) {
          // Vérifier si les images ont une propriété url
          const imageUrls = existingProduct.images.map(img => typeof img === 'object' && img.url ? img.url : img);
          setPreviewImages(imageUrls);
          console.log("🖼️ Images préchargées:", imageUrls);
        }
        console.log("🔍 Produit chargé :", existingProduct);
        console.log("🛒 Vendeur du produit :", existingProduct.seller);
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
          console.log("🔍 Récupération des sous-catégories pour :", product.category);
          const data = await fetchSubCategories(product.category);
          setSubCategories(data.subCategories);
        } catch (error) {
          console.error("❌ Erreur fetchSubCategories :", error);
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
          console.log("📏 Récupération des tailles pour sous-catégorie :", product.subCategory);
          const data = await fetchSizesBySubCategory(product.subCategory);
          console.log("📊 Données de tailles reçues :", data);
          setSizes(data.sizes || []);
          console.log("🔄 État des tailles après mise à jour :", data.sizes);
        } catch (error) {
          console.error("❌ Erreur fetchSizesBySubCategory :", error);
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
  };

  
  
  // Fonction corrigée pour la gestion des images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Images sélectionnées:", files.length, files);
    
    if (files.length === 0) {
      alert("❌ Sélectionnez au moins une image !");
      return;
    }
    
    // Concaténer les nouvelles images avec les images existantes
    setProduct((prev) => {
      const updatedImages = [...prev.images, ...files].filter(img => img instanceof File);
      console.log("Mise à jour des images:", updatedImages.length, updatedImages);
      return { ...prev, images: updatedImages };
    });
  
    // Créer des URLs pour la prévisualisation et les ajouter aux prévisualisations existantes
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    console.log("URLs de prévisualisation mises à jour");
  };

// Fonction corrigée pour l'envoi du formulaire
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   // Créez un nouvel objet FormData
//   const formData = new FormData();

//   // Ajoutez chaque champ au FormData
//   Object.keys(product).forEach((key) => {
//     if (key === "images") {
//       // Pour les images, ajoutez chaque fichier individuellement
//       for (let i = 0; i < product.images.length; i++) {
//         formData.append("images", product.images[i]);
//       }
//     } else if (product[key]) {
//       // Pour les autres champs, ajoutez-les s'ils existent
//       formData.append(key, product[key]);
//     }
//   });

//   try {
//     let response;
//     if (id) {
//       // Mode modification
//       console.log("Envoi de la modification du produit ID:", id);
//       response = await updateProduct(id, formData);
//     } else {
//       // Mode création
//       console.log("Création d'un nouveau produit");
//       response = await createProduct(formData);
//     }

//     console.log("Réponse du serveur:", response);

//     if (response.success) {
//       alert(id ? "✅ Produit modifié avec succès !" : "✅ Produit ajouté avec succès !");
//       navigate("/Profil");
//     } else {
//       alert(`❌ Erreur: ${response.message || "Une erreur est survenue."}`);
//     }
//   } catch (error) {
//     console.error("Erreur pendant la soumission:", error);
//     alert("❌ Une erreur s'est produite. Veuillez réessayer.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Créer un nouvel objet FormData
  const formData = new FormData();

  // Ajouter chaque champ au FormData
  Object.keys(product).forEach((key) => {
    if (key === "images") {
      // Pour les images, ajouter chaque fichier individuellement
      product.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
          console.log(`Image ajoutée au FormData: ${image.name}`);
        }
      });
    } else if (product[key]) {
      // Pour les autres champs, les ajouter s'ils existent
      formData.append(key, product[key]);
    }
  });

  try {
    let response;
    if (id) {
      // Mode modification
      console.log("Envoi de la modification du produit ID:", id);
      response = await updateProduct(id, formData);
    } else {
      // Mode création
      console.log("Création d'un nouveau produit");
      response = await createProduct(formData);
    }

    console.log("Réponse du serveur:", response);

    if (response.success) {
      alert(id ? "✅ Produit modifié avec succès !" : "✅ Produit ajouté avec succès !");
      navigate("/Profil");
    } else {
      alert(`❌ Erreur: ${response.message || "Une erreur est survenue."}`);
    }
  } catch (error) {
    console.error("Erreur pendant la soumission:", error);
    alert("❌ Une erreur s'est produite. Veuillez réessayer.");
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

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-amber-200">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">
          {id ? "Modifier un article" : "Vendre un article"}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       {/* Colonne de gauche */}
        <div className="space-y-5">
          <div className="space-y-1">
             <label htmlFor="name" className="block text-sm font-medium text-amber-900">Nom du produit</label>
             <input 
                type="text" 
                id="name" 
                name="name" 
                value={product.name} 
                onChange={handleChange} 
                placeholder="Ex: Veste en cuir noir" 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="category" className="block text-sm font-medium text-amber-900">Catégorie</label>
              <select 
                id="category" 
                name="category" 
                value={product.category} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>

            {subCategories.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="subCategory" className="block text-sm font-medium text-amber-900">Sous-catégorie</label>
                <select 
                  id="subCategory" 
                  name="subCategory" 
                  value={product.subCategory} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  {subCategories.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-amber-900">Prix (DA)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={product.price} 
                onChange={handleChange} 
                placeholder="Ex: 5000" 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="brand" className="block text-sm font-medium text-amber-900">Marque</label>
              <select 
                id="brand" 
                name="brand" 
                value={product.brand} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              >
                <option value="">Sélectionner une marque</option>
                {["Zara", "Nike", "Adidas","H&M","Chanel","Gucci","Shein","Puma","New Balance","Levis","PULL&BEAR","stradivarius","Bershka","Primark","autre"].map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="space-y-5">
            {Array.isArray(sizes) && sizes.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="size" className="block text-sm font-medium text-amber-900">Taille</label>
                <select 
                  id="size" 
                  name="size" 
                  value={product.size} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
                >
                  <option value="">Sélectionner une taille</option>
                  {sizes.map((size) => <option key={size._id} value={size._id}>{size.name}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="color" className="block text-sm font-medium text-amber-900">Couleur</label>
              <select 
                id="color" 
                name="color" 
                value={product.color} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              >
                <option value="">Sélectionner une couleur</option>
                {["blanc","noir","rouge","bleu","rose","marron","beige","vert","jaune","orange","violet","gris","melange de couleurs","autre"].map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="material" className="block text-sm font-medium text-amber-900">Matière</label>
              <select 
                id="material" 
                name="material" 
                value={product.material} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              >
                <option value="">Sélectionner une matière</option>
                {["Coton","Lin","Laine","Soie","Polyester","Nylon","Cuir","Satin","Acier inoxydable","Jean","Autre"].map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="condition" className="block text-sm font-medium text-amber-900">État</label>
              <select 
                id="condition" 
                name="condition" 
                value={product.condition} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
              >
                <option value="">État du produit</option>
                {["Neuf", "Bon état", "Usé"].map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description - occupe toute la largeur */}
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-amber-900">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            placeholder="Décrivez votre article en détail (état, particularités, défauts éventuels...)" 
            rows="5" 
            required 
            className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-150"
          />
        </div>

        {/* Section photos */}
        <div className="space-y-4">
          <label htmlFor="images" className="block text-center p-8 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 cursor-pointer hover:bg-amber-100 transition duration-150">
            <div className="flex flex-col items-center">
              <svg className="w-14 h-14 text-amber-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-medium text-amber-800 text-lg">Ajouter des photos</span>
              <span className="text-sm text-amber-600 mt-1">Cliquez ou glissez-déposez des images</span>
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

        
          {/* {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-amber-900 mb-2">Prévisualisations ({previewImages.length})</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img src={src} alt={`Prévisualisation ${index + 1}`} className="w-full h-28 object-cover rounded-lg shadow-sm border border-amber-200" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Champs du formulaire (inchangés) */}
        {/* <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-3 px-6 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Traitement en cours..." : id ? "Modifier" : "Mettre en vente"}
        </button>
      </form>
    </div>
  );
};

export default SellForm; */} 

{/* Prévisualisations des images */}
{previewImages.length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-medium text-amber-900 mb-2">Prévisualisations ({previewImages.length})</p>
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
      {previewImages.map((src, index) => (
        <div key={index} className="relative group">
          <img src={src} alt={`Prévisualisation ${index + 1}`} className="w-full h-28 object-cover rounded-lg shadow-sm border border-amber-200" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button 
              type="button"
              onClick={() => removeImage(index)}
              className="text-white bg-red-500 hover:bg-red-600 p-1 rounded-full"
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

{/* Champs du formulaire (inchangés) */}
<button 
  type="submit" 
  disabled={isSubmitting} 
  className="w-full py-3 px-6 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? "Traitement en cours..." : id ? "Modifier" : "Mettre en vente"}
</button>
</form>
</div>
);
};

export default SellForm;