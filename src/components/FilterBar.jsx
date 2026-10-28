import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  categories = ['Work', 'Personal', 'Development', 'Design', 'General'],
}) {
  const statusTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'priority', label: 'Priority' },
    { id: 'title', label: 'Title (A-Z)' },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search tasks by title, keyword, or description..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              className="appearance-none pl-8 pr-8 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-300 hover:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {priorities.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="appearance-none px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-300 hover:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Categories
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="appearance-none pl-8 pr-8 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-300 hover:text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-1">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange('status', tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
