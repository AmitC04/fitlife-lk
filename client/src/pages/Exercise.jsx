import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL, DIFFICULTY_LEVELS } from '../constants';

const Spinner = () => (
  <div className="flex items-center justify-center gap-3 py-16">
    <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    <p className="font-dm text-green-400 animate-pulse">Crafting your workout plan...</p>
  </div>
);

export default function Exercise() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [expandedVideo, setExpandedVideo] = useState(null);

  useEffect(() => { generateWorkout(); }, []);

  const generateWorkout = async (diff = difficulty) => {
    setLoading(true);
    setPlan(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/exercise/generate`, { difficulty: diff });
      setPlan(res.data.workoutPlan);
      toast.success('Workout plan generated! 💪');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate workout plan');
    } finally {
      setLoading(false);
    }
  };

  const diffColors = {
    Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
    Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-dark-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className={`text-sm font-dm font-medium uppercase tracking-widest mb-1 ${dark ? 'text-green-400' : 'text-green-600'}`}>AI Workout Plan</p>
          <h1 className={`font-syne font-bold text-3xl sm:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}>
            Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Exercise Plan</span>
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className={`flex gap-1 p-1 rounded-xl ${dark ? 'bg-dark-700' : 'bg-white border border-gray-200'}`}>
            {DIFFICULTY_LEVELS.map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); generateWorkout(d); }}
                className={`px-4 py-2 rounded-lg text-sm font-dm font-medium transition-all ${
                  difficulty === d
                    ? diffColors[d] + ' border'
                    : dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={() => generateWorkout(difficulty)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-400 text-dark-900 font-syne font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-green-500/20"
          >
            {loading ? <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" /> : '🔄'}
            {loading ? 'Generating...' : 'New Plan'}
          </button>
        </div>

        {loading && <Spinner />}

        {plan && !loading && (
          <div className="space-y-6 animate-slide-up">
            {/* Plan Overview */}
            <div className={`rounded-2xl border p-6 flex flex-wrap gap-4 items-center justify-between ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-dm font-bold border mb-2 ${diffColors[plan.difficulty]}`}>{plan.difficulty}</span>
                <h2 className={`font-syne font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>Today's Workout</h2>
                <p className={`text-sm font-dm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>⏱️ Duration: {plan.totalDuration}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className={`font-syne font-bold text-2xl text-green-400`}>{plan.exercises?.length}</p>
                  <p className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Exercises</p>
                </div>
                <div>
                  <p className={`font-syne font-bold text-2xl text-cyan-400`}>
                    {plan.exercises?.reduce((s, e) => s + (e.calories || 0), 0)}
                  </p>
                  <p className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Est. kcal</p>
                </div>
              </div>
            </div>

            {/* Warmup */}
            {plan.warmup && (
              <div className={`rounded-xl border p-4 ${dark ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-yellow-50 border-yellow-100'}`}>
                <p className={`text-sm font-dm ${dark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  <span className="font-bold">🔥 Warm-up: </span>{plan.warmup}
                </p>
              </div>
            )}

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {plan.exercises?.map((ex, i) => (
                <div key={i} className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${dark ? 'bg-dark-700 border-dark-600 hover:shadow-green-400/5' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                  {/* Video Thumbnail / iframe */}
                  <div className="relative">
                    {expandedVideo === i ? (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${ex.videoId}?autoplay=1`}
                          title={ex.name}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video bg-dark-800 flex items-center justify-center cursor-pointer group relative overflow-hidden"
                        onClick={() => setExpandedVideo(i)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg`}
                          alt={ex.name}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    {expandedVideo === i && (
                      <button
                        onClick={() => setExpandedVideo(null)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/80"
                      >✕</button>
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-xs font-dm font-bold text-green-400 uppercase tracking-widest`}>Exercise {i + 1}</span>
                        <h3 className={`font-syne font-bold text-lg mt-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{ex.name}</h3>
                      </div>
                      <div className={`text-center px-3 py-2 rounded-xl ${dark ? 'bg-dark-600' : 'bg-gray-50'}`}>
                        <p className={`font-syne font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>{ex.sets}</p>
                        <p className={`text-xs font-dm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>sets</p>
                        <p className={`font-syne font-bold text-sm text-cyan-400`}>{ex.reps}</p>
                        <p className={`text-xs font-dm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>reps</p>
                      </div>
                    </div>
                    <p className={`text-sm font-dm mb-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{ex.description}</p>
                    {ex.targetMuscles?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {ex.targetMuscles.map(m => (
                          <span key={m} className={`px-2 py-0.5 rounded-md text-xs font-dm ${dark ? 'bg-dark-600 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{m}</span>
                        ))}
                      </div>
                    )}
                    {ex.modification && (
                      <div className={`p-3 rounded-lg text-xs font-dm ${dark ? 'bg-orange-400/10 text-orange-300' : 'bg-orange-50 text-orange-700'} border ${dark ? 'border-orange-400/20' : 'border-orange-100'}`}>
                        <span className="font-bold">💡 Modification: </span>{ex.modification}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-dm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>~{ex.calories} kcal</span>
                      {expandedVideo !== i && (
                        <button
                          onClick={() => setExpandedVideo(i)}
                          className="text-xs font-dm font-medium text-red-400 hover:underline flex items-center gap-1"
                        >
                          ▶ Watch Tutorial
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            {plan.tips?.length > 0 && (
              <div className={`rounded-2xl border p-6 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-syne font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>💪 Workout Tips</h3>
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

            {/* Cooldown */}
            {plan.cooldown && (
              <div className={`rounded-xl border p-4 ${dark ? 'bg-blue-400/5 border-blue-400/20' : 'bg-blue-50 border-blue-100'}`}>
                <p className={`text-sm font-dm ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <span className="font-bold">🧘 Cool-down: </span>{plan.cooldown}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
