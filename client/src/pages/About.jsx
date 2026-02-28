import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { APP_NAME } from '../constants';

const tech = [
  { name: 'React.js', icon: '⚛️', desc: 'Frontend SPA with React Router' },
  { name: 'Node.js + Express', icon: '🟢', desc: 'Backend REST API server' },
  { name: 'MySQL + Sequelize', icon: '🗄️', desc: 'Relational database with ORM' },
  { name: 'Google Gemini AI', icon: '🤖', desc: 'AI-powered meal & workout generation' },
  { name: 'Tailwind CSS', icon: '🎨', desc: 'Utility-first responsive styling' },
  { name: 'JWT Auth', icon: '🔐', desc: 'Secure token-based authentication' },
  { name: 'Tesseract.js', icon: '👁️', desc: 'OCR for menu image extraction' },
  { name: 'Chart.js', icon: '📊', desc: 'BMI, BMR & TDEE visualizations' },
];

export default function About() {
  const { dark } = useTheme();
  return (
    <div className={`min-h-screen ${dark ? 'bg-dark-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white font-syne font-bold text-4xl shadow-2xl shadow-cyan-400/20">
            F
          </div>
          <h1 className={`font-syne font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">{APP_NAME}</span>
          </h1>
          <p className={`text-lg font-dm max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            FitLife is an AI-powered health and fitness web app that creates personalized diet plans and workout routines tailored to your unique body, goals, and medical conditions.
          </p>
        </div>

        {/* What we do */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🧬', title: 'Personalized Health', desc: 'We calculate your BMI, BMR, and TDEE using medically accurate formulas to give you a precise daily calorie target.' },
            { icon: '🤖', title: 'AI-Powered Plans', desc: 'Google Gemini AI generates meal plans and workout routines specific to your age, sex, goal, and medical conditions.' },
            { icon: '📋', title: 'Menu Integration', desc: 'Upload your hostel or mess menu and our AI will suggest the healthiest options from it.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className={`rounded-2xl border p-6 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className={`font-syne font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`text-sm font-dm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className={`font-syne font-bold text-2xl mb-6 text-center ${dark ? 'text-white' : 'text-gray-900'}`}>Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tech.map(({ name, icon, desc }) => (
              <div key={name} className={`rounded-xl border p-4 text-center transition-all hover:border-cyan-400/50 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className={`font-syne font-bold text-sm mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
                <p className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulas */}
        <div className={`rounded-2xl border p-8 mb-16 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-syne font-bold text-2xl mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>Formulas Used</h2>
          <div className="space-y-4">
            {[
              { name: 'BMR (Male)', formula: '10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5', color: 'text-blue-400' },
              { name: 'BMR (Female)', formula: '10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161', color: 'text-pink-400' },
              { name: 'BMI', formula: 'weight(kg) ÷ height(m)²', color: 'text-yellow-400' },
              { name: 'TDEE', formula: 'BMR × Activity Factor', color: 'text-green-400' },
              { name: 'Calorie Goal', formula: 'TDEE ± 500 (based on goal)', color: 'text-cyan-400' },
            ].map(({ name, formula, color }) => (
              <div key={name} className="flex items-start gap-3">
                <span className={`font-syne font-bold text-sm min-w-28 ${color}`}>{name}</span>
                <span className={`text-sm font-dm font-mono ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{formula}</span>
              </div>
            ))}
          </div>
          <p className={`text-xs font-dm mt-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            * Mifflin-St Jeor formula (1990) — the most accurate BMR predictor for the general population.
          </p>
        </div>

        {/* Developer */}
        <div className={`rounded-2xl border p-8 text-center ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-syne font-bold text-2xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Developer</h2>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white font-syne font-bold text-2xl">
            D
          </div>
          <p className={`font-syne font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>Developer Name</p>
          <p className={`text-sm font-dm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Full Stack Developer</p>
          <p className={`text-sm font-dm mt-4 max-w-md mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Built with ❤️ as a project to help students and working professionals maintain their health and fitness with AI assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
