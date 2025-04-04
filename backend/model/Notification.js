const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Destinataire de la notification
  type: { type: String, enum: ["new_product", "comment"], required: true },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
