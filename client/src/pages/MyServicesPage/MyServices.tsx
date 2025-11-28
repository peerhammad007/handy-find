import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useAuth from '../../hooks/useAuth';
import { useNotify } from '../../components/Toast/ToastProvider';
import { getAllServices, createService as apiCreateService, removeService as apiRemoveService } from '../../api/serviceApi';
import {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
  addService,
  deleteService,
} from '../../features/services/servicesSlice';
import { Service } from '../../types/Service';

const MyServices: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { notify, confirm } = useNotify();
  const services = useSelector((state: RootState) => state.services.services);
  const loading = useSelector((state: RootState) => state.services.loading);
  const error = useSelector((state: RootState) => state.services.error);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 6;

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'hour',
    category: '',
    serviceableLocations: '',
  });

  useEffect(() => {
    const load = async () => {
      dispatch(fetchServicesStart());
      try {
        const all = await getAllServices();
        // Rely on server-side ordering (createdAt desc)
        dispatch(fetchServicesSuccess(all));
      } catch (err: any) {
        dispatch(fetchServicesFailure(err.message || 'Failed to load services'));
      }
    };
    load();
  }, [dispatch]);

  const myServices = user
    ? services.filter(s => {
        const providerId = (s.provider as any)?._id;
        return providerId === (user as any)?._id;
      })
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Service> = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        priceType: form.priceType as 'hour' | 'fixed',
        category: form.category,
        serviceableLocations: form.serviceableLocations ? form.serviceableLocations.split(',').map(s => s.trim()) : [],
      };
      const created = await apiCreateService(payload);
      dispatch(addService(created as Service));
      setForm({ title: '', description: '', price: '', priceType: 'hour', category: '', serviceableLocations: '' });
      setShowAdd(false);
    } catch (err) {
      // simple UI-level handling
      notify('error', 'Failed to create service');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm('Delete this service?');
    if (!ok) return;
    try {
      await apiRemoveService(id);
      dispatch(deleteService(id));
    } catch (err) {
      notify('error', 'Failed to delete service');
    }
  };

  if (!user || user.role !== "provider") {
      return (
        <div className="min-h-screen bg-sky-50 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Provider Services</h2>
            <p className="text-gray-600">Only providers can access this page.</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-600">My Services</h2>
          <button onClick={() => setShowAdd(v => !v)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">{showAdd ? 'Cancel' : '+ Add Service'}</button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="mb-6 grid grid-cols-1 gap-3">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border p-2 rounded" />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border p-2 rounded" />
            <div className="flex gap-2">
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="border p-2 rounded flex-1" />
              <select name="priceType" value={form.priceType} onChange={handleChange} className="border p-2 rounded">
                <option value="hour">Hour</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
            <input name="serviceableLocations" value={form.serviceableLocations} onChange={handleChange} placeholder="Locations (comma separated)" className="border p-2 rounded" />
            <div>
              <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">Create Service</button>
            </div>
          </form>
        )}

        {loading && <div>Loading services...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {myServices.length === 0 && <div>No services yet. Add one above.</div>}

        <div className="grid gap-4">
          {myServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((s: any) => (
            <div key={s._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">{s.category}</span>
                  <span className="text-gray-600">Price: <span className="font-medium text-gray-900">{s.price} ({s.priceType})</span></span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {myServices.length > PAGE_SIZE && (
          <div className="mt-6 flex items-center flex-wrap justify-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400">Prev</button>
            {Array.from({ length: Math.ceil(myServices.length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors ${p === currentPage ? 'bg-sky-600 text-white shadow-sm' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(myServices.length / PAGE_SIZE), p + 1))} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
