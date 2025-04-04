const express = require("express");
const { getUserNotifications, markNotificationAsRead, deleteNotification } = require("../controller/notificationController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// 🔹 Récupérer toutes les notifications de l'utilisateur
router.get("/", isAuthenticated, getUserNotifications);

// 🔹 Marquer une notification comme lue
router.put("/:id/read", isAuthenticated, markNotificationAsRead);

// 🔹 Supprimer une notification
router.delete("/:id", isAuthenticated, deleteNotification);

module.exports = router;
