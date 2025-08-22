import React from "react";
import { Link } from "react-router-dom";

const categories = [
    { key: 'plumber', label: 'Plumbers' },
    { key: 'electrician', label: 'Electricians' },
    { key: 'cleaner', label: 'Cleaners' },
    { key: 'carpenter', label: 'Carpenters' },
];

function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Find trusted local services, fast</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Connect with nearby plumbers, electricians, cleaners and more — search, book, and review with ease.</p>

                    <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-xl">
                            <form className="flex gap-2">
                                <input
                                    aria-label="Search services or location"
                                    placeholder="Search services (e.g. plumber) or city"
                                    className="flex-1 px-4 py-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button type="submit" className="bg-blue-600 text-white px-6 rounded-r-md">Search</button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center gap-4 flex-wrap">
                        {categories.map(c => (
                            <Link key={c.key} to={`/services?category=${c.key}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700">{c.label}</Link>
                        ))}
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

                <div className="mt-10 text-center">
                    <Link to="/services" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md">Browse all services</Link>
                </div>
            </section>
        </main>
    );
}

export default Home;