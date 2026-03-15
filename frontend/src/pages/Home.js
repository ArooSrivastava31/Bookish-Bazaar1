import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { BookOpen, Repeat, Feather } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500">{children}</p>
    </div>
);

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="text-center md:transform md:translate-x-4 lg:translate-x-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4 leading-tight">
                            Own the <span className="text-teal-600">Story</span>,
                            <br/>
                            Share the <span className="text-sky-500">Adventure</span>.
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
                            Welcome to Bookish Bazaar, the ultimate destination for book lovers to discover, trade, and cherish stories. Dive into a community where every book finds a new home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/books" className="btn-primary px-8 py-3 text-lg">
                                Explore Books
                            </Link>
                            <Link to={isAuthenticated ? "/add-book" : "/login"} className="btn-secondary px-8 py-3 text-lg">
                                List a Book
                            </Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                       <Carousel />
                    </div>
                </div>
            </div>
            
            {/* Features Section */}
            <div className="bg-slate-100 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
                    <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Getting started is easy. Follow these simple steps to join our community of book enthusiasts.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={<Feather size={28} className="text-teal-600" />} title="List Your Book">
                            Easily upload your pre-loved books with a title, author, and a few photos. Set a price or choose to exchange.
                        </FeatureCard>
                        <FeatureCard icon={<BookOpen size={28} className="text-teal-600" />} title="Discover Reads">
                            Browse through thousands of books listed by others. Find rare gems or your next favorite novel.
                        </FeatureCard>
                        <FeatureCard icon={<Repeat size={28} className="text-teal-600" />} title="Sell or Exchange">
                            Connect with other users to arrange a sale or an exchange. It's a simple, secure, and fun way to refresh your library.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
