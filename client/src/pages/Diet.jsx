import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../constants';
import { getMealTime } from '../utils/calculateBMR';

const Spinner = () => (
  <div className="flex items-center justify-center gap-3 py-16">
    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    <p className="font-dm text-cyan-400 animate-pulse">Generating your personalized meal plan...</p>
  </div>
);

export default function Diet() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [mealTime, setMealTime] = useState(getMealTime());

  useEffect(() => {
    const saved = sessionStorage.getItem('fitlife_menu');
    if (saved) {
      const d = JSON.parse(saved);
      if (d.mealTime) setMealTime(d.mealTime);
    }
    generateDiet();
  }, []);

  const generateDietForMeal = async (specificMealTime) => {
    setLoading(true);
    setPlan(null);
    try {
      const saved = sessionStorage.getItem('fitlife_menu');
      const menuData = saved ? JSON.parse(saved) : {};
      const res = await axios.post(`${API_BASE_URL}/diet/generate`, {
        mealTime: specificMealTime,
        menuText: menuData.extractedText || '',
      });
      setPlan(res.data.dietPlan);
      setCalorieGoal(res.data.calorieGoal);
      toast.success('Diet plan generated! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  const generateDiet = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const saved = sessionStorage.getItem('fitlife_menu');
      const menuData = saved ? JSON.parse(saved) : {};

      const res = await axios.post(`${API_BASE_URL}/diet/generate`, {
        mealTime: menuData.mealTime || mealTime,
        menuText: menuData.extractedText || '',
      });
      setPlan(res.data.dietPlan);
      setCalorieGoal(res.data.calorieGoal);
      toast.success('Diet plan generated! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  const mealEmoji = { Breakfast: '☀️', Lunch: '🥘', Snacks: '🍎', Dinner: '🌙' };

  return (
    <div className={`min-h-screen ${dark ? 'bg-dark-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className={`text-sm font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>AI Diet Plan</p>
          <h1 className={`font-syne font-bold text-3xl sm:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}>
            Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Meal Plan</span>
          </h1>
          {calorieGoal && (
            <p className={`mt-2 font-dm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Daily target: <span className="font-bold text-cyan-400">{calorieGoal} kcal</span> • Goal: <span className="font-bold">{user?.goal}</span>
            </p>
          )}
        </div>

        {/* Regenerate Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={generateDiet}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-dark-900 font-syne font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <>🔄 Regenerate Plan</>
            )}
          </button>
          <div className="flex gap-2">
            {['Breakfast','Lunch','Snacks','Dinner'].map(mt => (
              <button
                key={mt}
                onClick={() => {
                  setMealTime(mt);
                  const saved = sessionStorage.getItem('fitlife_menu');
                  const d = saved ? JSON.parse(saved) : {};
                  sessionStorage.setItem('fitlife_menu', JSON.stringify({ ...d, mealTime: mt }));
                  generateDietForMeal(mt);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium transition-all ${
                  mealTime === mt
                    ? 'bg-cyan-400 text-dark-900'
                    : dark ? 'bg-dark-700 text-gray-400 hover:bg-dark-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {mt}
              </button>
            ))}
          </div>
        </div>

        {loading && <Spinner />}

        {plan && !loading && (
          <div className="space-y-6 animate-slide-up">
            {/* Meal Header */}
            <div className={`rounded-2xl border p-6 text-center ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
              <div className="text-5xl mb-2">{mealEmoji[plan.mealTime] || '🍽️'}</div>
              <h2 className={`font-syne font-bold text-2xl ${dark ? 'text-white' : 'text-gray-900'}`}>{plan.mealTime}</h2>
              <p className={`font-syne font-bold text-4xl mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400`}>
                {plan.totalCalories} <span className={`text-xl font-dm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>kcal</span>
              </p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Protein', value: plan.macros?.protein, unit: 'g', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Carbs', value: plan.macros?.carbs, unit: 'g', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'Fats', value: plan.macros?.fats, unit: 'g', color: 'text-orange-400', bg: 'bg-orange-400/10' },
              ].map(m => (
                <div key={m.label} className={`rounded-xl p-4 text-center ${m.bg} border border-transparent`}>
                  <p className={`font-syne font-bold text-2xl ${m.color}`}>{m.value}{m.unit}</p>
                  <p className={`text-xs font-dm font-medium mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Food Items */}
            <div className={`rounded-2xl border ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'} overflow-hidden`}>
              <div className={`px-6 py-4 border-b ${dark ? 'border-dark-600' : 'border-gray-100'}`}>
                <h3 className={`font-syne font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>🍽️ What to Eat</h3>
              </div>
              <div className="p-6 space-y-3">
                {plan.items?.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${dark ? 'bg-dark-800' : 'bg-gray-50'}`}>
                    <div className="flex-1">
                      <p className={`font-dm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                      <p className={`text-sm font-dm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-syne font-bold text-cyan-400">{item.calories} kcal</p>
                      <p className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        P:{item.protein}g C:{item.carbs}g F:{item.fats}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {plan.tips?.length > 0 && (
              <div className={`rounded-2xl border p-6 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-syne font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>💡 Health Tips</h3>
                <ul className="space-y-2">
                  {plan.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <p className={`text-sm font-dm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avoid */}
            {plan.avoid?.length > 0 && (
              <div className={`rounded-2xl border p-6 ${dark ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
                <h3 className={`font-syne font-bold text-lg mb-3 text-red-400`}>🚫 Foods to Avoid</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.avoid.map((f, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-sm font-dm font-medium">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {plan.note && (
              <div className={`rounded-2xl border p-5 ${dark ? 'bg-cyan-400/5 border-cyan-400/20' : 'bg-cyan-50 border-cyan-100'}`}>
                <p className={`text-sm font-dm ${dark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  <span className="font-semibold">📌 Note: </span>{plan.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
