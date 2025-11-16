import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
    const { user, token, signOut } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                        <span className="inline-block w-7 h-7 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">HF</span>
                        HandyFind
                    </Link>
                    <div className="flex space-x-4">
                        {token && (
                            <>
                                <Link to="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">Services</Link>
                                <Link to="/booking" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">Bookings</Link>
                                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">Profile</Link>
                                {/* Provider-only links */}
                                {user?.role === "provider" && (
                                    <>
                                        <Link to="/reviews" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">Reviews</Link>
                                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">Dashboard</Link>
                                        <Link to="/my-services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded transition">My Services</Link>
                                    </>
                                )}
                                <button
                                    onClick={signOut}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-2"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!token && (
                            <>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Register</Link>
                                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;