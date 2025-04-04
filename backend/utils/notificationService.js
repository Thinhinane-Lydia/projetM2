const Notification = require("../model/Notification");
const { sendNotificationSocket } = require("../app");

/**
 * Fonction pour créer et envoyer une notification en temps réel.
 * @param {Object} data - Données de la notification.
 */
const sendNotification = async (data) => {
  try {
    // 🔹 Sauvegarde dans MongoDB
    const notification = new Notification(data);
    await notification.save();

    // 🔹 Envoi en temps réel via WebSockets
    sendNotificationSocket(data.userId, notification);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
  }
};

module.exports = { sendNotification };
