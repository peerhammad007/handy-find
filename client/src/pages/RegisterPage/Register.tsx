import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Register: React.FC = () => {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    location: '',
    serviceCategories: [],
    bio: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ ...form, profilePhoto });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfilePhoto(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <select name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
          <div>
            <label className="text-sm">Profile Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handleFile} className="block mt-1" />
            {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-full mt-2 object-cover" />}
          </div>
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {form.role === 'provider' && (
            <>
              <input name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {/* Add serviceCategories input as needed */}
            </>
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60">{loading ? 'Registering...' : 'Register'}</button>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Register;