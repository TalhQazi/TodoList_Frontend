import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TaskStats from './components/TaskStats';
import FilterBar from './components/FilterBar';
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import WeatherWidget from './components/WeatherWidget';
import GitHubSyncModal from './components/GitHubSyncModal';
import NotificationToast from './components/NotificationToast';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
  getSystemHealth,
} from './services/api';
import {
  Plus,
  Inbox,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'newest',
  });
  const [viewMode, setViewMode] = useState('list');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(true);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const checkDb = useCallback(async () => {
    try {
      const res = await getSystemHealth();
      setDbStatus(res.database);
    } catch (err) {
      setDbStatus({ connected: false, mode: 'Fallback API' });
    }
  }, []);

  const fetchTaskList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTasks(filters);
      setTasks(res.data || []);
    } catch (err) {
      setError('Could not connect to task server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    checkDb();
    fetchTaskList();
  }, [fetchTaskList, checkDb]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        showToast('Task updated successfully!', 'success');
      } else {
        await createTask(taskData);
        showToast('New task created successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTaskList();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                completed: !t.completed,
                status: !t.completed ? 'completed' : 'pending',
              }
            : t
        )
      );
      const res = await toggleTaskCompleted(id);
      showToast(res.message || 'Task status updated!', 'info');
      fetchTaskList();
    } catch (err) {
      showToast('Failed to update task status', 'error');
      fetchTaskList();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setIsSubmitting(true);
      await deleteTask(deletingTask._id);
      showToast('Task deleted successfully', 'success');
      setDeletingTask(null);
      fetchTaskList();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportGitHubIssue = async (issueData) => {
    try {
      await createTask(issueData);
      showToast(`Imported "${issueData.title.slice(0, 30)}..." as task`, 'success');
      fetchTaskList();
    } catch (err) {
      showToast('Failed to import GitHub issue', 'error');
    }
  };

  const handleAddFromWeather = async (weatherTask) => {
    try {
      await createTask(weatherTask);
      showToast('Weather recommendation added as task!', 'success');
      fetchTaskList();
    } catch (err) {
      showToast('Failed to add weather task', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        onToggleWeather={() => setIsWeatherOpen((prev) => !prev)}
        isWeatherOpen={isWeatherOpen}
        onToggleGitHub={() => setIsGitHubOpen(true)}
        isGitHubOpen={isGitHubOpen}
        dbStatus={dbStatus}
        onRefresh={fetchTaskList}
        isLoading={loading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskStats tasks={tasks} />

        {isWeatherOpen && (
          <WeatherWidget
            onClose={() => setIsWeatherOpen(false)}
            onAddTaskFromWeather={handleAddFromWeather}
          />
        )}

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs sm:text-sm text-rose-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchTaskList}
              className="px-3 py-1.5 rounded-xl bg-rose-800/60 hover:bg-rose-700 text-white font-medium text-xs transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No tasks found</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'No tasks match your current filter criteria. Try adjusting or clearing filters.'
                : 'Your task board is clear! Create your first task to start organizing your workflow.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Task</span>
              </button>
              {(filters.search ||
                filters.status !== 'all' ||
                filters.priority !== 'all' ||
                filters.category !== 'all') && (
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      status: 'all',
                      priority: 'all',
                      category: 'all',
                      sortBy: 'newest',
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                onDelete={() => setDeletingTask(task)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">TaskMaster Pro</span>
            <span>• Full Stack REST Application</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React.js + Tailwind CSS</span>
            <span>• Node.js & Express</span>
            <span>• MongoDB Mongoose</span>
            <span>• Open-Meteo & GitHub APIs</span>
          </div>
        </div>
      </footer>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingTask(null)}
        isDeleting={isSubmitting}
      />

      <GitHubSyncModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
        onImportIssue={handleImportGitHubIssue}
      />

      <NotificationToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
