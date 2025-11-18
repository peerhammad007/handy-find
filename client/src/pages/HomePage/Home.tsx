import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white" />
                    <div className="relative max-w-6xl mx-auto px-6 py-28">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 shadow-md text-center">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Find reliable help, fast.</h1>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Connect with trusted local service providers for any job, anytime.</p>

                            <div className="mt-8">
                                <Link to="/services" className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full text-base font-medium shadow">Find Services Near You</Link>
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-10">
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5 10.343 8 12 8zM6 22v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
                                    <p className="mt-2 font-semibold">For Clients</p>
                                    <p className="text-sm text-gray-600">Browse, Book & Review</p>
                                </div>
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-3.866-3.582-7-8-7m16 14v-6a4 4 0 00-4-4H6" /></svg>
                                    <p className="mt-2 font-semibold">For Providers</p>
                                    <p className="text-sm text-gray-600">List, Manage & Get Hired</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* subtle decorative circle */}
                <div className="hidden md:block absolute -right-24 -top-24 w-72 h-72 bg-sky-100 rounded-full opacity-60 transform rotate-12" />
            </section>

            <section className="max-w-6xl mx-auto px-6 py-12">
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