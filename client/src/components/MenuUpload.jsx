import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../constants';
import { getMealTime } from '../utils/calculateBMR';

const MEAL_TIMES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export default function MenuUpload({ onMenuReady }) {
  const { dark } = useTheme();
  const { updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [mealTime, setMealTime] = useState(getMealTime());
  const [extractedText, setExtractedText] = useState('');
  const [extracting, setExtracting] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setUploaded(false);
    setExtractedText('');

    // OCR for images
    if (f.type.startsWith('image/')) {
      setExtracting(true);
      try {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(f);
        await worker.terminate();
        setExtractedText(text);
        toast.success('Text extracted from image!');
      } catch (err) {
        toast.error('OCR failed, will proceed without text extraction');
      } finally {
        setExtracting(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('menu', file);
      const res = await axios.post(`${API_BASE_URL}/upload/menu`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ uploadedMenuPath: res.data.path });
      setUploaded(true);
      toast.success('Menu uploaded! ✅');
      onMenuReady({ mealTime, extractedText, filename: res.data.filename });
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-6 ${dark ? 'bg-dark-700 border-dark-600' : 'bg-white border-gray-200'}`}>
      <h3 className={`font-syne font-bold text-xl mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
        📋 Upload Your Mess / Hostel Menu
      </h3>
      <p className={`text-sm font-dm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Upload your canteen menu so our AI can suggest the best items for your goal.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Upload */}
        <div className="flex-1">
          <label className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            file
              ? dark ? 'border-cyan-400 bg-cyan-400/5' : 'border-cyan-400 bg-cyan-50'
              : dark ? 'border-dark-600 hover:border-cyan-400/50 bg-dark-800/50' : 'border-gray-200 hover:border-cyan-400/50 bg-gray-50'
          }`}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            {file ? (
              <div className="text-center">
                <div className="text-3xl mb-1">{file.type === 'application/pdf' ? '📄' : '🖼️'}</div>
                <p className={`text-sm font-dm font-medium ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>{file.name}</p>
                <p className={`text-xs font-dm mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-3xl mb-2">📤</div>
                <p className={`text-sm font-dm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload PDF or Image</p>
                <p className={`text-xs font-dm mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>JPG, PNG, PDF up to 10MB</p>
              </div>
            )}
          </label>

          {extracting && (
            <div className="mt-3 flex items-center gap-2 text-sm font-dm text-cyan-400">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              Extracting text from image...
            </div>
          )}

          {extractedText && (
            <div className={`mt-3 p-3 rounded-lg text-xs font-dm ${dark ? 'bg-dark-800 text-gray-400' : 'bg-gray-50 text-gray-600'} max-h-20 overflow-y-auto`}>
              <p className="font-semibold mb-1 text-green-400">Extracted text preview:</p>
              {extractedText.slice(0, 150)}...
            </div>
          )}

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading || uploaded}
              className={`mt-3 w-full py-2.5 rounded-xl font-dm font-semibold text-sm transition-all ${
                uploaded
                  ? 'bg-green-400/20 text-green-400 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-dark-900 hover:opacity-90 shadow-lg shadow-cyan-500/20'
              } disabled:opacity-70`}
            >
              {uploading ? 'Uploading...' : uploaded ? '✅ Uploaded!' : 'Upload Menu'}
            </button>
          )}
        </div>

        {/* Right: Date & Meal Time */}
        <div className="flex-1">
          <div className={`text-sm font-dm mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span>📅</span>
              <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{dateStr}</span>
            </div>
          </div>
          <p className={`text-xs font-dm mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Select meal time:</p>
          <div className="flex flex-wrap gap-2">
            {MEAL_TIMES.map(mt => (
              <button
                key={mt}
                onClick={() => { setMealTime(mt); onMenuReady({ mealTime: mt, extractedText }); }}
                className={`px-4 py-2 rounded-xl text-sm font-dm font-medium transition-all ${
                  mealTime === mt
                    ? 'bg-cyan-400 text-dark-900 shadow-lg shadow-cyan-400/20'
                    : dark ? 'bg-dark-600 text-gray-400 hover:bg-dark-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mt === 'Breakfast' ? '☀️' : mt === 'Lunch' ? '🥘' : mt === 'Snacks' ? '🍎' : '🌙'} {mt}
              </button>
            ))}
          </div>
          <p className={`text-xs font-dm mt-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Auto-detected: <span className="text-cyan-400">{getMealTime()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
