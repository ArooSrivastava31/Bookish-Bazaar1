import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Tag, X, Package } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const StatusModal = ({ order, onClose }) => {
    if (!order) return null;

    const imageUrl = `${API_BASE_URL}/${order.book.imageUrl.replace(/\\/g, '/')}`;
    
    // Calculate estimated delivery date from when the order was created
    const createdDate = new Date(order.createdAt);
    const arrivalStart = new Date(createdDate);
    arrivalStart.setDate(createdDate.getDate() + 5);
    const arrivalEnd = new Date(createdDate);
    arrivalEnd.setDate(createdDate.getDate() + 7);

    const options = { month: 'long', day: 'numeric' };
    const startDate = arrivalStart.toLocaleDateString('en-US', options);
    const endDate = arrivalEnd.toLocaleDateString('en-US', options);
    const deliveryDate = `${startDate} - ${endDate}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <Package className="h-12 w-12 text-teal-600 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-slate-800">Order Status</h2>
                </div>

                <div className="mt-6 bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-600">Current Status:</p>
                    <p className="text-lg font-bold text-teal-600">{order.status}</p>
                     <p className="text-sm text-slate-500 mt-2">Estimated Delivery: <span className="font-semibold">{deliveryDate}</span></p>
                </div>
                
                <div className="mt-4 border-t pt-4">
                     <h3 className="text-lg font-semibold mb-2 text-slate-700">Order Summary</h3>
                     <div className="flex items-start gap-4">
                        <img src={imageUrl} alt={order.book.title} className="w-24 h-36 object-cover rounded flex-shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-xl font-bold">{order.book.title}</h4>
                            <p className="text-slate-500 text-sm">by {order.book.author}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">Genre:</span> {order.book.genre}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">Condition:</span> {order.book.condition}</p>
                            <p className="text-2xl font-bold text-teal-600 pt-2">₹{order.price}</p>
                        </div>
                    </div>
                </div>

                 <div className="mt-4 border-t pt-4">
                     <h3 className="text-lg font-semibold mb-2 text-slate-700">Shipping To</h3>
                     <div className="text-sm text-slate-600">
                        <p className="font-bold">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                        <p>Contact: {order.shippingAddress.contactNumber}</p>
                     </div>
                </div>

            </div>
        </div>
    );
};


const MyOrders = () => {
    const [orders, setOrders] = useState({ purchases: [], sales: [] });
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);
    const [view, setView] = useState('purchases');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const purchasesRes = await axios.get(`${API_BASE_URL}/api/orders/my-purchases`, config);
            const salesRes = await axios.get(`${API_BASE_URL}/api/orders/my-sales`, config);
            setOrders({ purchases: purchasesRes.data, sales: salesRes.data });
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const OrderCard = ({ order, type }) => {
        const imageUrl = `${API_BASE_URL}/${order.book.imageUrl.replace(/\\/g, '/')}`;
        const isPurchase = type === 'purchase';

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={imageUrl} alt={order.book.title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{order.book.title}</h3>
                    <p className="text-sm text-slate-500">
                        {isPurchase ? `Sold by: ${order.seller.username}` : `Bought by: ${order.buyer.username}`}
                    </p>
                    <p className="text-lg font-semibold mt-1">₹{order.price}</p>
                </div>
                <div className="flex flex-col items-stretch sm:items-end w-full sm:w-auto space-y-2">
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800`}>
                        {order.status}
                    </span>
                    {isPurchase && (
                        <button onClick={() => setSelectedOrder(order)} className="btn-secondary py-1 px-3 text-sm">
                            See Status
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center pt-32 text-slate-500">Loading your orders...</div>;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
            {selectedOrder && <StatusModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            <h1 className="text-4xl font-bold text-center mb-6 text-slate-800">My Orders</h1>

            <div className="flex justify-center border-b mb-6">
                <button onClick={() => setView('purchases')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${view === 'purchases' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>
                    <ShoppingCart size={20}/> My Purchases
                </button>
                <button onClick={() => setView('sales')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${view === 'sales' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>
                    <Tag size={20} /> My Sales
                </button>
            </div>

            {view === 'purchases' ? (
                <div>
                    {orders.purchases.length > 0 ? (
                        <div className="space-y-4">
                            {orders.purchases.map(order => <OrderCard key={order._id} order={order} type="purchase"/>)}
                        </div>
                    ) : <p className="text-center text-slate-500 py-8">You haven't purchased any books yet.</p>}
                </div>
            ) : (
                 <div>
                    {orders.sales.length > 0 ? (
                        <div className="space-y-4">
                             {orders.sales.map(order => <OrderCard key={order._id} order={order} type="sale"/>)}
                        </div>
                    ) : <p className="text-center text-slate-500 py-8">You haven't sold any books yet.</p>}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

