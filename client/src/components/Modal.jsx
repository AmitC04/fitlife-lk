import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL, GOALS, CONDITIONS, BODY_PARTS } from '../constants';

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InputField = ({ label, dark, children }) => (
  <div>
    <label className={`block text-sm font-dm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
    {children}
  </div>
);

const inputClass = (dark) =>
  `w-full px-3 py-2.5 rounded-xl border text-sm font-dm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
    dark
      ? 'bg-dark-700 border-dark-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
  }`;

export default function Modal({ onClose }) {
  const { login } = useAuth();
  const { dark } = useTheme();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    name: '', email: '', password: '', age: '', sex: 'Male',
    weightKg: '', heightCm: '',
    conditions: [], bodyPain: '', strengthenParts: [], goal: 'Weight Loss',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const required = ['name', 'email', 'password', 'age', 'sex', 'weightKg', 'heightCm', 'goal'];
    for (const f of required) {
      if (!regData[f]) { toast.error(`Please fill in ${f}`); return; }
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, regData);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to FitLife, ${res.data.user.name}! 🎉`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (field, value) => {
    setRegData(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up ${dark ? 'bg-dark-800 border border-dark-600' : 'bg-white border border-gray-200'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b border-opacity-20">
          <div className={`text-xl font-syne font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {tab === 'login' ? 'Welcome Back 👋' : 'Create Account 🏋️'}
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <XIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex mx-6 mt-4 mb-6 gap-1 p-1 rounded-xl ${dark ? 'bg-dark-700' : 'bg-gray-100'}`}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold capitalize transition-all ${
                tab === t
                  ? 'bg-cyan-400 text-dark-900 shadow-lg shadow-cyan-400/20'
                  : dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField label="Email" dark={dark}>
                <input type="email" required placeholder="you@example.com" value={loginData.email}
                  onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <InputField label="Password" dark={dark}>
                <input type="password" required placeholder="••••••••" value={loginData.password}
                  onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-dark-900 font-syne font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-cyan-500/20">
                {loading ? 'Logging in...' : 'Login →'}
              </button>
              <p className={`text-center text-sm font-dm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                No account?{' '}
                <button type="button" onClick={() => setTab('register')} className="text-cyan-400 hover:underline">Register here</button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <InputField label="Full Name" dark={dark}>
                <input type="text" required placeholder="John Doe" value={regData.name}
                  onChange={e => setRegData(p => ({ ...p, name: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <InputField label="Email" dark={dark}>
                <input type="email" required placeholder="you@example.com" value={regData.email}
                  onChange={e => setRegData(p => ({ ...p, email: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <InputField label="Password" dark={dark}>
                <input type="password" required placeholder="Min 6 characters" value={regData.password}
                  onChange={e => setRegData(p => ({ ...p, password: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <div className="grid grid-cols-3 gap-3">
                <InputField label="Age" dark={dark}>
                  <input type="number" required min="10" max="100" placeholder="25" value={regData.age}
                    onChange={e => setRegData(p => ({ ...p, age: e.target.value }))}
                    className={inputClass(dark)} />
                </InputField>
                <InputField label="Weight (kg)" dark={dark}>
                  <input type="number" required min="20" max="300" placeholder="70" value={regData.weightKg}
                    onChange={e => setRegData(p => ({ ...p, weightKg: e.target.value }))}
                    className={inputClass(dark)} />
                </InputField>
                <InputField label="Height (cm)" dark={dark}>
                  <input type="number" required min="100" max="250" placeholder="175" value={regData.heightCm}
                    onChange={e => setRegData(p => ({ ...p, heightCm: e.target.value }))}
                    className={inputClass(dark)} />
                </InputField>
              </div>
              <InputField label="Sex" dark={dark}>
                <select value={regData.sex} onChange={e => setRegData(p => ({ ...p, sex: e.target.value }))} className={inputClass(dark)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </InputField>
              <InputField label="Goal" dark={dark}>
                <select value={regData.goal} onChange={e => setRegData(p => ({ ...p, goal: e.target.value }))} className={inputClass(dark)}>
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </InputField>
              <InputField label="Medical Conditions (select all that apply)" dark={dark}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CONDITIONS.map(c => (
                    <button key={c} type="button"
                      onClick={() => toggleCheckbox('conditions', c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium border transition-all ${
                        regData.conditions.includes(c)
                          ? 'bg-cyan-400 text-dark-900 border-cyan-400'
                          : dark ? 'border-dark-600 text-gray-400 hover:border-cyan-400/50' : 'border-gray-200 text-gray-600 hover:border-cyan-400/50'
                      }`}
                    >{c}</button>
                  ))}
                </div>
              </InputField>
              <InputField label="Physical Pain / Limitations" dark={dark}>
                <input type="text" placeholder="e.g. knee pain, lower back pain, none" value={regData.bodyPain}
                  onChange={e => setRegData(p => ({ ...p, bodyPain: e.target.value }))}
                  className={inputClass(dark)} />
              </InputField>
              <InputField label="Body Parts to Strengthen" dark={dark}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {BODY_PARTS.map(b => (
                    <button key={b} type="button"
                      onClick={() => toggleCheckbox('strengthenParts', b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium border transition-all ${
                        regData.strengthenParts.includes(b)
                          ? 'bg-green-400 text-dark-900 border-green-400'
                          : dark ? 'border-dark-600 text-gray-400 hover:border-green-400/50' : 'border-gray-200 text-gray-600 hover:border-green-400/50'
                      }`}
                    >{b}</button>
                  ))}
                </div>
              </InputField>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-dark-900 font-syne font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-cyan-500/20">
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
