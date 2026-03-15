import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const { signup, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const { username, email, password, password2 } = formData;
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        
        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        setError('');
        const res = await signup({ username, email, password });
        if(res && res.message) {
            setError(res.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center pt-24 pb-12 bg-slate-50">
            <div className="px-8 py-10 text-left bg-white shadow-xl rounded-lg w-full max-w-md">
                <h3 className="text-2xl font-bold text-center text-slate-800">Create an Account</h3>
                 <p className="text-center text-slate-500 mt-2">Join our community of book lovers!</p>
                <form onSubmit={onSubmit} className="mt-8">
                     {error && <p className="bg-rose-100 text-rose-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    <div className="space-y-6">
                        <div>
                            <label className="block font-semibold text-slate-700" htmlFor="username">Username</label>
                            <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required
                                className="form-input"/>
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700" htmlFor="email">Email</label>
                            <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required
                                className="form-input"/>
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700">Password</label>
                            <input type="password" placeholder="Password (min. 6 characters)" name="password" value={password} onChange={onChange} required minLength="6"
                                className="form-input"/>
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700">Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" name="password2" value={password2} onChange={onChange} required minLength="6"
                                className="form-input"/>
                        </div>
                        <div>
                            <button disabled={isLoading} className="w-full btn-primary py-3">
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </div>
                </form>
                 <div className="mt-6 text-slate-500 text-center">
                    Already have an account?
                    <Link className="text-teal-600 hover:underline font-semibold ml-2" to="/login">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
