import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({email, password});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 py-12 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-900">Welcome back</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Sign in to manage your bookings and profile.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button type="submit" disabled={loading} className="w-full bg-sky-600 text-white py-2 rounded-full hover:bg-sky-700 transition-colors disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-sky-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;