import React from 'react';
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function BMICard({ bmi, category }) {
  const { dark } = useTheme();
  const pct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);

  return (
    <div className={`rounded-2xl p-6 border transition-all ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'} hover:shadow-xl hover:shadow-cyan-400/5 animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-dm font-medium uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-gray-500'}`}>BMI</p>
          <p className={`text-3xl font-syne font-bold mt-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{bmi}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-dm font-semibold" style={{ backgroundColor: category.color + '20', color: category.color }}>
          {category.label}
        </span>
      </div>
      <div className={`w-full h-3 rounded-full ${dark ? 'bg-dark-600' : 'bg-gray-100'} overflow-hidden`}>
        <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 relative">
          <div className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg transition-all" style={{ left: `${pct}%` }} />
        </div>
      </div>
      <div className={`flex justify-between text-xs font-dm mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
      </div>
    </div>
  );
}

export function BMRCard({ bmr }) {
  const { dark } = useTheme();
  const chartData = {
    labels: ['Base Metabolism'],
    datasets: [{
      label: 'BMR (kcal)',
      data: [bmr],
      backgroundColor: ['rgba(34,211,238,0.6)'],
      borderColor: ['rgb(34,211,238)'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.raw} kcal` } } },
    scales: {
      y: { max: bmr * 1.5, grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: dark ? '#9ca3af' : '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: dark ? '#9ca3af' : '#6b7280' } },
    },
  };

  return (
    <div className={`rounded-2xl p-6 border transition-all ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'} hover:shadow-xl hover:shadow-cyan-400/5 animate-fade-in`}>
      <p className={`text-xs font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>BMR</p>
      <p className={`text-3xl font-syne font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{bmr.toLocaleString()} <span className="text-lg font-dm font-normal text-gray-400">kcal/day</span></p>
      <p className={`text-xs font-dm mt-1 mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Calories at complete rest</p>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function TDEECard({ tdee, calorieGoal, goal }) {
  const { dark } = useTheme();
  const adjustment = calorieGoal - tdee;
  const chartData = {
    datasets: [{
      data: [calorieGoal, Math.max(tdee * 2 - calorieGoal, 100)],
      backgroundColor: ['rgba(74,222,128,0.8)', dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'],
      borderColor: ['rgb(74,222,128)', 'transparent'],
      borderWidth: [2, 0],
    }],
  };
  const options = {
    cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div className={`rounded-2xl p-6 border transition-all ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'} hover:shadow-xl hover:shadow-cyan-400/5 animate-fade-in`}>
      <p className={`text-xs font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>TDEE</p>
      <p className={`text-3xl font-syne font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{tdee.toLocaleString()} <span className="text-lg font-dm font-normal text-gray-400">kcal/day</span></p>
      <p className={`text-xs font-dm mt-1 mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Total Daily Energy Expenditure</p>
      <div className="relative flex items-center justify-center h-28">
        <Doughnut data={chartData} options={options} />
        <div className="absolute text-center">
          <p className="text-xs font-dm text-gray-400">Goal</p>
          <p className={`text-sm font-syne font-bold ${adjustment > 0 ? 'text-green-400' : adjustment < 0 ? 'text-red-400' : 'text-cyan-400'}`}>
            {adjustment > 0 ? '+' : ''}{adjustment}
          </p>
        </div>
      </div>
      <p className={`text-center text-xs font-dm mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{goal}</p>
    </div>
  );
}
