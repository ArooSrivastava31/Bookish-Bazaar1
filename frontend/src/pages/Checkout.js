import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const ConfirmationModal = ({ deliveryDate, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Order Confirmed!</h2>
            <p className="text-slate-500 mt-2">Thank you for your purchase.</p>
            <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Estimated Delivery:</p>
                <p className="text-lg font-bold text-teal-600">{deliveryDate}</p>
            </div>
            <button
                onClick={onClose}
                className="w-full btn-primary py-3 mt-6"
            >
                View My Orders
            </button>
        </div>
    </div>
);

const Checkout = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        contactNumber: '',
        pincode: '',
        addressLine: '',
        city: '',
    });
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/books/${bookId}`);
                setBook(res.data);
            } catch (err) {
                setError('Could not load book details.');
                console.error("Error fetching book details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [bookId]);

    const handleDetailsChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        // Detailed validation logic
        const { fullName, contactNumber, pincode, addressLine, city } = shippingDetails;

        if (!fullName.trim()) {
            setError('Please enter your full name.');
            return;
        }
        
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(contactNumber)) {
            setError('Please enter a valid 10-digit number starting with 6, 7, 8, or 9.');
            return;
        }

        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(pincode)) {
            setError('Please enter a valid 6-digit pincode.');
            return;
        }

        if (!city.trim()) {
            setError('Please enter your city.');
            return;
        }

        if (!addressLine.trim()) {
            setError('Please enter your address.');
            return;
        }


        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const body = JSON.stringify({ bookId, shippingAddress: shippingDetails });
            await axios.post(`${API_BASE_URL}/api/orders`, body, config);

            // Calculate estimated delivery date (5-7 days from now)
            const today = new Date();
            const arrivalStart = new Date();
            arrivalStart.setDate(today.getDate() + 5);
            const arrivalEnd = new Date();
            arrivalEnd.setDate(today.getDate() + 7);

            const options = { month: 'long', day: 'numeric' };
            const startDate = arrivalStart.toLocaleDateString('en-US', options);
            const endDate = arrivalEnd.toLocaleDateString('en-US', options);

            setDeliveryDate(`${startDate} - ${endDate}`);
            setShowConfirmation(true);

        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to place order.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center pt-32">Loading checkout...</div>;
    if (!book) return <div className="text-center pt-32 text-rose-500">Error: Book not found.</div>;

    const imageUrl = `${API_BASE_URL}/${book.imageUrl.replace(/\\/g, '/')}`;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
            {showConfirmation && (
                <ConfirmationModal 
                    deliveryDate={deliveryDate}
                    onClose={() => navigate('/my-orders')}
                />
            )}
            <h1 className="text-4xl font-bold text-center mb-10 text-slate-800">Complete Your Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                    <div className="flex items-start gap-4">
                        <img src={imageUrl} alt={book.title} className="w-24 h-36 object-cover rounded flex-shrink-0" />
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">{book.title}</h3>
                            <p className="text-slate-500 text-sm">by {book.author}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">Genre:</span> {book.genre}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">Condition:</span> {book.condition}</p>
                            <p className="text-2xl font-bold text-teal-600 pt-2">₹{book.price}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                         <p className="text-slate-600">This order will be <span className="font-semibold">Cash on Delivery</span>.</p>
                        <div>
                            <label className="block text-slate-700 font-semibold">Full Name</label>
                            <input type="text" name="fullName" value={shippingDetails.fullName} onChange={handleDetailsChange} className="form-input" placeholder="Enter your full name" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Contact Number</label>
                            <input type="tel" name="contactNumber" value={shippingDetails.contactNumber} onChange={handleDetailsChange} className="form-input" placeholder="10-digit mobile number" />
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                               <label className="block text-slate-700 font-semibold">Pincode</label>
                               <input type="text" name="pincode" value={shippingDetails.pincode} onChange={handleDetailsChange} className="form-input" placeholder="6-digit pincode" />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold">City</label>
                                <input type="text" name="city" value={shippingDetails.city} onChange={handleDetailsChange} className="form-input" placeholder="e.g., Mumbai" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Address</label>
                            <textarea
                                name="addressLine"
                                value={shippingDetails.addressLine}
                                onChange={handleDetailsChange}
                                required
                                className="form-input"
                                rows="3"
                                placeholder="House No., Building Name, Street, Landmark"
                            ></textarea>
                        </div>
                        {error && <p className="text-rose-500 mt-2 text-sm text-center">{error}</p>}
                        <div className="pt-2">
                            <button type="submit" className="w-full btn-primary py-3 text-lg">
                                Place Order (COD)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

