import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, PlusCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ book, onCancel, onConfirm }) => {
    if (!book) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative text-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-slate-900 mt-4" id="modal-title">
                    Delete "{book.title}"
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-slate-500">
                        Are you sure you want to delete this listing? This action cannot be undone.
                    </p>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const { user, token, loading: isAuthLoading } = useContext(AuthContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);


    const fetchMyBooks = useCallback(async () => {
        // This check ensures we only fetch books when we have a valid user and token.
        if (user?._id && token) {
            setIsLoadingBooks(true);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/books/user/${user._id}`, config);
                setMyBooks(res.data);
            } catch (err) {
                console.error("Error fetching user's books:", err);
            } finally {
                setIsLoadingBooks(false);
            }
        } else {
            // FIX: If there is no user, we must ensure the loading state is turned off.
            // This was the cause of the infinite loading screen.
            setIsLoadingBooks(false);
        }
    }, [user, token]);

    useEffect(() => {
        // This effect waits for the main authentication to finish (isAuthLoading is false)
        // before it attempts to fetch the books.
        if (!isAuthLoading) {
            fetchMyBooks();
        }
    }, [isAuthLoading, fetchMyBooks]);

    const openDeleteModal = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setBookToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!bookToDelete) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/books/${bookToDelete._id}`, config);
            fetchMyBooks(); // Refresh list
            closeDeleteModal();
        } catch (err) {
            console.error("Error deleting book:", err);
            alert('Failed to delete the book. Please try again.'); 
            closeDeleteModal();
        }
    };
    
    // Show a loading indicator if either the main app auth is loading, or if this specific page is fetching books.
    if (isAuthLoading || isLoadingBooks) {
        return <div className="text-center pt-32 text-slate-500">Loading your books...</div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-8 pt-24">
             <DeleteConfirmationModal 
                book={bookToDelete}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
             />

            <h1 className="text-4xl font-bold text-center mb-10 text-slate-800">My Listed Books</h1>
            {myBooks.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {myBooks.map(book => (
                        <div key={book._id} className="relative group">
                            <BookCard book={book} />
                            <button 
                                onClick={() => openDeleteModal(book)}
                                className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-2 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Delete book"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-xl text-slate-500">You haven't listed any books yet.</p>
                     <Link to="/add-book" className="mt-4 inline-flex items-center btn-primary">
                        <PlusCircle size={20} className="mr-2"/>
                        List Your First Book
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyBooks;

