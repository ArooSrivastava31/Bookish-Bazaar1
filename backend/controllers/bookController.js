const Book = require('../models/Book');
const ExchangeRequest = require('../models/ExchangeRequest');

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('listedBy', 'username').sort({ date: -1 });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('listedBy', 'username email');
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author, description, genre, condition, listingType, price, exchangePreferences } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload an image file.' });
        }

        // Validate required fields based on listing type
        if ((listingType === 'Sell' || listingType === 'Both') && !price) {
            return res.status(400).json({ msg: 'Price is required for selling books.' });
        }

        if ((listingType === 'Exchange' || listingType === 'Both') && !exchangePreferences) {
            return res.status(400).json({ msg: 'Exchange preferences are required for exchange listings.' });
        }

        const newBook = new Book({
            title,
            author,
            description,
            genre,
            condition,
            listingType,
            price: (listingType === 'Sell' || listingType === 'Both') ? Number(price) : undefined,
            exchangePreferences: (listingType === 'Exchange' || listingType === 'Both') ? exchangePreferences : undefined,
            imageUrl: req.file.path.replace(/\\/g, "/"),
            listedBy: req.user.id
        });

        const book = await newBook.save();
        
        // Populate the listedBy field with username before sending response
        const populatedBook = await Book.findById(book._id).populate('listedBy', 'username');
        res.json(populatedBook);
    } catch (err) {
        console.error('Error adding book:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: Object.values(err.errors).map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: 'Server Error. Please try again.' });
    }
};

// **NEW:** Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Check if the user owns the book
        if (book.listedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        
        // The pre 'deleteOne' middleware in Book.js will handle cascading deletes
        await book.deleteOne();

        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Get all books for a specific user
exports.getUserBooks = async (req, res) => {
     try {
        const books = await Book.find({ listedBy: req.params.userId }).sort({ date: -1 });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

