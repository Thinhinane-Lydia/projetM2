
const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

require("dotenv").config({ path: "./backend/config/.env" }); // ✅ Charger dotenv dès le début

const app = express();
 

// ✅ Création du serveur HTTP pour supporter `Socket.io`
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

// ✅ Gérer les connexions WebSocket
io.on("connection", (socket) => {
  console.log(`✅ Utilisateur connecté : ${socket.id}`);

  // 🔹 L'utilisateur rejoint une "room" basée sur son ID
  socket.on("subscribe", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`🔔 Utilisateur ${userId} abonné aux notifications.`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Utilisateur déconnecté : ${socket.id}`);
  });
});

// ✅ Fonction pour envoyer des notifications en temps réel
const sendNotificationSocket = (userId, notification) => {
  io.to(`user_${userId}`).emit("new_notification", notification);
};

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ✅ Configuration CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur détectée :", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur serveur. Veuillez réessayer plus tard.",
  });
});

// 🔹 Import routes
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");
const sizeRoutes = require("./routes/size");
const user = require("./controller/user");
const commentRoutes = require("./routes/comment");
const notificationRoutes = require("./routes/notification");
const searchHistoryRoutes = require("./routes/searchHistoryRoutes");
const favoriteRoutes = require("./routes/favorite");
const cartRoutes = require("./routes/cartRoutes");
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const blockRoutes = require("./routes/blockRoutes");


app.use("/api/v2/notifications", notificationRoutes);
app.use("/api/v2/comments", commentRoutes);
app.use("/api/v2/user", user);
app.use("/api/v2/categories", categoryRoutes);
app.use("/api/v2/subcategories", subCategoryRoutes);
app.use("/api/v2/products", productRoutes);
app.use("/api/v2/sizes", sizeRoutes);
app.use("/api/v2/favorites", favoriteRoutes);
app.use("/api/v2/cart", cartRoutes); 
app.use('/api/v2/messages' ,messageRoutes);
app.use('/api/v2/conversations',conversationRoutes);
app.use("/api/v2/search-history", searchHistoryRoutes); 
app.use("/api/v2/order", orderRoutes);
app.use("/api/v2/users", blockRoutes);


// ✅ Lancer le serveur
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
// ✅ Exporter `io` pour l'utiliser dans d'autres fichiers
module.exports = { app, server, io, sendNotificationSocket };