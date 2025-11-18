import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SERVICES = [
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'carpentry', label: 'Carpentry' },
];

const CONTACT = {
  email: 'hello@handyfind.example',
  phone: '+1 (555) 123-4567'
};

function Navbar() {
    const { user, token, signOut } = useAuth();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 text-sky-600 font-bold text-xl">
                        <span className="inline-block w-8 h-8 bg-sky-600 rounded-full text-white flex items-center justify-center font-bold">HF</span>
                        <span className="ml-1">HandyFind</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* Public links - hide when authenticated */}
                        {!token && (
                            <>
                                <Link to="/services-info" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Services</Link>
                                <Link to="/how-it-works" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">How it Works</Link>
                                <Link to="/contact-us" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Contact Us</Link>

                                {/* CTA */}
                                <Link to="/register" className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition">Sign Up</Link>
                            </>
                        )}

                        {/* Authenticated actions */}
                        {token && (
                            <div className="flex items-center gap-3">
                                {user?.role === "user" && (
                                    <Link to="/services" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Services</Link>
                                )}
                                <Link to="/booking" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Bookings</Link>
                                <Link to="/profile" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Profile</Link>
                                {user?.role === "provider" && (
                                    <>
                                        <Link to="/reviews" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Reviews</Link>
                                        <Link to="/dashboard" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Dashboard</Link>
                                        <Link to="/my-services" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">My Services</Link>
                                    </>
                                )}
                                <button
                                    onClick={signOut}
                                    className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;