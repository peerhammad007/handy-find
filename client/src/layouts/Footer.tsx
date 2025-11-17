import React from "react";
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="border-t bg-gray-50 mt-8">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <Link to="/" className="text-lg font-semibold">Handy Find</Link>
                    <div className="text-sm text-gray-600">Connects customers with reliable local service providers</div>
                </div>

                <nav className="flex gap-4">
                    <Link to="/" className="text-sm text-gray-700 hover:underline">Home</Link>
                    <Link to="/services" className="text-sm text-gray-700 hover:underline">Services</Link>
                    <Link to="/booking" className="text-sm text-gray-700 hover:underline">Bookings</Link>
                    <Link to="/profile" className="text-sm text-gray-700 hover:underline">Profile</Link>
                </nav>

                <div className="text-sm text-gray-500 text-center md:text-right">&copy; {new Date().getFullYear()} Handy Find — Built with care</div>
            </div>
        </footer>
    );
}

export default Footer;