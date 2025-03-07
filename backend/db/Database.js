// const mongoose = require("mongoose");

// const connectDatabase = () => {
//   mongoose
//     .connect(process.env.DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then((data) => {
//       console.log(`mongod connected with server: ${data.connection.host}`);
//     });
// };
// mongoose.connection.on("error", (err) => {
//   console.error("❌ Erreur MongoDB :", err);
// });


// module.exports = connectDatabase;const mongoose = require("mongoose");

// Fonction pour connecter la base de données MongoDB
const mongoose = require("mongoose");

// Fonction pour connecter la base de données MongoDB
const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true, // ✅ Active les retries automatiques
            w: "majority", // ✅ Meilleure gestion des conflits en cluster
        })
        .then((data) => {
            console.log(`✅ MongoDB connecté sur : ${data.connection.host}`);
        })
        .catch((err) => {
            console.error("❌ Erreur de connexion MongoDB :", err);
            process.exit(1); // 🔴 Quitte l'application si la connexion échoue
        });
};

// 🔹 Gérer les erreurs MongoDB globalement
mongoose.connection.on("error", (err) => {
    console.error("❌ Erreur MongoDB détectée :", err);
});

// 🔹 Détecter les déconnexions et essayer de reconnecter
mongoose.connection.on("disconnected", () => {
    console.warn("⚠ MongoDB déconnecté ! Reconnexion en cours...");
    setTimeout(connectDatabase, 5000); // ⏳ Tentative de reconnexion après 5 secondes
});

module.exports = connectDatabase;
