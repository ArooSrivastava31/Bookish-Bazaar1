import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const res = await login({ email, password });
        if(res && res.message) {
            setError(res.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center pt-24 pb-12 bg-slate-50">
            <div className="px-8 py-10 text-left bg-white shadow-xl rounded-lg w-full max-w-md">
                <h3 className="text-2xl font-bold text-center text-slate-800">Welcome Back!</h3>
                <p className="text-center text-slate-500 mt-2">Login to your account to continue.</p>
                <form onSubmit={onSubmit} className="mt-8">
                    {error && <p className="bg-rose-100 text-rose-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    <div className="space-y-6">
                        <div>
                            <label className="block font-semibold text-slate-700" htmlFor="email">Email Address</label>
                            <input type="email" placeholder="you@example.com" name="email" value={email} onChange={onChange} required
                                className="form-input"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label className="block font-semibold text-slate-700">Password</label>
                            </div>
                            <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required
                                className="form-input"/>
                        </div>
                        <div>
                            <button disabled={isLoading} className="w-full btn-primary py-3">
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </div>
                </form>
                 <div className="mt-6 text-slate-500 text-center">
                    Don't have an account?
                    <Link className="text-teal-600 hover:underline font-semibold ml-2" to="/signup">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
