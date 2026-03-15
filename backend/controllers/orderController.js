const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Create a new order (Cash on Delivery)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    const { bookId, shippingAddress } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        if (book.status !== 'Available') {
            return res.status(400).json({ msg: 'Book is no longer available' });
        }

        const order = new Order({
            book: bookId,
            buyer: req.user.id,
            seller: book.listedBy,
            price: book.price,
            shippingAddress,
        });

        await order.save();

        // Mark the book as sold
        book.status = 'Sold';
        await book.save();
        
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get orders for the logged-in user (as buyer)
// @route   GET /api/orders/my-purchases
// @access  Private
exports.getMyPurchases = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate('book', 'title author imageUrl')
            .populate('seller', 'username')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get sales for the logged-in user (as seller)
// @route   GET /api/orders/my-sales
// @access  Private
exports.getMySales = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate('book', 'title author imageUrl')
            .populate('buyer', 'username')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

