import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Placeholder stats; replace with real data from API if available
  const stats = [
    { label: "My Services", value: 3, link: "/my-services" },
    { label: "Total Bookings", value: 12, link: "/booking" },
    { label: "Avg. Rating", value: "4.8", link: "/reviews" },
  ];

  if (!user || user.role !== "provider") {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">Provider Dashboard</h2>
        <p className="text-gray-600">Only providers can access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Welcome, {user.name}!
      </h2>
      <p className="mb-8 text-gray-600">
        Manage your services, bookings, and see your performance at a glance.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.label}
            className="bg-gray-50 hover:bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow transition"
          >
            <span className="text-3xl font-bold text-blue-600 mb-2">
              {stat.value}
            </span>
            <span className="text-gray-700">{stat.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/my-services/add"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-center hover:bg-blue-700 transition"
        >
          + Add New Service
        </Link>
        <Link
          to="/my-services"
          className="bg-gray-100 text-blue-600 px-6 py-3 rounded-md text-center hover:bg-blue-100 transition"
        >
          View My Services
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;