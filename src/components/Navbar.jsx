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
              role="img"
              aria-label={dbStatus.connected ? 'Database connected' : 'Using demo data'}
              title={dbStatus.connected ? 'MongoDB connected' : 'Demo data (database offline)'}
              className="hidden md:flex relative size-10 items-center justify-center text-muted-foreground"
            >
              <Database className="size-5" />
              <span
                className={`absolute top-2 right-2 size-2 rounded-full ring-2 ring-surface ${
                  dbStatus.connected ? 'bg-success' : 'bg-accent'
                }`}
              />
            </span>
          )}

          <button
            type="button"
            onClick={onToggleWeather}
            aria-pressed={isWeatherOpen}
            aria-label="Weather planner"
            title="Weather planner"
            className={`icon-btn ${
              isWeatherOpen
                ? 'bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft hover:text-accent-soft-foreground'
                : ''
            }`}
          >
            <CloudSun className="size-5" />
          </button>

          <button
            type="button"
            onClick={onToggleGitHub}
            aria-haspopup="dialog"
            aria-label="Import GitHub issues"
            title="Import GitHub issues"
            className="icon-btn"
          >
            <GithubIcon className="size-5" />
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
