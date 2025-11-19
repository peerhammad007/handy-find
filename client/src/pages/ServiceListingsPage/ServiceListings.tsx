import React, { useEffect, useState } from "react";
import { getAllServices } from '../../api/serviceApi';
import useAuth from '../../hooks/useAuth';
import { createBooking as apiCreateBooking } from '../../api/bookingApi';
import { useNotify } from '../../components/Toast/ToastProvider';

function ServiceListings() {
    const { user } = useAuth();
    const { notify } = useNotify();
    const [services, setServices] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const PAGE_SIZE = 6;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingTarget, setBookingTarget] = useState<string | null>(null);
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const all = await getAllServices();
                setServices(all);
            } catch (err: any) {
                setError(err.message || 'Failed to load services');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleBook = async (serviceId: string) => {
        if (!user) {
            notify('info', 'Please login to book');
            return;
        }
        setBookingTarget(serviceId);
    };

    const submitBooking = async () => {
        if (!bookingTarget || !date || !slot) {
            notify('warning', 'Please pick date and slot');
            return;
        }
        try {
            await apiCreateBooking({ serviceId: bookingTarget, date, slot });
            notify('success', 'Booking created');
            setBookingTarget(null);
            setDate('');
            setSlot('');
        } catch (err: any) {
            notify('error', err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">Loading services...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-sky-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Service Listings</h2>
                <div className="grid gap-4">
                    {services.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((s: any) => (
                        <div key={s._id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">{s.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                                    <div className="mt-2 text-sm text-gray-600">Provider: <span className="font-medium text-gray-800">{s.provider?.name || 'Unknown'}</span></div>
                                    <div className="text-sm mt-1">Price: <span className="font-medium">{s.price} ({s.priceType})</span></div>
                                    <div className="flex flex-wrap gap-3 mt-3 text-sm">
                                        <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">{s.category}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {user?.role === 'user' && <button onClick={() => handleBook(s._id)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md">Book</button>}
                                </div>
                            </div>

                            {/* Inline booking form for this service */}
                            {bookingTarget === s._id && (
                                <div className="mt-4 border-t pt-4 bg-gray-50 p-3 rounded">
                                    <h4 className="font-semibold">Create Booking for {s.title}</h4>
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
                                        <input placeholder="Slot" value={slot} onChange={e => setSlot(e.target.value)} className="border p-2 rounded" />
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={submitBooking} className="bg-green-600 text-white px-3 py-1 rounded">Confirm</button>
                                            <button onClick={() => setBookingTarget(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {services.length > PAGE_SIZE && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200">Prev</button>
                        {Array.from({ length: Math.ceil(services.length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${p === currentPage ? 'bg-sky-600 text-white' : 'bg-white border'}`}>{p}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(services.length / PAGE_SIZE), p + 1))} className="px-3 py-1 rounded bg-gray-200">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceListings;