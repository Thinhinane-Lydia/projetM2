const Notification = require("../model/Notification");
const catchAsyncError = require("../middleware/catchAsyncError");

/**
 * Récupérer toutes les notifications d'un utilisateur
 */
exports.getUserNotifications = catchAsyncError(async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * Marquer une notification comme lue
 */
exports.markNotificationAsRead = catchAsyncError(async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true, message: "Notification marquée comme lue" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * Supprimer une notification
 */
exports.deleteNotification = catchAsyncError(async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Notification supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});
