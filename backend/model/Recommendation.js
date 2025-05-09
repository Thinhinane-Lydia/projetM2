const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommended_products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
