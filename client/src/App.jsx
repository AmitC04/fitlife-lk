import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Home from './pages/Home';
import Diet from './pages/Diet';
import Exercise from './pages/Exercise';
import About from './pages/About';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`${dark ? 'dark bg-dark-900' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: dark ? '#1e293b' : '#fff',
            color: dark ? '#e2e8f0' : '#1e293b',
            border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: 'white' } },
          error: { iconTheme: { primary: '#f87171', secondary: 'white' } },
        }}
      />
      <Navbar onLoginClick={() => setShowModal(true)} />
      {showModal && !user && <Modal onClose={() => setShowModal(false)} />}

      <Routes>
        <Route path="/" element={<Home onLoginClick={() => setShowModal(true)} />} />
        <Route path="/diet" element={<ProtectedRoute><Diet /></ProtectedRoute>} />
        <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
