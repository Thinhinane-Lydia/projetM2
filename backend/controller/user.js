const express = require("express");
const path=require("path");
const User = require("../model/user");
const router = express.Router();
const upload = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs"); // Importer fs pour gérer les fichiers

// router.post("/create-user", upload.single("file"), async (req, res, next) => {
//     const { name, email, password } = req.body;
//     const userEmail = await User.findOne({ email });

//     if (userEmail) {
//         return next(new ErrorHandler("User already exists", 400));
//     }

//     const filename = req.file.filename;
//     const fileUrl = path.join(filename);
//     const user = {
//         name: name,
//         email: email,
//         password: password,
//         avatar: fileUrl,
//     };
// });
// router.post("/create-user", upload.single("file"), async (req, res, next) => {
//     router.post("/create-user", upload.single("avatar"), async (req, res, next) => {

//     console.log("Received Data:", req.body); // Affiche les données reçues
//     console.log("Received File:", req.file); // Affiche le fichier reçu

//     if (!req.body.name || !req.body.email || !req.body.password) {
//         return next(new ErrorHandler("All fields are required", 400));
//     }

//     if (!req.file) {
//         return next(new ErrorHandler("File upload failed", 400));
//     }

//     const filename = req.file.filename;
//     const fileUrl = `/uploads/${filename}`;

//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         // avatar: fileUrl
//         avatar: {
//             public_id: filename, // Utilise le nom du fichier comme ID
//             url: `/uploads/${filename}`, // Stocke l'URL du fichier
//           },
          
//     });

//     await user.save();

//     res.status(201).json({ success: true, message: "User created", user });
// });



router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
    console.log("📥 Requête reçue :", req.body);
    console.log("📸 Fichier reçu :", req.file);

    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "❌ Tous les champs sont obligatoires !" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "❌ Aucune image reçue !" });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("❌ Utilisateur déjà existant :", existingUser.email);
            return res.status(400).json({ message: "L'utilisateur existe déjà !" });
        }

        const filename = req.file.filename;
        const fileUrl = `/uploads/${filename}`;

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: {
                public_id: filename,
                url: fileUrl,
            },
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "✅ Utilisateur créé avec succès !", user: newUser });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

module.exports = router;