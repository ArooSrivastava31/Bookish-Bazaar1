import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const Chat = () => {
    const { id: conversationId } = useParams();
    const { user, token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // The global `io` function is available from the script added to index.html
        socket.current = window.io(API_BASE_URL);

        socket.current.emit('joinRoom', { conversationId });

        socket.current.on('receiveMessage', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        const fetchMessages = async () => {
            try {
                 const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/chat/${conversationId}/messages`, config);
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token && conversationId) {
            fetchMessages();
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [conversationId, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && user) {
            socket.current.emit('sendMessage', {
                conversationId,
                senderId: user._id,
                text: newMessage,
            });
            setNewMessage('');
        }
    };

    if (loading) return <div className="text-center pt-32 text-slate-500">Loading Chat...</div>;

    return (
        <div className="container mx-auto px-4 pt-20 flex flex-col h-screen">
            <h1 className="text-3xl font-bold text-center mb-4 text-slate-800">Chat</h1>
            <div className="flex-grow bg-white border border-slate-200 rounded-lg shadow-md flex flex-col overflow-hidden">
                <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg._id} className={`flex items-end gap-2 ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                                msg.sender._id === user?._id 
                                ? 'bg-teal-600 text-white rounded-br-none' 
                                : 'bg-slate-200 text-slate-800 rounded-bl-none'
                            }`}>
                                <p className="font-bold text-sm">{msg.sender.username}</p>
                                <p className="text-base">{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button type="submit" className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 ml-3 transition-colors">
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
