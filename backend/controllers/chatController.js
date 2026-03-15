const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) {
            return res.status(404).json({ msg: 'Conversation not found' });
        }

        // Ensure the user is a participant of the conversation
        if (!conversation.participants.includes(new mongoose.Types.ObjectId(req.user.id))) {
            return res.status(401).json({ msg: 'User not authorized for this conversation' });
        }
        
        const messages = await Message.find({ conversation: req.params.conversationId })
            .populate('sender', 'username')
            .sort({ createdAt: 'asc' });
            
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
