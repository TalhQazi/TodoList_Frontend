import React from 'react';
import {
  Check,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  Folder,
} from 'lucide-react';

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  viewMode = 'list',
}) {
  const isCompleted = task.completed || task.status === 'completed';

  const priorityConfig = {
    urgent: {
      label: 'Urgent',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400 animate-pulse',
    },
    high: {
      label: 'High',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    medium: {
      label: 'Medium',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400',
    },
    low: {
      label: 'Low',
      badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      dot: 'bg-slate-400',
    },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isPast = date < now && !isCompleted;
    const formatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return { formatted, isPast };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  if (viewMode === 'grid') {
    return (
      <div
        className={`group relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-300 ${
          isCompleted
            ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priority.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
              <Folder className="w-3 h-3 text-indigo-400" />
              {task.category || 'General'}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(task._id)}
              className={`mt-1 shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/50'
                  : 'border-slate-600 hover:border-indigo-400 bg-slate-800/80'
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <h4
              className={`text-sm sm:text-base font-semibold leading-snug transition-all ${
                isCompleted
                  ? 'line-through text-slate-500'
                  : 'text-white group-hover:text-indigo-200'
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className={`mt-2.5 text-xs text-slate-400 line-clamp-3 leading-relaxed ${
                isCompleted ? 'line-through opacity-70' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                >
                  <Tag className="w-2.5 h-2.5 text-indigo-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            {dueDateInfo ? (
              <span
                className={`inline-flex items-center gap-1 ${
                  dueDateInfo.isPast ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{dueDateInfo.formatted}</span>
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">No due date</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center justify-between gap-4 rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-900/35 border-slate-800/50'
          : 'bg-slate-900/75 border-slate-800 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/20'
      }`}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`mt-0.5 sm:mt-0 shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/50'
              : 'border-slate-600 hover:border-indigo-400 bg-slate-800/80'
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm sm:text-base font-semibold leading-tight truncate transition-all ${
                isCompleted
                  ? 'line-through text-slate-500'
                  : 'text-white group-hover:text-indigo-200'
              }`}
            >
              {task.title}
            </h4>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${priority.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <Folder className="w-3 h-3 text-indigo-400" />
              {task.category || 'General'}
            </span>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-xs text-slate-400 line-clamp-1 ${
                isCompleted ? 'line-through opacity-70' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            {dueDateInfo && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] ${
                  dueDateInfo.isPast ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{dueDateInfo.formatted}</span>
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
