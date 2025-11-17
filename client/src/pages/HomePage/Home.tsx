import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Find trusted local services, fast</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Connect with nearby plumbers, electricians, cleaners and more — book trusted local professionals in just a few taps.</p>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-lg overflow-hidden shadow-sm">
                            <img src="https://images.unsplash.com/photo-1686178827149-6d55c72d81df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMHNlcnZpY2VzfGVufDB8fDB8fHww" alt="home repairs" className="w-full h-48 object-cover" />
                            <div className="p-4 text-left">
                                <h3 className="font-semibold">Home Repairs</h3>
                                <p className="text-sm text-gray-600">Plumbing, carpentry and general fixes.</p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-sm">
                            <img src="https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=1200&auto=format&fit=crop" alt="electrical" className="w-full h-48 object-cover" />
                            <div className="p-4 text-left">
                                <h3 className="font-semibold">Electrical Work</h3>
                                <p className="text-sm text-gray-600">Certified electricians for installations and repairs.</p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-sm">
                            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop" alt="cleaning" className="w-full h-48 object-cover" />
                            <div className="p-4 text-left">
                                <h3 className="font-semibold">Cleaning & Services</h3>
                                <p className="text-sm text-gray-600">Regular or deep-clean services from trusted pros.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md">Login</Link>
                        <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded-md">Register</Link>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg">Browse Services</h3>
                        <p className="mt-2 text-sm text-gray-600">Find professionals by category, price, rating and location.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg">Easy Booking</h3>
                        <p className="mt-2 text-sm text-gray-600">Choose an available slot and confirm booking in seconds.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg">Ratings & Reviews</h3>
                        <p className="mt-2 text-sm text-gray-600">Read real reviews to pick the best local professional.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;