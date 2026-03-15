import React from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const BookCard = ({ book }) => {
    const imageUrl = book.imageUrl ? `${API_BASE_URL}/${book.imageUrl.replace(/\\/g, '/')}` : 'https://placehold.co/300x450/e2e8f0/475569?text=No+Image';

    const listingTypeStyles = {
        'Sell': 'bg-emerald-100 text-emerald-800',
        'Exchange': 'bg-sky-100 text-sky-800',
        'Both': 'bg-purple-100 text-purple-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <Link to={`/book/${book._id}`} className="block">
                <div className="relative">
                    <img src={imageUrl} alt={book.title} className="w-full h-64 object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-teal-600 transition-colors duration-300">{book.title}</h3>
                    <p className="text-slate-500 text-sm">{book.author}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${listingTypeStyles[book.listingType] || 'bg-slate-100 text-slate-800'}`}>
                            {book.listingType}
                        </span>
                         {book.listingType !== 'Exchange' && book.price && (
                            <p className="text-lg font-bold text-slate-900">₹{book.price}</p>
                         )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BookCard;
