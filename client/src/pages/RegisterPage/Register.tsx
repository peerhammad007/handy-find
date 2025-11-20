import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { uploadImage } from '../../api/uploadApi';

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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      setProfilePhoto(url);
    } catch (err) {
      // Optional: surface via toast if available
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-extrabold mb-2 text-center text-gray-900">Create Your Account</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Join HandyFind to book services or list your offerings as a provider.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <select name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300">
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
          <div>
            <label className="text-sm text-gray-700">Profile Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handleFile} className="block mt-1" />
            {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-full mt-2 object-cover" />}
          </div>
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
          {form.role === 'provider' && (
            <>
              <input name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
              {/* Add serviceCategories input as needed */}
            </>
          )}
          <button type="submit" disabled={loading} className="w-full bg-sky-600 text-white py-2 rounded-full hover:bg-sky-700 transition-colors disabled:opacity-60">{loading ? 'Registering...' : 'Register'}</button>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-sky-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;