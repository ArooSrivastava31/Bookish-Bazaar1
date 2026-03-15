const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    exchangeRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExchangeRequest',
        required: true,
        unique: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
