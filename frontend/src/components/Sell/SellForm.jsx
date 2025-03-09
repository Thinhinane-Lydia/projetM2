

// import React, { useState } from "react";
// import { addProduct } from "../../utils/api";
// import { FiUpload, FiTrash2 } from "react-icons/fi";
// import { AiOutlineCheckCircle } from "react-icons/ai";
// import { FaTshirt, FaTags, FaRuler, FaPalette, FaIndustry, FaCubes, FaBoxOpen } from "react-icons/fa";
// import { GiClothes } from "react-icons/gi";

// const categories = {
//   Homme: ["pantalon", "haut", "veste", "chaussure"],
//   Femme: ["pantalon", "haut", "veste", "chaussure", "jupe"],
//   Enfant: ["pantalon", "haut", "veste", "chaussure"],
// };

// const conditions = ["Neuf", "Bon état", "Usé"];

// const SellForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     subCategory: "",
//     size: "",
//     brand: "",
//     material: "",
//     color: "",
//     condition: "",
//     images: [],
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       url: URL.createObjectURL(file), // Aperçu visuel
//       file: file, // Pour l'upload au serveur
//     }));

//     setFormData({ ...formData, images: [...formData.images, ...newImages] });
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.images];
//     updatedImages.splice(index, 1);
//     setFormData({ ...formData, images: updatedImages });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Préparer les images pour correspondre au modèle Mongoose
//     const imagesToUpload = formData.images.map((img) => ({ url: img.url }));

//     const finalData = {
//       ...formData,
//       price: Number(formData.price),
//       images: imagesToUpload,
//     };

//     try {
//       await addProduct(finalData);
//       alert("Produit ajouté avec succès !");
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//         subCategory: "",
//         size: "",
//         brand: "",
//         material: "",
//         color: "",
//         condition: "",
//         images: [],
//       });
//     } catch (error) {
//       console.error("Erreur :", error);
//       alert("Erreur lors de l'ajout du produit");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-gray-50 p-10 rounded-lg shadow-xl mt-28 animate-fadeIn">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
//         <AiOutlineCheckCircle className="text-green-500" />
//         Ajouter un produit
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* 🔹 Nom */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <FaTshirt className="text-gray-500 mr-3" />
//           <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required className="w-full outline-none bg-transparent" />
//         </div>

//         {/* 🔹 Description */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <FaTags className="text-gray-500 mr-3" />
//           <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full outline-none bg-transparent resize-none"></textarea>
//         </div>

//         {/* 🔹 Prix */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <FaBoxOpen className="text-gray-500 mr-3" />
//           <input type="number" name="price" placeholder="Prix (€)" value={formData.price} onChange={handleChange} required className="w-full outline-none bg-transparent" />
//         </div>

//         {/* 🔹 Catégorie */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <GiClothes className="text-gray-500 mr-3" />
//           <select name="category" value={formData.category} onChange={handleChange} required className="w-full outline-none bg-transparent">
//             <option value="">Sélectionnez une catégorie</option>
//             {Object.keys(categories).map((cat) => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>

//         {/* 🔹 Sous-catégorie */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <GiClothes className="text-gray-500 mr-3" />
//           <select name="subCategory" value={formData.subCategory} onChange={handleChange} required disabled={!formData.category} className="w-full outline-none bg-transparent">
//             <option value="">Sélectionnez une sous-catégorie</option>
//             {formData.category && categories[formData.category].map((sub) => (
//               <option key={sub} value={sub}>{sub}</option>
//             ))}
//           </select>
//         </div>

//         {/* 🔹 Sélection de l'état */}
//         <div className="flex items-center border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition">
//           <FaCubes className="text-gray-500 mr-3" />
//           <select name="condition" value={formData.condition} onChange={handleChange} required className="w-full outline-none bg-transparent">
//             <option value="">Sélectionnez l'état</option>
//             {conditions.map((cond) => (
//               <option key={cond} value={cond}>{cond}</option>
//             ))}
//           </select>
//         </div>

//         {/* 🔹 Upload d'images */}
//         <div className="border p-4 rounded-md bg-white shadow-md flex items-center hover:shadow-lg transition">
//           <FiUpload className="text-gray-500 mr-3" />
//           <input type="file" multiple onChange={handleImageChange} className="w-full outline-none" />
//         </div>

//         {/* 🔹 Aperçu des images */}
//         <div className="grid grid-cols-3 gap-4 mt-4">
//           {formData.images.map((image, index) => (
//             <div key={index} className="relative w-full h-40 shadow-md rounded-md overflow-hidden">
//               <img src={image.url} alt={`image-${index}`} className="w-full h-full object-cover" />
//               <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 text-xs rounded-full hover:bg-red-700 transition">
//                 <FiTrash2 />
//               </button>
//             </div>
//           ))}
//         </div>

//         <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-md shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
//           Mettre en vente
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SellForm;

import React, { useState } from "react";
import { addProduct } from "../../utils/api";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaTshirt, FaTags, FaBoxOpen, FaCubes, FaPalette, FaIndustry } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";

// ✅ Définition des catégories et sous-catégories
const categories = {
  Homme: ["pantalon", "haut", "veste", "chaussure","accessoires","short","sac","combinaison"],
  Femme: ["pantalon", "haut", "veste", "chaussure", "jupe","robe","accessoires","short","sac","combinaison"],
  Enfant: ["pantalon", "haut", "veste", "chaussure","jupe","robe","accessoires","short","sac","combinaison"],
};

const conditions = ["Neuf", "Bon état", "Usé"];

const SellForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    size: "",
    brand: "",
    material: "",
    color: "",
    condition: "",
    images: [],
  });

  // ✅ Gérer les changements des inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Gérer l'ajout d'images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file), // Aperçu visuel
      file: file, // Pour l'upload au serveur
    }));

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  // ✅ Gérer la suppression d'une image
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  // ✅ Gérer l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert("Veuillez ajouter au moins une image.");
      return;
    }

    // Préparer les images pour le backend
    const imagesToUpload = formData.images.map((img) => ({ url: img.url }));

    const finalData = {
      ...formData,
      price: Number(formData.price), // Conversion du prix en nombre
      images: imagesToUpload,
    };

    try {
      await addProduct(finalData);
      alert("Produit ajouté avec succès !");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        size: "",
        brand: "",
        material: "",
        color: "",
        condition: "",
        images: [],
      });
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'ajout du produit");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-10 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <AiOutlineCheckCircle className="text-green-500" />
        Ajouter un produit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔹 Nom */}
        <div className="flex items-center border p-4 rounded-md bg-white shadow-md">
          <FaTshirt className="text-gray-500 mr-3" />
          <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required className="w-full outline-none bg-transparent" />
        </div>

        {/* 🔹 Description */}
        <div className="flex items-center border p-4 rounded-md bg-white shadow-md">
          <FaTags className="text-gray-500 mr-3" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full outline-none bg-transparent resize-none"></textarea>
        </div>

        {/* 🔹 Prix */}
        <div className="flex items-center border p-4 rounded-md bg-white shadow-md">
          <FaBoxOpen className="text-gray-500 mr-3" />
          <input type="number" name="price" placeholder="Prix (€)" value={formData.price} onChange={handleChange} required className="w-full outline-none bg-transparent" />
        </div>

        {/* 🔹 Catégorie */}
        <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md">
          <option value="">Sélectionnez une catégorie</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* 🔹 Sous-catégorie */}
        <select name="subCategory" value={formData.subCategory} onChange={handleChange} required disabled={!formData.category} className="w-full p-4 border rounded-md bg-white shadow-md">
          <option value="">Sélectionnez une sous-catégorie</option>
          {formData.category && categories[formData.category].map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        {/* 🔹 Taille */}
        <input type="text" name="size" placeholder="Taille" value={formData.size} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md" />

        {/* 🔹 Marque */}
        <input type="text" name="brand" placeholder="Marque" value={formData.brand} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md" />

        {/* 🔹 Matière */}
        <input type="text" name="material" placeholder="Matière" value={formData.material} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md" />

        {/* 🔹 Couleur */}
        <input type="text" name="color" placeholder="Couleur" value={formData.color} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md" />

        {/* 🔹 Condition */}
        <select name="condition" value={formData.condition} onChange={handleChange} required className="w-full p-4 border rounded-md bg-white shadow-md">
          <option value="">Sélectionnez l'état</option>
          {conditions.map((cond) => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>

        {/* 🔹 Upload d'images */}
        <input type="file" multiple onChange={handleImageChange} className="w-full p-4 border rounded-md bg-white shadow-md" />

        {/* 🔹 Bouton de soumission */}
        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-md shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
          Mettre en vente
        </button>
      </form>
    </div>
  );
};

export default SellForm;
