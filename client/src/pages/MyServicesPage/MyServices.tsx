import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useAuth from '../../hooks/useAuth';
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
  const services = useSelector((state: RootState) => state.services.services);
  const loading = useSelector((state: RootState) => state.services.loading);
  const error = useSelector((state: RootState) => state.services.error);

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
        dispatch(fetchServicesSuccess(all));
      } catch (err: any) {
        dispatch(fetchServicesFailure(err.message || 'Failed to load services'));
      }
    };
    load();
  }, [dispatch]);

  const myServices = user
    ? services.filter(s => {
        const providerId = typeof s.provider === 'string' ? s.provider : (s.provider as any)?._id;
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
      // Ensure created service has provider populated so it shows immediately in the filtered list.
      const createdWithProvider = {
        ...created,
        provider: created.provider ? created.provider : (user as any),
      } as Service;
      dispatch(addService(createdWithProvider));
      setForm({ title: '', description: '', price: '', priceType: 'hour', category: '', serviceableLocations: '' });
      setShowAdd(false);
    } catch (err) {
      // simple UI-level handling
      alert('Failed to create service');
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this service?')) return;
    try {
      await apiRemoveService(id);
      dispatch(deleteService(id));
    } catch (err) {
      alert('Failed to delete service');
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">My Services</h2>
          <button onClick={() => setShowAdd(v => !v)} className="bg-blue-600 text-white px-4 py-2 rounded">{showAdd ? 'Cancel' : '+ Add Service'}</button>
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
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
            </div>
          </form>
        )}

        {loading && <div>Loading services...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {myServices.length === 0 && <div>No services yet. Add one above.</div>}

        <div className="grid gap-4">
          {myServices.map((s: any) => (
            <div key={s._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">{s.category}</span>
                  <span className="text-gray-600">Price: <span className="font-medium text-gray-900">{s.price} ({s.priceType})</span></span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyServices;
