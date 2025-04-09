// const multer = require("multer");
// const fs = require("fs");

// // Vérifier si le dossier uploads existe
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log("📁 Dossier 'uploads' créé !");

// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log("📁 Destination :", uploadDir);
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         const filename = file.originalname.split(".")[0];
//         console.log("📸 Fichier enregistré sous :", filename + "-" + uniqueSuffix + ".png");
//         cb(null, filename + "-" + uniqueSuffix + ".png");
//     },
// });


// const upload = multer({ storage: storage });

// module.exports = upload;
const multer = require("multer");
const fs = require("fs");

// Vérifier si le dossier uploads existe
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Dossier 'uploads' créé !");
}

// Définir les types de fichiers acceptés
const fileTypes = /jpeg|jpg|png|gif/;
const imageMimeType = fileTypes.test.bind(fileTypes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Destination :", uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Vérifier l'extension du fichier téléchargé
    const extension = file.originalname.split('.').pop(); // Récupérer l'extension du fichier original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    console.log("📸 Fichier enregistré sous :", filename + "-" + uniqueSuffix + "." + extension);
    cb(null, filename + "-" + uniqueSuffix + "." + extension); // Conserver l'extension du fichier
  },
});

// Filtre pour accepter uniquement les fichiers image avec une extension valide
const fileFilter = (req, file, cb) => {
  if (imageMimeType(file.mimetype)) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false); // Rejeter les fichiers non valides
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter  // Appliquer le filtre
});

module.exports = upload;
