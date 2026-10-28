import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { getGitHubIssues } from '../services/api';

const GithubIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const POPULAR_REPOS = [
  'facebook/react',
  'tailwindlabs/tailwindcss',
  'vercel/next.js',
  'nodejs/node',
  'microsoft/vscode',
];

export default function GitHubSyncModal({ isOpen, onClose, onImportIssue }) {
  const [repo, setRepo] = useState('facebook/react');
  const [repoInput, setRepoInput] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importedIds, setImportedIds] = useState(new Set());

  const fetchIssues = async (targetRepo) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getGitHubIssues(targetRepo);
      setIssues(res.data || []);
    } catch (err) {
      setError('Unable to fetch issues from this repository. Make sure format is "owner/repo".');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchIssues(repo);
    }
  }, [isOpen, repo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setRepo(repoInput.trim());
      setRepoInput('');
    }
  };

  const handleImport = async (issue) => {
    await onImportIssue({
      title: `[GH #${issue.number}] ${issue.title}`,
      description: `Issue Link: ${issue.html_url}\n\n${issue.body || 'No description provided.'}`,
      category: 'Development',
      priority: 'high',
      tags: ['github', ...issue.labels.slice(0, 2)],
    });

    setImportedIds((prev) => new Set([...prev, issue.id]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">GitHub Public Issues Sync</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                  Public API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn open issues from any public GitHub repository directly into tasks
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

        <div className="p-6 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="Enter repository (e.g. facebook/react, vercel/next.js)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-medium rounded-xl transition"
            >
              Fetch Issues
            </button>
          </form>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400">Presets:</span>
            {POPULAR_REPOS.map((r) => (
              <button
                key={r}
                onClick={() => setRepo(r)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition ${
                  repo === r
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Fetching issues from GitHub...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : issues.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No open issues found for this repository.
            </div>
          ) : (
            issues.map((issue) => {
              const isImported = importedIds.has(issue.id);
              return (
                <div
                  key={issue.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-purple-400">
                        #{issue.number}
                      </span>
                      <h4 className="text-sm font-semibold text-white hover:text-purple-300 transition">
                        {issue.title}
                      </h4>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-300"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {issue.body && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {issue.body}
                      </p>
                    )}

                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {issue.labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            <Tag className="w-2.5 h-2.5 text-purple-400" />
                            {lbl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleImport(issue)}
                    disabled={isImported}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isImported
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                    }`}
                  >
                    {isImported ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Imported</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Import Task</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
