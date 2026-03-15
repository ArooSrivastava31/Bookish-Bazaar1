const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        contactNumber: { type: String, required: true },
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Order Placed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Order Placed'
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

