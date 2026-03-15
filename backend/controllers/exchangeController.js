const ExchangeRequest = require('../models/ExchangeRequest');
const Book = require('../models/Book');
const Conversation = require('../models/Conversation');

// @desc    Create a new exchange request
exports.createExchangeRequest = async (req, res) => {
    const { bookId, offeredBookTitle, requesterName, requesterAddress } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        const newRequest = new ExchangeRequest({
            bookRequested: bookId,
            requester: req.user.id,
            owner: book.listedBy,
            offeredBookTitle,
            requesterName,
            requesterAddress
        });

        await newRequest.save();
        res.status(201).json({ msg: 'Exchange request sent successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get exchange requests for a user
exports.getExchangeRequests = async (req, res) => {
    try {
        const received = await ExchangeRequest.find({ owner: req.user.id })
            .populate('requester', 'username')
            .populate('bookRequested', 'title imageUrl').lean();
            
        const sent = await ExchangeRequest.find({ requester: req.user.id })
            .populate('owner', 'username')
            .populate('bookRequested', 'title imageUrl').lean();

        // Helper function to find and attach a conversation ID to an accepted request
        const addConversationId = async (request) => {
            if (request.status === 'accepted') {
                const conversation = await Conversation.findOne({ exchangeRequest: request._id }).lean();
                if (conversation) {
                    // Return a new object with the conversationId merged in
                    return { ...request, conversationId: conversation._id };
                }
            }
            return request;
        };

        // Run the async helper on all requests in parallel for better performance
        const receivedRequests = await Promise.all(received.map(addConversationId));
        const sentRequests = await Promise.all(sent.map(addConversationId));

        res.json({ receivedRequests, sentRequests });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update an exchange request status
exports.updateExchangeRequest = async (req, res) => {
    const { status } = req.body;
    try {
        let request = await ExchangeRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });
        if (request.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        request.status = status;
        await request.save();

        if (status === 'accepted') {
            const existingConvo = await Conversation.findOne({ exchangeRequest: request._id });
            if (!existingConvo) {
                const newConversation = new Conversation({
                    exchangeRequest: request._id,
                    participants: [request.owner, request.requester],
                });
                await newConversation.save();
            }
        }
        
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

