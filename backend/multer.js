const multer = require("multer");
const fs = require("fs");

// Vérifier si le dossier uploads existe
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Dossier 'uploads' créé !");
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("📁 Destination :", uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        console.log("📸 Fichier enregistré sous :", filename + "-" + uniqueSuffix + ".png");
        cb(null, filename + "-" + uniqueSuffix + ".png");
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
