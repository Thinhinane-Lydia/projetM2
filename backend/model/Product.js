const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom du produit est requis"],
    },
    description: {
        type: String,
        required: [true, "La description est requise"],
    },
    price: {
        type: Number,
        required: [true, "Le prix est requis"],
    },
    category: {
        type: String,
        required: [true, "La catégorie est requise"],
    },
    subCategory: {
        type: String,
        required: [true, "La sous-catégorie est requise"],
    },
    size: {
        type: String, 
        required: [true, "La taille est requise"],
    },
    brand: {
        type: String,
        required: [true, "La marque est requise"],
    },
    material: {
        type: String,
        required: [true, "La matière est requise"],
    },
    color: {
        type: String,
        required: [true, "La couleur est requise"],
    },
    
    condition: {
        type: String,
        required: true,
        enum: ["Neuf", "Bon état", "Usé"],
    },
    images: [
        {
            type: [{ url: String }],
            required: [true, "Au moins une image est requise"],
        },
        
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
