const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("📁 Destination :", "uploads/");
        cb(null, "uploads/");
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
