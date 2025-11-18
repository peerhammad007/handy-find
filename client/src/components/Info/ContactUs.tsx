import React from 'react';

type Props = {
  email?: string;
  phone?: string;
  address?: string;
};

const ContactUs: React.FC<Props> = ({ email = 'hello@handyfind.example', phone = '+1 (555) 123-4567', address = '123 Main St, Anytown' }) => {
  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">Have a question or need help? Reach out and we'll get back to you shortly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-medium">Email</h4>
            <p className="text-sm text-sky-600 mt-1">{email}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-medium">Phone</h4>
            <p className="text-sm text-sky-600 mt-1">{phone}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-medium">Address</h4>
            <p className="text-sm text-gray-600 mt-1">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
