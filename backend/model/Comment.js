
// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   text: { type: String, required: true },
//   rating: { type: Number, default: 0 }, // Ajout du champ rating
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  text: { type: String, required: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);