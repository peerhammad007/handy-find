import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";


function Navbar() {
    const { user, token, signOut } = useAuth();
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(o => !o);
    const close = () => setOpen(false);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" onClick={close} className="flex items-center gap-2 text-sky-600 font-bold text-xl">
                        <span className="inline-block w-8 h-8 bg-sky-600 rounded-full text-white flex items-center justify-center font-bold">HF</span>
                        <span className="ml-1">HandyFind</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-6">
                        {!token && (
                            <>
                                <Link to="/services-info" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Services</Link>
                                <Link to="/how-it-works" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">How it Works</Link>
                                <Link to="/contact-us" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition">Contact Us</Link>
                                <Link to="/register" className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition">Sign Up</Link>
                            </>
                        )}
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
                                <button onClick={signOut} className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition">Sign Out</button>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button aria-label="Toggle navigation" onClick={toggle} className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="sm:hidden bg-white border-t border-slate-100 shadow-sm">
                    <div className="px-4 py-4 space-y-1">
                        {!token && (
                            <>
                                <Link to="/services-info" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Services</Link>
                                <Link to="/how-it-works" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">How it Works</Link>
                                <Link to="/contact-us" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Contact Us</Link>
                                <Link to="/register" onClick={close} className="block mt-2 bg-sky-600 text-white px-4 py-2 rounded-full text-center">Sign Up</Link>
                            </>
                        )}
                        {token && (
                            <>
                                {user?.role === "user" && (
                                    <Link to="/services" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Services</Link>
                                )}
                                <Link to="/booking" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Bookings</Link>
                                <Link to="/profile" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Profile</Link>
                                {user?.role === "provider" && (
                                    <>
                                        <Link to="/reviews" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Reviews</Link>
                                        <Link to="/dashboard" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">Dashboard</Link>
                                        <Link to="/my-services" onClick={close} className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50">My Services</Link>
                                    </>
                                )}
                                <button onClick={() => { signOut(); close(); }} className="w-full mt-2 bg-sky-600 text-white px-4 py-2 rounded-full">Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;