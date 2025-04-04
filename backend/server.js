require("dotenv").config({ path: "./backend/config/.env" });
require("./model/Favorite");


const app = require("./app");
const connectDatabase = require("./db/Database");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to an uncaught exception`);
});

// Configuration de l'environnement
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./backend/config/.env" });
}

// Connexion à la base de données
connectDatabase();

const Message = require('./model/Message'); // Assure-toi que le chemin est correct

async function checkMessages() {
    try {
        const messages = await Message.find({});
        console.log("📜 Tous les messages enregistrés en base de données :", messages);
    } catch (error) {
        console.error("❌ ERREUR MongoDB - Impossible de récupérer les messages :", error);
    }
}

checkMessages();

// Création du serveur
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`🚀 Server is running on http://localhost:${process.env.PORT || 8000}`);
});

// Gestion des rejets non gérés
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server due to an unhandled promise rejection: ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});
