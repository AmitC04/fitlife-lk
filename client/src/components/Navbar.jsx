import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { APP_NAME } from '../constants';

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/diet', label: 'Diet' },
    { to: '/exercise', label: 'Exercise' },
    { to: '/about', label: 'About Us' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${dark ? 'bg-dark-800/90 border-dark-700' : 'bg-white/90 border-gray-200'} backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white font-syne font-bold text-sm">
              F
            </div>
            <span className={`font-syne font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-dm text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : dark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-all duration-200 ${dark ? 'text-yellow-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${dark ? 'bg-dark-700 text-gray-200' : 'bg-gray-100 text-gray-700'} text-sm font-dm`}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-sm font-dm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-sm font-dm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
              >
                Login / Register
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden pb-4 pt-2 border-t ${dark ? 'border-dark-700' : 'border-gray-200'}`}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-dm text-sm font-medium my-0.5 transition-all ${
                  isActive(link.to)
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : dark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
