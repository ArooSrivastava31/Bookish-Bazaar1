import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-slate-300 mt-16">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Bookish Bazaar. All rights reserved.</p>
                    {/* <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#!" className="text-sm hover:text-teal-400 transition-colors">Privacy Policy</a>
                        <a href="#!" className="text-sm hover:text-teal-400 transition-colors">Terms of Service</a>
                        <a href="#!" className="text-sm hover:text-teal-400 transition-colors">Contact</a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
