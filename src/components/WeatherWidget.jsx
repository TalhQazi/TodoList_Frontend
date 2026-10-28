import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Search,
  Sparkles,
  MapPin,
  X,
  PlusCircle,
} from 'lucide-react';
import { getWeather } from '../services/api';

const PRESET_CITIES = [
  'San Francisco',
  'New York',
  'London',
  'Tokyo',
  'Paris',
  'Lahore',
  'Berlin',
  'Dubai',
];

export default function WeatherWidget({ onClose, onAddTaskFromWeather }) {
  const [city, setCity] = useState('San Francisco');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (targetCity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeather(targetCity);
      setWeatherData(data);
    } catch (err) {
      setError('Could not load weather forecast for this location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  };

  const renderWeatherIcon = (iconName) => {
    const props = { className: 'w-10 h-10' };
    switch (iconName) {
      case 'Sun':
        return <Sun {...props} className="w-10 h-10 text-amber-400 animate-spin-slow" />;
      case 'CloudSun':
        return <CloudSun {...props} className="w-10 h-10 text-amber-300" />;
      case 'Cloud':
        return <Cloud {...props} className="w-10 h-10 text-slate-300" />;
      case 'CloudRain':
        return <CloudRain {...props} className="w-10 h-10 text-blue-400" />;
      case 'Snowflake':
        return <Snowflake {...props} className="w-10 h-10 text-sky-200" />;
      case 'CloudLightning':
        return <CloudLightning {...props} className="w-10 h-10 text-purple-400" />;
      default:
        return <CloudSun {...props} className="w-10 h-10 text-amber-400" />;
    }
  };

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Live Weather & Task Planning Assistant
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Public API Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Powered by Open-Meteo Public Meteorological API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
            {PRESET_CITIES.slice(0, 5).map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  city.toLowerCase() === c.toLowerCase()
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Close widget"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search any global city (e.g. Paris, Tokyo, Chicago)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition"
        >
          Check Weather
        </button>
      </form>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Fetching live weather data...</span>
        </div>
      ) : error ? (
        <div className="py-6 text-center text-xs text-rose-400">{error}</div>
      ) : weatherData ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              {renderWeatherIcon(weatherData.current?.icon)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-slate-200">
                  {weatherData.location?.city}
                </span>
                {weatherData.location?.country && (
                  <span>, {weatherData.location.country}</span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  {weatherData.current?.temperature}°C
                </span>
                <span className="text-xs text-slate-400">
                  Feels like {weatherData.current?.feelsLike}°C
                </span>
              </div>
              <span className="inline-block mt-1 text-xs font-medium text-indigo-300">
                {weatherData.current?.condition}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Humidity</p>
                <p className="text-sm font-bold text-white">
                  {weatherData.current?.humidity}%
                </p>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Wind</p>
                <p className="text-sm font-bold text-white">
                  {weatherData.current?.windSpeed} km/h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Task Strategy Recommendation</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {weatherData.recommendation}
              </p>
            </div>

            <button
              onClick={() => {
                if (onAddTaskFromWeather) {
                  onAddTaskFromWeather({
                    title: `Plan activities for ${weatherData.location?.city} (${weatherData.current?.condition})`,
                    description: `Weather advice: ${weatherData.recommendation}. Current temp: ${weatherData.current?.temperature}°C.`,
                    category: 'Personal',
                    priority: 'medium',
                    tags: ['weather-sync', weatherData.location?.city.toLowerCase()],
                  });
                }
              }}
              className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Convert Recommendation to Task</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
