const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getBooks, getBookById, addBook, getUserBooks, deleteBook } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG formats are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter
});


// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', getBooks);

// @route   GET api/books/:id
// @desc    Get a single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST api/books
// @desc    Add a new book
// @access  Private
router.post('/', authMiddleware, upload.single('image'), addBook);

// @route   GET api/books/user/:userId
// @desc    Get all books listed by a specific user
// @access  Private
router.get('/user/:userId', authMiddleware, getUserBooks);

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;
