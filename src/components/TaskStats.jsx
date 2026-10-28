import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const inProgress = tasks.filter((t) => !t.completed && t.status === 'in-progress').length;
  const highPriority = tasks.filter(
    (t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      subtext: `${total - completed} active`,
      icon: ListTodo,
      color: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    },
    {
      title: 'In Progress',
      value: inProgress,
      subtext: 'Currently working on',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    },
    {
      title: 'Completed',
      value: completed,
      subtext: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      progress: completionRate,
    },
    {
      title: 'Urgent / High',
      value: highPriority,
      subtext: highPriority > 0 ? 'Requires attention' : 'All clear',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600',
      bgGlow: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-2xl border ${stat.bgGlow} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4">
              {stat.progress !== undefined ? (
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Progress</span>
                    <span className="text-emerald-400 font-semibold">{stat.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  {stat.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
