const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Acceptable'],
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    listedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingType: {
        type: String,
        enum: ['Sell', 'Exchange', 'Both'],
        required: true,
    },
    price: {
        type: Number,
        required: function() { return this.listingType === 'Sell' || this.listingType === 'Both'; }
    },
    exchangePreferences: {
        type: String,
        required: function() { return this.listingType === 'Exchange' || this.listingType === 'Both'; }
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Exchanged'],
        default: 'Available'
    }
}, { timestamps: true });

// **NEW:** Mongoose middleware to cascade delete exchange requests.
// Before a book is deleted, this function will run.
bookSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        // 'this' refers to the book document being deleted.
        console.log(`Deleting exchange requests for book: ${this._id}`);
        // Find and delete all ExchangeRequest documents related to this book.
        await this.model('ExchangeRequest').deleteMany({ bookRequested: this._id });
        next();
    } catch (err) {
        console.error("Error in cascade delete middleware:", err);
        next(err);
    }
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
