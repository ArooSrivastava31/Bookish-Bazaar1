import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, CheckCircle, Info } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

// Moved Modal component outside of BookDetails to prevent re-rendering on state change
const Modal = ({ children, closeModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative transform scale-100 transition-transform duration-300">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
            </button>
            {children}
        </div>
    </div>
);


const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [exchangeData, setExchangeData] = useState({
        offeredBookTitle: '',
        requesterName: '',
        requesterAddress: ''
    });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const { isAuthenticated, user, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/books/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error("Error fetching book details:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBook();
        else setLoading(false);
    }, [id]);

    const handleExchangeChange = e => {
        setExchangeData({ ...exchangeData, [e.target.name]: e.target.value });
    };

    const handleExchangeSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const body = JSON.stringify({ bookId: id, ...exchangeData });
            await axios.post(`${API_BASE_URL}/api/exchanges`, body, config);
            setFeedback({ message: 'Your exchange request has been sent!', type: 'success' });
            setShowExchangeModal(false);
        } catch (err) {
            console.error(err);
            setFeedback({ message: 'Failed to send request. Please try again.', type: 'error' });
        } finally {
            setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
        }
    };

    if (loading) return <div className="text-center pt-32 text-lg text-slate-500">Loading Book Details...</div>;
    if (!book) return <div className="text-center pt-32 text-lg text-rose-500">Book not found or invalid ID.</div>;
    
    const imageUrl = book.imageUrl ? `${API_BASE_URL}/${book.imageUrl.replace(/\\/g, '/')}` : 'https://placehold.co/400x600/e2e8f0/475569?text=No+Image';
    const isOwner = isAuthenticated && user?._id === book.listedBy?._id;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
            {showExchangeModal && (
                <Modal closeModal={() => setShowExchangeModal(false)}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Offer Exchange for "{book.title}"</h2>
                    <form onSubmit={handleExchangeSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 font-semibold">Your Book's Title</label>
                            <input type="text" name="offeredBookTitle" value={exchangeData.offeredBookTitle} onChange={handleExchangeChange} required className="form-input"/>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Your Name</label>
                            <input type="text" name="requesterName" value={exchangeData.requesterName} onChange={handleExchangeChange} required className="form-input"/>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Your Address (for collection)</label>
                            <textarea name="requesterAddress" value={exchangeData.requesterAddress} onChange={handleExchangeChange} required className="form-input" rows="3"></textarea>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={() => setShowExchangeModal(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary bg-sky-600 hover:bg-sky-700 focus:ring-sky-500">Send Request</button>
                        </div>
                    </form>
                </Modal>
            )}

            {feedback.message && (
                <div className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white ${feedback.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {feedback.type === 'success' ? <CheckCircle className="mr-3"/> : <Info className="mr-3"/>}
                    {feedback.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
                <div className="md:col-span-2 flex justify-center items-start">
                    <img src={imageUrl} alt={book.title} className="w-full max-w-sm rounded-lg shadow-lg object-contain"/>
                </div>
                <div className="md:col-span-3">
                    <h1 className="text-4xl font-bold text-slate-800">{book.title}</h1>
                    <p className="text-xl text-slate-500 mt-2">by {book.author}</p>
                    
                     <div className="mt-6 border-t pt-6 space-y-3 text-slate-600">
                        <p><span className="font-semibold text-slate-800">Genre:</span> {book.genre}</p>
                        <p><span className="font-semibold text-slate-800">Condition:</span> {book.condition}</p>
                        <p><span className="font-semibold text-slate-800">Listed by:</span> {book.listedBy?.username || 'Unknown'}</p>
                         <p className="flex items-center"><span className="font-semibold text-slate-800 mr-2">Listing Type:</span> 
                            <span className="text-sm font-semibold inline-block py-1 px-3 uppercase rounded-full bg-slate-200 text-slate-700">{book.listingType}</span>
                        </p>
                    </div>

                    {(book.listingType === 'Sell' || book.listingType === 'Both') && (
                        <p className="text-4xl font-bold text-teal-600 mt-6">₹{book.price}</p>
                    )}
                    {(book.listingType === 'Exchange' || book.listingType === 'Both') && (
                         <p className="mt-4 bg-sky-50 p-3 rounded-md text-sky-800"><span className="font-semibold">Owner is looking for:</span> {book.exchangePreferences}</p>
                    )}
                     <p className="mt-6 text-slate-600 leading-relaxed">{book.description}</p>

                    <div className="mt-8 border-t pt-8">
                        {isOwner ? (
                             <p className="text-center font-semibold text-sky-700 bg-sky-100 p-3 rounded-md">This is your listing.</p>
                        ) : book.status !== 'Available' ? (
                             <p className="text-center font-semibold text-rose-700 bg-rose-100 p-3 rounded-md">This book is no longer available.</p>
                        ) : isAuthenticated ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                {(book.listingType === 'Sell' || book.listingType === 'Both') && (
                                    <Link to={`/checkout/${book._id}`} className="flex-1 btn-primary py-3 text-center">
                                        Buy Now (COD)
                                    </Link>
                                )}
                                {(book.listingType === 'Exchange' || book.listingType === 'Both') && (
                                    <button onClick={() => setShowExchangeModal(true)} className="flex-1 btn-primary bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 py-3">
                                        Offer Exchange
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center font-semibold text-slate-700 bg-slate-100 p-4 rounded-md">
                                Please <Link to="/login" className="text-teal-600 font-bold hover:underline">log in</Link> to make a purchase or exchange offer.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;

