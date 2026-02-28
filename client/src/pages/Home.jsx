import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { calculateBMR, calculateBMI, getBMICategory, calculateTDEE, calculateDailyCalories } from '../utils/calculateBMR';
import { BMICard, BMRCard, TDEECard } from '../components/MetricCard';
import MenuUpload from '../components/MenuUpload';

export default function Home({ onLoginClick }) {
  const { user } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState({ mealTime: 'Breakfast', extractedText: '' });

  const handleMenuReady = useCallback((data) => {
    setMenuData(data);
    sessionStorage.setItem('fitlife_menu', JSON.stringify(data));
  }, []);

  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
        {/* Animated background blob */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white font-syne font-bold text-3xl shadow-2xl shadow-cyan-400/20">
            F
          </div>
          <h1 className={`font-syne font-bold text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">FitLife</span>
          </h1>
          <p className={`text-xl font-dm max-w-md mx-auto mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your AI-powered personal health and fitness companion. Personalized diet plans and workouts tailored just for you.
          </p>
          <button
            onClick={onLoginClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-dark-900 font-syne font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/30 hover:scale-105"
          >
            Get Started — It's Free →
          </button>
          <div className="flex items-center justify-center gap-8 mt-12">
            {['AI-Powered Plans', 'Personalized to You', 'Track Your Goals'].map((f, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{['🤖','🎯','📈'][i]}</div>
                <p className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const bmr = calculateBMR(user);
  const bmi = calculateBMI(user);
  const bmiCategory = getBMICategory(bmi);
  const tdee = calculateTDEE(bmr, user.activityFactor);
  const calorieGoal = calculateDailyCalories(tdee, user.goal);

  return (
    <div className={`min-h-screen ${dark ? 'bg-dark-900' : 'bg-gray-50'} pt-20`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <p className={`text-sm font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>Dashboard</p>
          <h1 className={`font-syne font-bold text-3xl sm:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className={`mt-1 font-dm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's your fitness overview for today.
          </p>
        </div>

        {/* Daily Calorie Goal — HERO */}
        <div className={`mb-8 rounded-2xl p-8 text-center border animate-slide-up ${dark ? 'bg-gradient-to-br from-dark-700 to-dark-800 border-dark-600' : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-100'}`}>
          <p className={`text-sm font-dm font-medium uppercase tracking-widest mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Your Daily Calorie Goal</p>
          <p className={`font-syne font-bold text-6xl sm:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400`}>
            {calorieGoal.toLocaleString()}
          </p>
          <p className={`font-syne text-2xl font-semibold mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>kcal / day</p>
          <p className={`text-sm font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Goal: <span className="font-semibold text-cyan-400">{user.goal}</span>
            {user.goal === 'Weight Loss' && ' — 500 kcal deficit applied'}
            {user.goal === 'Weight Gain' && ' — 500 kcal surplus applied'}
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BMICard bmi={bmi} category={bmiCategory} />
          <BMRCard bmr={bmr} />
          <TDEECard tdee={tdee} calorieGoal={calorieGoal} goal={user.goal} />
        </div>

        {/* User Summary */}
        <div className={`mb-8 rounded-2xl border p-6 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-syne font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Your Profile Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Age', value: `${user.age} yrs` },
              { label: 'Weight', value: `${user.weightKg} kg` },
              { label: 'Height', value: `${user.heightCm} cm` },
              { label: 'Sex', value: user.sex },
            ].map(({ label, value }) => (
              <div key={label} className={`p-3 rounded-xl text-center ${dark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                <p className={`text-xs font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
                <p className={`font-syne font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
              </div>
            ))}
          </div>
          {(user.conditions?.length > 0 || user.bodyPain) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.conditions?.filter(c => c !== 'None').map(c => (
                <span key={c} className="px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-dm font-medium">{c}</span>
              ))}
              {user.bodyPain && user.bodyPain !== 'None' && (
                <span className="px-2 py-1 rounded-lg bg-orange-400/10 text-orange-400 text-xs font-dm font-medium">⚠️ {user.bodyPain}</span>
              )}
            </div>
          )}
        </div>

        {/* Menu Upload */}
        <div className="mb-8">
          <MenuUpload onMenuReady={handleMenuReady} />
        </div>

        {/* CTA Button */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              sessionStorage.setItem('fitlife_menu', JSON.stringify(menuData));
              navigate('/diet');
            }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-green-400 text-dark-900 font-syne font-bold text-xl hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-100"
          >
            🥗 Show Me My Diet For Today
          </button>
          <p className={`text-sm font-dm mt-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            AI-powered personalized meal recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
