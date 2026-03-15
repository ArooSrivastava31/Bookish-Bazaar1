const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
    bookRequested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    offeredBookTitle: {
        type: String,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterAddress: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

module.exports = ExchangeRequest;

