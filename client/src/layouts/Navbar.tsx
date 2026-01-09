import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { user, token, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  const publicLinks = [
    { to: "/services-info", label: "Services" },
    { to: "/how-it-works", label: "How it Works" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  const userLinks = [
    { to: "/booking", label: "Bookings" },
    { to: "/profile", label: "Profile" },
  ];

  const providerLinks = [
    { to: "/reviews", label: "Reviews" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/my-services", label: "My Services" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 text-sky-600 font-bold text-xl"
          >
            <span className="inline-block w-8 h-8 bg-sky-600 rounded-full text-white flex items-center justify-center font-bold">
              HF
            </span>
            <span className="ml-1">HandyFind</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            {!token ? (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/register"
                  className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user?.role === "user" && (
                  <Link
                    to="/services"
                    className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition"
                  >
                    Services
                  </Link>
                )}
                {userLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition"
                  >
                    {link.label}
                  </Link>
                ))}
                {user?.role === "provider" &&
                  providerLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                <button
                  onClick={signOut}
                  className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle navigation"
            onClick={toggle}
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden bg-white border-t border-slate-100 shadow-sm">
          <div className="px-4 py-4 space-y-1">
            {!token ? (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={close}
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/register"
                  onClick={close}
                  className="block mt-2 bg-sky-600 text-white px-4 py-2 rounded-full text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user?.role === "user" && (
                  <Link
                    to="/services"
                    onClick={close}
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50"
                  >
                    Services
                  </Link>
                )}
                {userLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={close}
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50"
                  >
                    {link.label}
                  </Link>
                ))}
                {user?.role === "provider" &&
                  providerLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={close}
                      className="block px-3 py-2 rounded text-gray-700 hover:bg-sky-50"
                    >
                      {link.label}
                    </Link>
                  ))}
                <button
                  onClick={() => {
                    signOut();
                    close();
                  }}
                  className="w-full mt-2 bg-sky-600 text-white px-4 py-2 rounded-full"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;