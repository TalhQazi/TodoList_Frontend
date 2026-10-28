import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  AlertCircle,
  Calendar,
  Folder,
  Tag,
} from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    status: 'pending',
    dueDate: '',
    tagsString: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        category: initialData.category || 'General',
        status: initialData.status || (initialData.completed ? 'completed' : 'pending'),
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
        tagsString: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'General',
        status: 'pending',
        dueDate: '',
        tagsString: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePrioritySelect = (p) => {
    setFormData((prev) => ({ ...prev, priority: p }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      status: formData.status,
      completed: formData.status === 'completed',
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      tags,
    };

    onSubmit(payload);
  };

  const priorities = [
    { id: 'low', label: 'Low', activeClass: 'bg-slate-700 text-slate-200 border-slate-500' },
    { id: 'medium', label: 'Medium', activeClass: 'bg-blue-600/30 text-blue-300 border-blue-500' },
    { id: 'high', label: 'High', activeClass: 'bg-amber-600/30 text-amber-300 border-amber-500' },
    { id: 'urgent', label: 'Urgent', activeClass: 'bg-rose-600/30 text-rose-300 border-rose-500' },
  ];

  const categories = ['General', 'Development', 'Design', 'Work', 'Personal'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              {initialData ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-slate-400">
                {initialData
                  ? 'Update your task details and parameters'
                  : 'Add a new action item to your productivity board'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement REST API Authentication..."
              className={`w-full px-4 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                errors.title
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Add additional context, acceptance criteria, or notes..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => {
                const isSelected = formData.priority === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handlePrioritySelect(p.id)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? p.activeClass + ' shadow-sm'
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full appearance-none pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <Folder className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="pending" className="bg-slate-900 text-white">
                  Pending
                </option>
                <option value="in-progress" className="bg-slate-900 text-white">
                  In Progress
                </option>
                <option value="completed" className="bg-slate-900 text-white">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
                <Calendar className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tags (comma separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tagsString"
                  value={formData.tagsString}
                  onChange={handleChange}
                  placeholder="frontend, api, bug"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
                <Tag className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? 'Save Changes' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
