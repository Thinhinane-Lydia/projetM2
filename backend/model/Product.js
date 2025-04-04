const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size", required: false, default: null }, // Taille sélectionnée
  brand: { type: String, required: true,enum: ["Zara", "Nike", "Adidas","H&M","Chanel","Gucci","Shein","Puma","New Balance","Levis","PULL&BEAR","stradivarius","Bershka","Primark","autre"] },
  material: { type: String, required: true,enum:["Coton","Lin","Laine","Soie","Polyester","Nylon","Cuir","Satin","Acier inoxydable","Jean","Autre"] },
  color: { type: String, required: true,enum:["blanc","noir","rouge","bleu","rose","marron","beige","vert","jaune","orange","violet","gris","melange de couleurs","autre"] },
  condition: { type: String, required: true, enum: ["Neuf", "Bon état", "Usé"] },
  images: [{ url: { type: String, required: true } }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("Product", productSchema);
