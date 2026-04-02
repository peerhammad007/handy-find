import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './layouts/Navbar';
import Home from './pages/HomePage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Dashboard from './pages/DashboardPage/Dashboard';
import ServiceListings from './pages/ServiceListingsPage/ServiceListings';
import HowItWorks from './shared/components/Info/HowItWorks';
import ContactUs from './shared/components/Info/ContactUs';
import Booking from './pages/BookingPage/Booking';
import Profile from './pages/ProfilePage/Profile';
import Reviews from './pages/ReviewsPage/Reviews';
import Footer from './layouts/Footer';
import PrivateRoute from './features/auth/components/PrivateRoute';
import MyServices from './pages/MyServicesPage/MyServices';
import ServicesInfo from './shared/components/Info/ServicesInfo';
import RoleRoute from './features/auth/components/RoleRoute';

const ErrorPage = () => <div>404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services-info' element={<ServicesInfo />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* User-only routes */}
          <Route element={<RoleRoute allowedRoles={['user']} />}>
            <Route path='/services' element={<ServiceListings />} />
          </Route>

          {/* Authenticated routes (any role) */}
          <Route element={<PrivateRoute />}>
            <Route path='/booking' element={<Booking />} />
            <Route path='/profile' element={<Profile />} />
          </Route>

          {/* Provider-only routes */}
          <Route element={<RoleRoute allowedRoles={['provider']} />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/my-services' element={<MyServices />} />
            <Route path='/reviews' element={<Reviews />} />
          </Route>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
