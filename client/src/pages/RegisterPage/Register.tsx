import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuth from '../../hooks/useAuth';
import { useNotify } from '../../components/Toast/ToastProvider';
import { uploadImage } from '../../api/uploadApi';
import Input from '../../components/Ui/Input'; // Import your new component

// --- 1. Zod Schema (Validation Rules) ---
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'provider'], { required_error: 'Please select a role' }),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  // --- 2. Hooks & State ---
  const { register: authRegister, loading, error } = useAuth();
  const { notify } = useNotify();
  const [preview, setPreview] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // --- 3. React Hook Form Setup ---
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' } // Only set defaults that differ from "undefined"
  });

  const role = watch('role'); // Real-time value subscription

  // --- 4. Handlers ---
  const onSubmit = (data: RegisterFormData) => {
    authRegister({ ...data, serviceCategories: [], profilePhoto });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPreview(URL.createObjectURL(file)); // Immediate UI feedback
    try {
      const url = await uploadImage(file); // Async upload
      setProfilePhoto(url);
    } catch (err) {
      notify('error', 'Failed to upload image');
    }
  };

  // --- 5. Render ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-extrabold mb-2 text-center text-gray-900">Create Account</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Join HandyFind today.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Input 
            {...register('name')} 
            placeholder="Full Name" 
            error={errors.name?.message} 
          />
          
          <Input 
            {...register('email')} 
            type="email" 
            placeholder="Email Address" 
            error={errors.email?.message} 
          />
          
          <Input 
            {...register('phone')} 
            placeholder="Phone Number" 
            error={errors.phone?.message} 
          />
          
          <Input 
            {...register('password')} 
            type="password" 
            placeholder="Password" 
            error={errors.password?.message} 
          />

          {/* Native Select */}
          <select
            {...register('role')}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>

          {/* File Upload Section */}
          <div>
            <label className="text-sm text-gray-700">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFile} className="block mt-1 text-sm" />
            {preview && <img src={preview} alt="preview" className="w-16 h-16 rounded-full mt-2 object-cover" />}
          </div>

          <Input 
            {...register('location')} 
            placeholder="Location (Optional)" 
            error={errors.location?.message} 
          />

          {/* Conditional Rendering based on Role */}
          {role === 'provider' && (
            <Input 
              {...register('bio')} 
              placeholder="Tell us about your services..." 
              error={errors.bio?.message} 
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-full hover:bg-sky-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
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