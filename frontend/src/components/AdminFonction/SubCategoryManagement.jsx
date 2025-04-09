// import { useState, useEffect } from "react";
// import { 
//   Layers, 
//   Pencil, 
//   Trash2, 
//   PlusCircle, 
//   X, 
//   Tag, 
//   ImagePlus,
//   Check 
// } from "lucide-react";
// import { 
//   fetchSubCategories, 
//   fetchCategories, 
//   fetchSizes, 
//   createSubCategory, 
//   updateSubCategory, 
//   deleteSubCategory 
// } from "../../utils/api";

// const SubCategoryManagement = () => {
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [allSizes, setAllSizes] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch categories, sizes, and subcategories
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         const categoriesResult = await fetchCategories();
//         const sizesResult = await fetchSizes();

//         if (categoriesResult.success) setCategories(categoriesResult.categories);
//         if (sizesResult.success) {
//           setSizes(sizesResult.sizes);
//           setAllSizes(sizesResult.sizes);
//         }
//       } catch (error) {
//         console.error("Erreur de chargement initial", error);
//       }
//       setIsLoading(false);
//     };

//     fetchInitialData();
//   }, []);

//   // Fetch subcategories when a category is selected
//   useEffect(() => {
//     const getSubCategories = async () => {
//       if (selectedCategory) {
//         try {
//           const result = await fetchSubCategories(selectedCategory);
//           if (result.success) {
//             setSubCategories(result.subCategories);
//           } else {
//             console.error("Erreur lors de la récupération des sous-catégories", result.message);
//           }
//         } catch (error) {
//           console.error("Erreur de récupération des sous-catégories", error);
//         }
//       }
//     };
//     getSubCategories();
//   }, [selectedCategory]);

//   // Gestion du fichier image

//  const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setImageFile(file);  // Définir l'image dans l'état
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);  // Utiliser base64 pour l'aperçu
//     };
//     reader.readAsDataURL(file);
//   }
// };


// const handleCreateSubmit = async (e) => {
//   e.preventDefault();
//    // Ajout de logs pour vérifier les valeurs des champs
//    console.log("Nom:", name);
//    console.log("Catégorie sélectionnée:", selectedCategory);
//    console.log("Tailles sélectionnées:", selectedSizes);
//    console.log("Fichier image:", imageFile);
//    console.log("Aperçu de l'image:", imagePreview);

//   // Vérifier si le nom, la catégorie, ou l'image sont manquants
//   if (!name || !selectedCategory || (!imageFile && !imagePreview)) {
//     alert("Veuillez remplir tous les champs obligatoires");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("name", name);
//   formData.append("category", selectedCategory);

//   selectedSizes.forEach(sizeId => {
//     formData.append("sizes[]", sizeId);
//   });

//   // Si une image est téléchargée, on l'ajoute
//   if (imageFile) {
//     formData.append("image", imageFile); // Image téléchargée en tant que fichier
//   } else if (imagePreview) {
//     formData.append("image", imagePreview); // Image sous forme de URL
//   }

//   try {
//     const result = await createSubCategory(formData); // Envoi avec FormData
//     if (result.success) {
//       setSubCategories([...subCategories, result.subCategory]);
//       resetForm();
//     } else {
//       console.error("Erreur:", result.message);
//       alert(result.message);
//     }
//   } catch (error) {
//     console.error("Erreur de création de sous-catégorie", error);
//     alert("Erreur lors de la création de la sous-catégorie");
//   }
// };



//   // const handleUpdateSubmit = async (e) => {
//   //   e.preventDefault();
  
//   //   if (!selectedSubCategoryId) {
//   //     console.error("Aucune sous-catégorie sélectionnée pour modification.");
//   //     return;
//   //   }
  
//   //   if (!name || !selectedCategory) {
//   //     alert("Veuillez remplir tous les champs obligatoires");
//   //     return;
//   //   }
  
//   //   const formData = new FormData();
//   //   formData.append("name", name);
//   //   formData.append("category", selectedCategory);
  
//   //   selectedSizes.forEach(sizeId => {
//   //     formData.append("sizes[]", sizeId);
//   //   });
  
//   //   if (imageFile) {
//   //     formData.append("image", imageFile); // Si une nouvelle image est téléchargée
//   //   }
  
//   //   try {
//   //     const result = await updateSubCategory(selectedSubCategoryId, formData); // envoie avec FormData
  
//   //     if (result.success) {
//   //       const updatedSubCategories = subCategories.map((subCategory) =>
//   //         subCategory._id === selectedSubCategoryId
//   //           ? { ...subCategory, ...result.subCategory }
//   //           : subCategory
//   //       );
  
//   //       setSubCategories(updatedSubCategories);
//   //       resetForm();
//   //     } else {
//   //       console.error("Erreur:", result.message);
//   //       alert(result.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Erreur de mise à jour de sous-catégorie", error);
//   //     alert("Erreur lors de la mise à jour de la sous-catégorie");
//   //   }
//   // };
  
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!selectedSubCategoryId) {
//       console.error("Aucune sous-catégorie sélectionnée pour modification.");
//       return;
//     }
  
//     if (!name || !selectedCategory) {
//       alert("Veuillez remplir tous les champs obligatoires");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("category", selectedCategory);
  
//     selectedSizes.forEach(sizeId => {
//       formData.append("sizes[]", sizeId);
//     });
  
//     // Si une nouvelle image est téléchargée
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }
  
//     try {
//       const result = await updateSubCategory(selectedSubCategoryId, formData); // Envoi avec FormData
  
//       if (result.success) {
//         const updatedSubCategories = subCategories.map((subCategory) =>
//           subCategory._id === selectedSubCategoryId
//             ? { ...subCategory, ...result.subCategory }
//             : subCategory
//         );
//         setSubCategories(updatedSubCategories);
//         resetForm();
//       } else {
//         console.error("Erreur:", result.message);
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error("Erreur de mise à jour de sous-catégorie", error);
//       alert("Erreur lors de la mise à jour de la sous-catégorie");
//     }
//   };
  
//   // Suppression de sous-catégorie
//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) return;

//     try {
//       const result = await deleteSubCategory(id);
//       if (result.success) {
//         setSubCategories(subCategories.filter((subCategory) => subCategory._id !== id));
//       } else {
//         console.error("Erreur:", result.message);
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error("Erreur de suppression de sous-catégorie", error);
//       alert("Erreur lors de la suppression de la sous-catégorie");
//     }
//   };

//   // Réinitialisation du formulaire
//   const resetForm = () => {
//     setSelectedSubCategoryId(null);
//     setName("");
//     setImageFile(null);
//     setImagePreview("");
//     setSelectedCategory("");
//     setSelectedSizes([]);
//   };

//   // Sélection d'une sous-catégorie pour modification
//   const handleSelectSubCategory = (subCategory) => {
//     setSelectedSubCategoryId(subCategory._id);
//     setName(subCategory.name);
    
//     // Réinitialiser l'image
//     setImageFile(null);
//     setImagePreview(subCategory.image || "");
    
//     // Sélectionner la catégorie
//     setSelectedCategory(subCategory.category._id);
    
//     // Sélectionner les tailles
//     setSelectedSizes(subCategory.sizes.map(size => size._id));
//   };

//   // Gestion de la sélection des tailles
//   const toggleSizeSelection = (sizeId) => {
//     setSelectedSizes(prev => 
//       prev.includes(sizeId) 
//         ? prev.filter(id => id !== sizeId)
//         : [...prev, sizeId]
//     );
//   };

//   // État de chargement
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-amber-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-amber-50 p-6 md:p-12 flex justify-center items-start">
//       <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-200 transform transition-all duration-300 hover:scale-[1.01]">
//         <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-6 md:p-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Layers className="w-10 h-10 text-white" strokeWidth={2} />
//             <h2 className="text-2xl md:text-3xl font-bold text-white">Gestion des Sous-catégories</h2>
//           </div>
//         </div>

//         <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
//           {/* Formulaire de création/modification */}
//           <div className="space-y-6 bg-amber-50 p-6 rounded-xl shadow-inner">
//             <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
//               <PlusCircle className="w-6 h-6 text-amber-600" />
//               <span>{selectedSubCategoryId ? "Modifier la sous-catégorie" : "Créer une sous-catégorie"}</span>
//             </h3>
            
//             <form onSubmit={selectedSubCategoryId ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
//               {/* Nom de la sous-catégorie */}
//               <div className="relative">
//                 <input 
//                   type="text" 
//                   placeholder="Nom de la sous-catégorie" 
//                   value={name} 
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 pl-10 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
//                 />
//                 <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
//               </div>

//               {/* Téléchargement de l'image */}
//               <div className="space-y-2">
//                 <div className="relative">
//                   <input 
//                     type="file" 
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
//                   />
//                   <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
//                 </div>
                
//                 {/* Prévisualisation de l'image
//                 {imagePreview && (
//                   <div className="mt-2 flex justify-center">
//                     <img 
//                       src={imagePreview} 
//                       alt="Aperçu" 
//                       className="max-w-full h-40 object-cover rounded-xl"
//                     />
//                   </div>
//                 )} */}
//                 {/* Prévisualisation de l'image */}
// {/* {imagePreview && (
//   <div className="mt-2 flex justify-center">
//     <img 
//       src={
//         imagePreview.startsWith("http")
//           ? imagePreview  // Si l'URL commence par "http", utilise-le directement
//           : `http://localhost:8000/${imagePreview}`  // Sinon, construis l'URL complète
//       }
//       alt="Aperçu"
//       className="max-w-full h-40 object-cover rounded-xl"
//     />
//   </div>
// )} */}
// {imagePreview && (
//   <div className="mt-2 flex justify-center">
//     <img 
//       src={imagePreview}  // Utiliser imagePreview pour l'affichage en base64
//       alt="Aperçu"
//       className="max-w-full h-40 object-cover rounded-xl"
//     />
//   </div>
// )}

//               </div>

//               {/* Sélection de la catégorie */}
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
//               >
//                 <option value="">Sélectionner une catégorie</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>{category.name}</option>
//                 ))}
//               </select>

//               {/* Sélection des tailles */}
//               <div className="space-y-2">
//                 <h4 className="text-amber-800 font-semibold">Sélectionner les tailles</h4>
//                 <div className="grid grid-cols-3 gap-2">
//                   {allSizes.map((size) => (
//                     <button
//                       key={size._id}
//                       type="button"
//                       onClick={() => toggleSizeSelection(size._id)}
//                       className={`
//                         py-2 px-3 rounded-lg transition-all duration-300
//                         ${selectedSizes.includes(size._id) 
//                           ? 'bg-amber-600 text-white' 
//                           : 'bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-100'
//                         }
//                       `}
//                     >
//                       {size.name}
//                       {selectedSizes.includes(size._id) && <Check className="inline ml-2" size={16} />}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Boutons d'action */}
//               <div className="flex space-x-4">
//                 <button 
//                   type="submit" 
//                   className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl transition-colors duration-300 transform hover:scale-[1.02]"
//                 >
//                   {selectedSubCategoryId ? <Pencil size={20} /> : <PlusCircle size={20} />}
//                   <span>{selectedSubCategoryId ? "Modifier" : "Créer"}</span>
//                 </button>
//                 {selectedSubCategoryId && (
//                   <button 
//                     type="button"
//                     onClick={resetForm}
//                     className="flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
//                   >
//                     <X size={20} />
//                     <span>Annuler</span>
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* Liste des sous-catégories */}
//           <div className="space-y-6">
//             <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
//               <Layers className="w-6 h-6 text-amber-600" />
//               <span>Liste des sous-catégories</span>
//             </h3>
            
//             {/* Sélection de catégorie pour filtrer les sous-catégories */}
//             <div className="mb-4">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
//               >
//                 <option value="">Toutes les sous-catégories</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>{category.name}</option>
//                 ))}
//               </select>
//             </div>

//             {subCategories && subCategories.length > 0 ? (
//               <div className="grid gap-4">
//                 {subCategories.map((subCategory) => (
//                   <div 
//                     key={subCategory._id} 
//                     className="bg-white border-2 border-amber-200 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
//                   >
//                     <div className="flex items-center space-x-4">
//                       {subCategory.image && (
//                         <img 
//                           src={subCategory.image} 
//                           alt={subCategory.name} 
//                           className="w-14 h-14 object-cover rounded-full border-2 border-amber-300"
//                         />
//                       )}
//                       <div>
//                         <span className="font-medium text-gray-800 text-lg block">{subCategory.name}</span>
//                         <span className="text-sm text-gray-500">
//                           {subCategory.category.name} | Tailles : {subCategory.sizes.map(size => size.name).join(', ')}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex space-x-3">
//                       <button 
//                         onClick={() => handleSelectSubCategory(subCategory)}
//                         className="text-amber-600 hover:text-amber-800 transition-colors transform hover:scale-110"
//                         title="Modifier"
//                       >
//                         <Pencil size={20} />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(subCategory._id)}
//                         className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-110"
//                         title="Supprimer"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center bg-amber-100 rounded-xl p-8 text-amber-800">
//                 <p>Aucune sous-catégorie disponible</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubCategoryManagement;
import { useState, useEffect } from "react";
import { 
  Layers, 
  Pencil, 
  Trash2, 
  PlusCircle, 
  X, 
  Tag, 
  ImagePlus,
  Check 
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allSizes, setAllSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const categoriesResult = await fetchCategories();
        const sizesResult = await fetchSizes();

        if (categoriesResult.success) setCategories(categoriesResult.categories);
        if (sizesResult.success) {
          setSizes(sizesResult.sizes);
          setAllSizes(sizesResult.sizes);
        }
      } catch (error) {
        console.error("Erreur de chargement initial", error);
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    console.log("Nom:", name);
    console.log("Catégorie sélectionnée:", selectedCategory);
    console.log("Tailles sélectionnées:", selectedSizes);
    console.log("Fichier image:", imageFile);
    console.log("Aperçu de l'image:", imagePreview);

    if (!name || !selectedCategory || (!imageFile && !imagePreview)) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedCategory);

    selectedSizes.forEach(sizeId => {
      formData.append("sizes[]", sizeId);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imagePreview) {
      formData.append("image", imagePreview);
    }

    try {
      const result = await createSubCategory(formData);
      if (result.success) {
        setSubCategories([...subCategories, result.subCategory]);
        resetForm();
      } else {
        console.error("Erreur:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Erreur de création de sous-catégorie", error);
      alert("Erreur lors de la création de la sous-catégorie");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubCategoryId) {
      console.error("Aucune sous-catégorie sélectionnée pour modification.");
      return;
    }

    if (!name || !selectedCategory) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedCategory);

    selectedSizes.forEach(sizeId => {
      formData.append("sizes[]", sizeId);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const result = await updateSubCategory(selectedSubCategoryId, formData);

      if (result.success) {
        const updatedSubCategories = subCategories.map((subCategory) =>
          subCategory._id === selectedSubCategoryId
            ? { ...subCategory, ...result.subCategory }
            : subCategory
        );
        setSubCategories(updatedSubCategories);
        resetForm();
      } else {
        console.error("Erreur:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Erreur de mise à jour de sous-catégorie", error);
      alert("Erreur lors de la mise à jour de la sous-catégorie");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) return;

    try {
      const result = await deleteSubCategory(id);
      if (result.success) {
        setSubCategories(subCategories.filter((subCategory) => subCategory._id !== id));
      } else {
        console.error("Erreur:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Erreur de suppression de sous-catégorie", error);
      alert("Erreur lors de la suppression de la sous-catégorie");
    }
  };

  const resetForm = () => {
    setSelectedSubCategoryId(null);
    setName("");
    setImageFile(null);
    setImagePreview("");
    setSelectedCategory("");
    setSelectedSizes([]);
  };

  const handleSelectSubCategory = (subCategory) => {
    setSelectedSubCategoryId(subCategory._id);
    setName(subCategory.name);
    setImageFile(null);
    setImagePreview(subCategory.image || "");
    setSelectedCategory(subCategory.category._id);
    setSelectedSizes(subCategory.sizes.map(size => size._id));
  };

  const toggleSizeSelection = (sizeId) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId) 
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-12 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-200 transform transition-all duration-300 hover:scale-[1.01]">
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-4 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Layers className="w-10 h-10 text-white" strokeWidth={2} />
            <h2 className="text-2xl font-bold text-white">Gestion des Sous-catégories</h2>
          </div>
        </div>

        <div className="p-4 md:p-8 grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6 bg-amber-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <PlusCircle className="w-6 h-6 text-amber-600" />
              <span>{selectedSubCategoryId ? "Modifier la sous-catégorie" : "Créer une sous-catégorie"}</span>
            </h3>
            
            <form onSubmit={selectedSubCategoryId ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                  <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                </div>
                
                {imagePreview && (
                  <div className="mt-2 flex justify-center">
                    <img 
                      src={imagePreview}
                      alt="Aperçu"
                      className="max-w-full h-40 object-cover rounded-xl"
                    />
                  </div>
                )}

              </div>

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

              <div className="space-y-2">
                <h4 className="text-amber-800 font-semibold">Sélectionner les tailles</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size._id}
                      type="button"
                      onClick={() => toggleSizeSelection(size._id)}
                      className={`
                        py-2 px-3 rounded-lg transition-all duration-300
                        ${selectedSizes.includes(size._id) 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-100'
                        }
                      `}
                    >
                      {size.name}
                      {selectedSizes.includes(size._id) && <Check className="inline ml-2" size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                    className="flex-1 flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <X size={20} />
                    <span>Annuler</span>
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-800 flex items-center space-x-3">
              <Layers className="w-6 h-6 text-amber-600" />
              <span>Liste des sous-catégories</span>
            </h3>
            
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="">Toutes les sous-catégories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            {subCategories && subCategories.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {subCategories.map((subCategory) => (
                  <div 
                    key={subCategory._id}
                    className="bg-white border-2 border-amber-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
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
                          {subCategory.category.name} | Tailles : {subCategory.sizes.map(size => size.name).join(', ')}
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