import React, { useState } from "react";
import { addProduct } from "../../utils/api";

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
    images: [{ url: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addProduct(formData);
      console.log("Produit ajouté :", response);
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
        images: [{ url: "" }],
      });
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'ajout du produit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sell-form">
      <input type="text" name="name" placeholder="Nom du produit" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Prix" onChange={handleChange} required />
      <input type="text" name="category" placeholder="Catégorie" onChange={handleChange} required />
      <input type="text" name="subCategory" placeholder="Sous-catégorie" onChange={handleChange} required />
      <input type="text" name="size" placeholder="Taille" onChange={handleChange} required />
      <input type="text" name="brand" placeholder="Marque" onChange={handleChange} required />
      <input type="text" name="material" placeholder="Matière" onChange={handleChange} required />
      <input type="text" name="color" placeholder="Couleur" onChange={handleChange} required />
      <input type="text" name="condition" placeholder="État" onChange={handleChange} required />
      <input type="text" name="images" placeholder="Image URL" onChange={(e) => setFormData({ ...formData, images: [{ url: e.target.value }] })} required />

      <button type="submit">Mettre en vente</button>
    </form>
  );
};

export default SellForm;
