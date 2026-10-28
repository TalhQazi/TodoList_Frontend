import React from 'react';
import { Check, Plus, CloudSun, Database } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({
  onOpenCreateModal,
  onToggleWeather,
  isWeatherOpen,
  onToggleGitHub,
  dbStatus,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2.5 rounded-lg min-w-0">
          <span className="flex items-center justify-center size-9 shrink-0 rounded-lg bg-primary text-primary-foreground">
            <Check className="size-5" strokeWidth={3} />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground truncate max-[359px]:sr-only">
            TaskMaster
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {dbStatus && (
            <span
              className={`hidden md:inline-flex chip h-8 px-3 mr-1 ${
                dbStatus.connected
                  ? 'bg-success-soft text-success-soft-foreground'
                  : 'bg-warning-soft text-warning-soft-foreground'
              }`}
              title={dbStatus.mode || 'Database status'}
            >
              <Database className="size-3.5" />
              {dbStatus.connected ? 'MongoDB live' : 'Demo data'}
            </span>
          )}

          <button
            type="button"
            onClick={onToggleWeather}
            aria-pressed={isWeatherOpen}
            aria-label="Weather planner"
            className={`btn px-2.5 sm:px-3 ${
              isWeatherOpen ? 'bg-accent-soft text-accent-soft-foreground' : 'btn-ghost'
            }`}
          >
            <CloudSun className="size-5" />
            <span className="hidden sm:inline">Weather</span>
          </button>

          <button
            type="button"
            onClick={onToggleGitHub}
            aria-haspopup="dialog"
            aria-label="Import GitHub issues"
            className="btn btn-ghost px-2.5 sm:px-3"
          >
            <GithubIcon className="size-5" />
            <span className="hidden sm:inline">GitHub</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateModal}
            aria-label="New task"
            className="btn btn-primary ml-1 px-3 sm:px-4"
          >
            <Plus className="size-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">New task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
