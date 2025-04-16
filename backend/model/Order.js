const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, default: 'En traitement' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
