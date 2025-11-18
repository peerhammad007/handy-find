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

    if (!profile) {
        return (
            <div className="min-h-screen bg-sky-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>

                {!editing ? (
                    <>
                        <div className="grid sm:grid-cols-3 gap-4 items-start">
                            <div className="sm:col-span-1 bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                                <img src={profile.profilePhoto || '/default-avatar.png'} alt="avatar" className="w-28 h-28 rounded-full object-cover mb-3" />
                                <div className="text-center">
                                    <div className="font-semibold text-lg">{profile.name}</div>
                                    <div className="text-sm text-gray-600">{profile.role}</div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                                <div className="grid grid-cols-1 gap-2">
                                    <div><span className="font-medium">Email:</span> <span className="text-gray-700">{profile.email}</span></div>
                                    <div><span className="font-medium">Phone:</span> <span className="text-gray-700">{profile.phone}</span></div>
                                    <div><span className="font-medium">Location:</span> <span className="text-gray-700">{profile.location}</span></div>
                                    <div><span className="font-medium">Bio:</span> <span className="text-gray-700">{profile.bio}</span></div>
                                </div>

                                <div className="mt-4 flex gap-2 justify-end">
                                    <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Edit</button>
                                    <button onClick={() => signOut()} className="bg-gray-300 px-4 py-2 rounded-md">Logout</button>
                                    {profile.role === 'provider' && <Link to="/my-services" className="bg-green-600 text-white px-4 py-2 rounded-md">My Services</Link>}
                                </div>
                            </div>
                        </div>
                    </>
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
        </div>
    );
}

export default Profile;