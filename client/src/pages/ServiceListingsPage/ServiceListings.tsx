import React, { useEffect, useState } from "react";
import { getAllServices } from '../../api/serviceApi';
import useAuth from '../../hooks/useAuth';
import { createBooking as apiCreateBooking } from '../../api/bookingApi';

function ServiceListings() {
    const { user } = useAuth();
    const [services, setServices] = useState<any[]>([]);
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
        if (!user) return alert('Please login to book');
        setBookingTarget(serviceId);
    };

    const submitBooking = async () => {
        if (!bookingTarget || !date || !slot) return alert('Please pick date and slot');
        try {
            await apiCreateBooking({ serviceId: bookingTarget, date, slot });
            alert('Booking created');
            setBookingTarget(null);
            setDate('');
            setSlot('');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div>Loading services...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Service Listings</h2>
            <div className="grid gap-4">
                                {services.map(s => (
                                        <div key={s._id} className="border rounded p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                            <h3 className="font-semibold text-lg">{s.title}</h3>
                                                            <p className="text-sm text-gray-600">{s.description}</p>
                                                            <p className="mt-2 text-sm"><strong>Provider:</strong> {s.provider?.name || 'Unknown'}</p>
                                                            <p className="text-sm"><strong>Price:</strong> {s.price} ({s.priceType})</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                            {user?.role === 'user' && <button onClick={() => handleBook(s._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Book</button>}
                                                    </div>
                                                </div>

                                                {/* Inline booking form for this service */}
                                                {bookingTarget === s._id && (
                                                    <div className="mt-4 border-t pt-4">
                                                        <h4 className="font-semibold">Create Booking for {s.title}</h4>
                                                        <div className="grid grid-cols-1 gap-2 mt-2">
                                                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
                                                            <input placeholder="Slot" value={slot} onChange={e => setSlot(e.target.value)} className="border p-2 rounded" />
                                                            <div className="flex gap-2">
                                                                <button onClick={submitBooking} className="bg-green-600 text-white px-3 py-1 rounded">Confirm</button>
                                                                <button onClick={() => setBookingTarget(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                ))}
            </div>

            {bookingTarget && (
                <div className="mt-6 border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold">Create Booking</h3>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
                        <input placeholder="Slot" value={slot} onChange={e => setSlot(e.target.value)} className="border p-2 rounded" />
                        <div className="flex gap-2">
                            <button onClick={submitBooking} className="bg-green-600 text-white px-3 py-1 rounded">Confirm</button>
                            <button onClick={() => setBookingTarget(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ServiceListings;