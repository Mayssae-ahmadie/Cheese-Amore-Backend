const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    productIds: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true, default: 1 },
            instruction: { type: String }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'delivered', 'canceled'], required: true },
    shippingMethod: { type: String, enum: ['pick up', 'delivery'], default: 'delivery', required: true },
    shippingFee: { type: Number, required: true },
    paymentMethod: { type: String, default: 'cash on delivery', required: true },
    receiveDateTime: { type: String, required: true }
},
    { timestamps: true }
);

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;