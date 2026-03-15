import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

const AddBook = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        condition: 'New',
        description: '',
        listingType: 'Sell',
        price: '',
        exchangePreferences: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File is too large. Maximum size is 5MB.');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setError(''); // Clear previous errors
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        
        if (!image) {
            setError('Please upload an image for the book.');
            return;
        }

        const bookData = new FormData();
        bookData.append('image', image);
        for (const key in formData) {
            bookData.append(key, formData[key]);
        }
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.post(`${API_BASE_URL}/api/books`, bookData, config);
            navigate('/my-books');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.msg || 'An error occurred. Please try again.');
            console.error(err);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">List Your Book</h1>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Title and Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-semibold">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={onChange} required className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Author</label>
                            <input type="text" name="author" value={formData.author} onChange={onChange} required className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                        </div>
                    </div>

                    {/* Genre and Condition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-slate-700 font-semibold">Genre</label>
                            <input type="text" name="genre" value={formData.genre} onChange={onChange} placeholder="e.g., Fantasy, Sci-Fi" required className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold">Condition</label>
                            <select name="condition" value={formData.condition} onChange={onChange} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option>New</option>
                                <option>Like New</option>
                                <option>Good</option>
                                <option>Acceptable</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-slate-700 font-semibold">Description</label>
                        <textarea name="description" value={formData.description} onChange={onChange} required className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" rows="4" placeholder="A brief summary of the book..."></textarea>
                    </div>

                    {/* Listing Details */}
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-slate-700 font-semibold">Listing Type</label>
                                <select name="listingType" value={formData.listingType} onChange={onChange} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    <option value="Sell">Sell</option>
                                    <option value="Exchange">Exchange</option>
                                    <option value="Both">Both (Sell & Exchange)</option>
                                </select>
                            </div>
                            {(formData.listingType === 'Sell' || formData.listingType === 'Both') && (
                                <div>
                                    <label className="block text-slate-700 font-semibold">Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={onChange} required min="0" step="10" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                                </div>
                            )}
                        </div>
                         {(formData.listingType === 'Exchange' || formData.listingType === 'Both') && (
                            <div className="mt-6">
                                <label className="block text-slate-700 font-semibold">Exchange Preferences</label>
                                <input type="text" name="exchangePreferences" value={formData.exchangePreferences} onChange={onChange} placeholder="e.g., 'Fiction novels', 'Specific author', etc." required className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                            </div>
                        )}
                    </div>
                    
                    {/* Image Upload */}
                    <div>
                        <label className="block text-slate-700 font-semibold">Book Image</label>
                        <div className="mt-2 flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                {preview ? (
                                     <img src={preview} alt="Book Preview" className="h-full py-2 object-contain"/>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                                    </div>
                                )}
                                <input id="dropzone-file" type="file" name="image" onChange={onFileChange} required className="hidden" accept="image/png, image/jpeg, image/jpg"/>
                            </label>
                        </div> 
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <button type="submit" className="w-full btn-primary py-3 text-lg">Add Book to Listings</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
