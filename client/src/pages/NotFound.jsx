import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Home,
  Sun,
  Moon,
  Terminal,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] selection:bg-blue-600 selection:text-white transition-colors duration-200 bg-grain">
      {/* Structural Architectural Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1 border border-blue-500/20 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Tasker"
              className="w-full h-full object-contain drop-shadow group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Tasker
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
            v2.0
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-colors shadow-xs cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </header>

      {/* Center 404 Experience */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center space-y-7">
          {/* Telemetry Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>ERROR 404 // ROUTE_NOT_FOUND</span>
          </div>

          {/* Heading & Subhead */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Page does not exist.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              The requested address does not correspond to an active sprint board, documentation
              endpoint, or system route.
            </p>
          </div>

          {/* Architectural Path Inspection Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] shadow-sm max-w-md mx-auto text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                <span>Router Diagnostics</span>
              </span>
              <span className="text-[10px] text-rose-500 font-semibold">404</span>
            </div>
            <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
              path: {window.location.pathname}
            </p>
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              status: Unresolved client-side route
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#10121a] hover:bg-slate-50 dark:hover:bg-[#161925] border border-slate-200 dark:border-[#1d202d] text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Page</span>
            </button>
          </div>

          {/* Keyboard Helper */}
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Use navigation links or press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300">
              Alt + ←
            </kbd>
            <span>to navigate back</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-[#181a25]">
        <span>Tasker Systems Inc.</span>
        <span>All Clusters Active</span>
      </footer>
    </div>
  );
}
