import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Search, Filter } from 'lucide-react';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [listingTypeFilter, setListingTypeFilter] = useState('All');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                setBooks(res.data);
                setFilteredBooks(res.data);
            } catch (err) {
                console.error("Error fetching books:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        let results = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (listingTypeFilter !== 'All') {
            results = results.filter(book => book.listingType === listingTypeFilter || (listingTypeFilter === 'Both' && book.listingType === 'Both'));
        }


        setFilteredBooks(results);
    }, [searchTerm, books, listingTypeFilter]);


    if (loading) {
        return <div className="text-center pt-32 text-slate-500">Loading books...</div>;
    }

    const FilterButton = ({ type, label }) => (
        <button
            onClick={() => setListingTypeFilter(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                listingTypeFilter === type
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Explore Our Collection</h1>
                <p className="text-lg text-slate-500">Find your next adventure from our community's library.</p>
            </div>

            <div className="mb-8 max-w-lg mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title, author, or genre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
                <Filter size={20} className="text-slate-500" />
                <span className="font-semibold mr-2">Filter by:</span>
                <FilterButton type="All" label="All" />
                <FilterButton type="Sell" label="For Sale" />
                <FilterButton type="Exchange" label="For Exchange" />
                <FilterButton type="Both" label="Both" />
            </div>


            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredBooks.map(book => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500">
                    <h3 className="text-xl font-semibold">No books found</h3>
                    <p>Try adjusting your search or filter.</p>
                </div>
            )}
        </div>
    );
};

export default AllBooks;