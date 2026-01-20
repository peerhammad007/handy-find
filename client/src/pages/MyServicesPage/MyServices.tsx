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
import Input from '../../components/Ui/Input';

const INITIAL_FORM = { title: '', description: '', price: '', priceType: 'hour', category: '', serviceableLocations: '' };
const PAGE_SIZE = 6;

type ServiceForm = typeof INITIAL_FORM;

const ServiceCard = ({ service, onDelete }: { service: Service; onDelete: (id: string) => void }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
    <div className="flex-1">
      <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
      <div className="flex flex-wrap gap-3 mt-3 text-sm">
        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">{service.category}</span>
        <span className="text-gray-600">Price: <span className="font-medium text-gray-900">{service.price} ({service.priceType})</span></span>
      </div>
    </div>
    <button onClick={() => onDelete(service._id)} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">
      Delete
    </button>
  </div>
);

const AddServiceForm = ({ onSubmit }: { onSubmit: (form: ServiceForm) => void; }) => {
  const [form, setForm] = useState<ServiceForm>(INITIAL_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3">
      <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <div className="flex gap-2">
        <Input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="flex-1" />
        <select name="priceType" value={form.priceType} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300">
          <option value="hour">Hour</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
      <Input name="serviceableLocations" value={form.serviceableLocations} onChange={handleChange} placeholder="Locations (comma separated)" />
      <div className="flex gap-2">
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">Create Service</button>
      </div>
    </form>
  );
};

const Pagination = ({ total, current, onChange }: { total: number; current: number; onChange: (p: number) => void }) => {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center flex-wrap justify-center gap-2">
      <button onClick={() => onChange(Math.max(1, current - 1))} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors">Prev</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${p === current ? 'bg-sky-600 text-white shadow-sm' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'}`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(pages, current + 1))} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors">Next</button>
    </div>
  );
};

const MyServices = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { notify, confirm } = useNotify();
  const { services, loading, error } = useSelector((state: RootState) => state.services);

  const [currentPage, setCurrentPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const myServices = services.filter(s => (s.provider as any)?._id === user?._id);

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

  const handleAdd = async (form: ServiceForm) => {
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
      dispatch(addService(created));
      setShowAdd(false);
      notify('success', 'Service created');
    } catch {
      notify('error', 'Failed to create service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm('Delete this service?'))) return;
    try {
      await apiRemoveService(id);
      dispatch(deleteService(id));
      notify('success', 'Service deleted');
    } catch {
      notify('error', 'Failed to delete service');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-600">My Services</h2>
          <button onClick={() => setShowAdd(v => !v)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors">
            {showAdd ? 'Cancel' : '+ Add Service'}
          </button>
        </div>

        {showAdd && <AddServiceForm onSubmit={handleAdd} />}

        {loading && <div>Loading services...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && myServices.length === 0 && <div>No services yet. Add one above.</div>}

        <div className="grid gap-4">
          {myServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(s => (
            <ServiceCard key={s._id} service={s} onDelete={handleDelete} />
          ))}
        </div>

        <Pagination total={myServices.length} current={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default MyServices;