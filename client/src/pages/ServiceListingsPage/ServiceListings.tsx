import React, { useEffect, useState } from "react";
import { getAllServices } from '../../api/serviceApi';
import useAuth from '../../hooks/useAuth';
import { createBooking as apiCreateBooking, getBookings as apiGetBookings } from '../../api/bookingApi';
import { useNotify } from '../../components/Toast/ToastProvider';

function ServiceListings() {
    const { user } = useAuth();
    const { notify } = useNotify();
    const [services, setServices] = useState<any[]>([]);
    const [activeBookedServiceIds, setActiveBookedServiceIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<'title' | 'category'>('title');
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
                const sorted = [...all].sort((a: any, b: any) => getItemTime(b) - getItemTime(a));
                setServices(sorted);
                // also load user's active bookings to prevent duplicates
                if (user?.role === 'user') {
                    try {
                        const myBookings = await apiGetBookings();
                        const active = new Set<string>();
                        myBookings.forEach((b: any) => {
                            if (b?.status === 'pending' || b?.status === 'accepted') {
                                const sid = typeof b.service === 'object' ? (b.service as any)?._id : b.service;
                                if (sid) active.add(String(sid));
                            }
                        });
                        setActiveBookedServiceIds(active);
                    } catch (e) {
                        // ignore silently
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load services');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.role]);

    const getItemTime = (item: any): number => {
        if (item?.createdAt) {
            const t = Date.parse(item.createdAt);
            if (!isNaN(t)) return t;
        }
        if (item?._id && typeof item._id === 'string' && item._id.length >= 8) {
            const seconds = parseInt(item._id.substring(0, 8), 16);
            if (!isNaN(seconds)) return seconds * 1000;
        }
        return 0;
    };

    const handleBook = async (serviceId: string) => {
        if (!user) {
            notify('info', 'Please login to book');
            return;
        }
        if (activeBookedServiceIds.has(serviceId)) {
            notify('warning', 'You already have an active booking for this service');
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
            setActiveBookedServiceIds(prev => {
                const next = new Set(prev);
                if (bookingTarget) next.add(bookingTarget);
                return next;
            });
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
                {/* Search / Filter Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    <div className="flex flex-col gap-1 w-full sm:max-w-xs">
                        <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700">Search</label>
                        <input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder={`Search by ${searchField}`}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label htmlFor="searchField" className="text-sm font-medium text-gray-700">Field</label>
                        <select
                            id="searchField"
                            value={searchField}
                            onChange={e => { setSearchField(e.target.value as 'title' | 'category'); setCurrentPage(1); }}
                            className="border p-2 rounded"
                        >
                            <option value="title">Title</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                </div>
                <div className="grid gap-4">
                    {services
                        .filter((s: any) => {
                            if (!searchTerm.trim()) return true;
                            const fieldVal = (searchField === 'title' ? s.title : s.category) || '';
                            return fieldVal.toLowerCase().includes(searchTerm.trim().toLowerCase());
                        })
                        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                        .map((s: any) => (
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
                                    {user?.role === 'user' && (
                                        activeBookedServiceIds.has(s._id) ? (
                                            <button disabled className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed">Already booked</button>
                                        ) : (
                                            <button onClick={() => handleBook(s._id)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md">Book</button>
                                        )
                                    )}
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
                {services.filter((s: any) => {
                    if (!searchTerm.trim()) return true;
                    const fieldVal = (searchField === 'title' ? s.title : s.category) || '';
                    return fieldVal.toLowerCase().includes(searchTerm.trim().toLowerCase());
                }).length > PAGE_SIZE && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200">Prev</button>
                        {Array.from({ length: Math.ceil(services.filter((s: any) => {
                            if (!searchTerm.trim()) return true;
                            const fieldVal = (searchField === 'title' ? s.title : s.category) || '';
                            return fieldVal.toLowerCase().includes(searchTerm.trim().toLowerCase());
                        }).length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`px-3 py-1 rounded ${p === currentPage ? 'bg-sky-600 text-white' : 'bg-white border'}`}
                            >{p}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(services.filter((s: any) => {
                            if (!searchTerm.trim()) return true;
                            const fieldVal = (searchField === 'title' ? s.title : s.category) || '';
                            return fieldVal.toLowerCase().includes(searchTerm.trim().toLowerCase());
                        }).length / PAGE_SIZE), p + 1))} className="px-3 py-1 rounded bg-gray-200">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceListings;