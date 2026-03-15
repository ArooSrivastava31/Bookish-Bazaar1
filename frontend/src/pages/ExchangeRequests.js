import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.js';
import { ArrowRight, Check, X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const ExchangeRequests = () => {
    const [requests, setRequests] = useState({ receivedRequests: [], sentRequests: [] });
    const [loading, setLoading] = useState(true);
    const { user, token } = useContext(AuthContext);
    const [view, setView] = useState('received'); // State to toggle between views

    const fetchRequests = useCallback(async () => {
        if (!user || !token) {
            setLoading(false);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/api/exchanges`, config);
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching exchange requests:", err);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/api/exchanges/${id}`, { status }, config);
            fetchRequests(); // Re-fetch to update the UI
        } catch (err) {
            console.error("Error updating request status:", err);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-emerald-100 text-emerald-800',
            rejected: 'bg-rose-100 text-rose-800'
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const RequestCard = ({ request, type }) => {
        if (!request.bookRequested) {
            return (
                 <div key={request._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 opacity-60">
                    <p className="text-slate-500 italic">This request is for a book that has been deleted.</p>
                </div>
            );
        }

        const isReceived = type === 'received';
        const otherUser = isReceived ? request.requester : request.owner;
        
        return (
            <div key={request._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                <img src={`${API_BASE_URL}/${request.bookRequested.imageUrl}`} alt={request.bookRequested.title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{request.bookRequested.title}</h3>
                    <p className="text-sm text-slate-500">
                        {isReceived ? 'From: ' : 'To: '}
                        <span className="font-semibold text-slate-700">{otherUser?.username || 'Unknown'}</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Offering: <span className="italic">{request.offeredBookTitle}</span></p>
                </div>
                <div className="flex flex-col items-stretch md:items-end w-full md:w-auto space-y-2">
                    <StatusBadge status={request.status} />
                    {isReceived && request.status === 'pending' && (
                        <div className="flex space-x-2">
                            <button onClick={() => handleStatusUpdate(request._id, 'accepted')} className="btn-primary bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-xs px-2 py-1 flex items-center"><Check size={14} className="mr-1"/>Accept</button>
                            <button onClick={() => handleStatusUpdate(request._id, 'rejected')} className="btn-danger text-xs px-2 py-1 flex items-center"><X size={14} className="mr-1"/>Reject</button>
                        </div>
                    )}
                    {request.status === 'accepted' && request.conversationId && (
                        <Link to={`/chat/${request.conversationId}`} className="btn-primary bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 text-xs px-2 py-1 flex items-center justify-center">
                           Chat Now <ArrowRight size={14} className="ml-1"/>
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center pt-32 text-slate-500">Loading requests...</div>;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-6 text-slate-800">My Exchange Requests</h1>
            
            <div className="flex justify-center border-b mb-6">
                <button onClick={() => setView('received')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${view === 'received' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>
                    <ArrowDownCircle size={20} /> Received Requests
                </button>
                <button onClick={() => setView('sent')} className={`flex items-center gap-2 px-6 py-3 font-semibold ${view === 'sent' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500'}`}>
                    <ArrowUpCircle size={20} /> Sent Requests
                </button>
            </div>

            {view === 'received' ? (
                <div>
                    {requests.receivedRequests.length > 0 ? (
                        <div className="space-y-4">
                           {requests.receivedRequests.map(req => <RequestCard key={req._id} request={req} type="received"/>)}
                        </div>
                    ) : <p className="text-center text-slate-500 py-8">You have no incoming exchange requests.</p>}
                </div>
            ) : (
                <div>
                    {requests.sentRequests.length > 0 ? (
                        <div className="space-y-4">
                            {requests.sentRequests.map(req => <RequestCard key={req._id} request={req} type="sent"/>)}
                        </div>
                    ) : <p className="text-center text-slate-500 py-8">You have not sent any exchange requests.</p>}
                </div>
            )}
        </div>
    );
};

export default ExchangeRequests;
