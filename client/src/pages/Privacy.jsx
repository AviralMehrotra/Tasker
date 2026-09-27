import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Cookie,
  Database,
  UserCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function Privacy() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] selection:bg-blue-600 selection:text-white transition-colors duration-200 bg-grain">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200/80 dark:border-[#1d202d] bg-white/80 dark:bg-[#08090d]/85 backdrop-blur-md transition-colors">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Overview</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600/10 dark:bg-[#161926] p-0.5 border border-blue-500/20 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Tasker" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Tasker</span>
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#121520] border border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content Container (Read Mode) */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Title Banner */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LEGAL & COMPLIANCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Effective Date: January 1, 2026</span>
            <span>•</span>
            <span>Version: 2.0.4</span>
            <span>•</span>
            <span>Jurisdiction: Global / GDPR Compliant</span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">01.</span>
              <span>Our Data Philosophy</span>
            </h2>
            <p>
              Tasker is engineered with strict data minimization principles. We do not sell, rent,
              or monetize your project content, team discussions, or personal metadata. We collect
              only the minimum telemetry required to authenticate sessions, coordinate task stage
              pipelines, and provide real-time audit feeds.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">02.</span>
              <span>Data We Collect and Process</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identity Credentials:</strong> Name, work email address, and cryptographically
                hashed passwords (processed via salted bcrypt).
              </li>
              <li>
                <strong>Workspace Data:</strong> Task titles, descriptions, stage assignments (To Do,
                In Progress, Completed), priority ratings, due dates, and checklist subtasks.
              </li>
              <li>
                <strong>Audit Telemetry:</strong> Timestamped records of task movements, role
                modifications, and team assignments to populate the workspace activity stream.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">03.</span>
              <span>Cookie & Token Architecture</span>
            </h2>
            <div className="p-4 rounded-xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <Cookie className="w-4 h-4" />
                <span>Zero Third-Party Advertising Pixels</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tasker uses strictly functional, stateless <code>httpOnly</code> cookies for
                authentication. Tokens are never accessible to client-side scripts, protecting your
                session against cross-site scripting (XSS). We do not load marketing or behavioral
                tracking cookies.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">04.</span>
              <span>Data Retention & Trash Bin Lifecycle</span>
            </h2>
            <p>
              When a team member deletes a task or sprint asset, it enters a quarantined Trash Bin.
              This safeguards against accidental data loss. Workspace Administrators retain the
              ability to restore items or permanently purge records from MongoDB storage at any
              time.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">05.</span>
              <span>Your Rights (GDPR & CCPA)</span>
            </h2>
            <p>
              Regardless of your geographic location, you retain full rights to inspect, export,
              rectify, or request total erasure of your account and task records. To execute a data
              subject request, contact your workspace administrator or reach out to our privacy team.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Questions & Contact
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For security disclosures or privacy compliance inquiries, contact:{" "}
              <a
                href="mailto:privacy@tasker.internal"
                className="text-blue-600 dark:text-blue-400 underline font-mono"
              >
                privacy@tasker.internal
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#06070a] py-8 text-center text-xs font-mono text-slate-400">
        © 2026 Tasker Inc. Built for speed, precision, and focus.
      </footer>
    </div>
  );
}
