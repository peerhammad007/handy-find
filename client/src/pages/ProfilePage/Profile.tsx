import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../api/userApi';
import { Link } from 'react-router-dom';

function Profile() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', location: '', bio: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const p = await getProfile();
                setProfile(p);
                setForm({ name: p.name || '', phone: p.phone || '', location: p.location || '', bio: p.bio || '' });
            } catch (err) {
                // ignore
            }
        };
        load();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            const updated = await updateProfile(form);
            setProfile(updated);
            setEditing(false);
            alert('Profile updated');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    if (!profile) return <div className="max-w-4xl mx-auto mt-12 p-6">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            {!editing ? (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Location:</strong> {profile.location}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                    <div className="mt-4 flex gap-2">
                        <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => signOut()} className="bg-gray-300 px-3 py-1 rounded">Logout</button>
                        {profile.role === 'provider' && <Link to="/my-services" className="bg-green-600 text-white px-3 py-1 rounded">My Services</Link>}
                    </div>
                </div>
            ) : (
                <div className="grid gap-2">
                    <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
                    <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
                    <input name="location" value={form.location} onChange={handleChange} className="border p-2 rounded" />
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="border p-2 rounded" />
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                        <button onClick={() => setEditing(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Profile;