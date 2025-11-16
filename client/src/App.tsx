import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './layouts/Navbar';
import Home from './pages/HomePage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Dashboard from './pages/DashboardPage/Dashboard';
import ServiceListings from './pages/ServiceListingsPage/ServiceListings';
import Booking from './pages/BookingPage/Booking';
import Profile from './pages/ProfilePage/Profile';
import Reviews from './pages/ReviewsPage/Reviews';
import Footer from './layouts/Footer';

const ErrorPage = () => <div>404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{minHeight: "80vh"}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/services' element={<ServiceListings />}/>
          <Route path='/booking' element={<Booking />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/reviews' element={<Reviews />}/>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
