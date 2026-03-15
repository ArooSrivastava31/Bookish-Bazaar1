import React, { useState, useContext, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookMarked, LogOut, Menu, X, UserCircle, PlusCircle, ShoppingCart, Mail } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };
    
    const authedLinks = (
        <>
            <Link to="/my-books" onClick={() => setIsOpen(false)} className="nav-link">
                <BookMarked className="inline-block mr-2 h-5 w-5" />My Books
            </Link>
             <Link to="/my-orders" onClick={() => setIsOpen(false)} className="nav-link">
                <ShoppingCart className="inline-block mr-2 h-5 w-5" />My Orders
            </Link>
            <Link to="/exchange-requests" onClick={() => setIsOpen(false)} className="nav-link">
                 <Mail className="inline-block mr-2 h-5 w-5" />My Requests
            </Link>
            <Link to="/add-book" onClick={() => setIsOpen(false)} className="btn-primary-ghost md:btn-primary">
                 <PlusCircle className="inline-block mr-2 h-5 w-5" /><span>Add Book</span>
            </Link>
            <button onClick={handleLogout} className="nav-link">
                <LogOut className="inline-block mr-2 h-5 w-5" />Logout
            </button>
        </>
    );

    const guestLinks = (
         <>
            <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">Login</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary">Sign Up</Link>
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-20 top-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-slate-800">
                           Bookish<span className="text-teal-600">Bazaar</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/books" className="nav-link">Collections</Link>
                        {isAuthenticated ? authedLinks : guestLinks}
                         {isAuthenticated && user && (
                            <span className="flex items-center text-sm font-semibold text-slate-600 pl-4 border-l ml-4">
                                <UserCircle className="mr-2 h-5 w-5 text-teal-600"/> {user.username || 'User'}
                            </span>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
                            {isOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pt-2 pb-4 space-y-2">
                         <Link to="/books" onClick={() => setIsOpen(false)} className="nav-link-mobile">Collections</Link>
                         {isAuthenticated ? authedLinks : guestLinks}
                         {isAuthenticated && user && (
                            <span className="flex items-center text-sm font-semibold text-slate-600 px-3 pt-2 border-t mt-2">
                                <UserCircle className="mr-2 h-5 w-5 text-teal-600"/> {user.username || 'User'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

// Add some custom styles for the links to keep the JSX cleaner
const style = document.createElement('style');
style.textContent = `
    .nav-link {
        @apply text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors;
    }
    .nav-link-mobile {
        @apply block text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition-colors;
    }
    .btn-primary {
        @apply inline-flex items-center bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-all transform hover:scale-105;
    }
    .btn-primary-ghost {
         @apply inline-flex items-center bg-teal-100 text-teal-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-200 transition-all;
    }
`;
document.head.append(style);


export default Navbar;
