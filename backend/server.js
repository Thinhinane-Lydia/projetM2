require("dotenv").config({ path: "./backend/config/.env" });

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
