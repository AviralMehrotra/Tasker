import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Scale,
  Users,
  Sun,
  Moon,
} from "lucide-react";

export default function Terms() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>TERMS OF AGREEMENT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Last Updated: January 1, 2026</span>
            <span>•</span>
            <span>Version: 2.0.4</span>
            <span>•</span>
            <span>Universal SaaS Standard</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">01.</span>
              <span>Acceptance of Workspace Terms</span>
            </h2>
            <p>
              By accessing, deploying, or creating an account within Tasker, you agree to comply with
              and be bound by these Terms of Service. If you are registering an enterprise or
              organization, you represent that you possess administrative authority to bind that
              entity to these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">02.</span>
              <span>Role-Based Governance & Responsibilities</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] space-y-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Administrators
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Responsible for user credential provisioning, role assignments, trash bin purge
                  governance, and enterprise compliance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] space-y-2">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Team Members
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Responsible for maintaining password confidentiality and adhering to workspace
                  acceptable use policies during sprint execution.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">03.</span>
              <span>Acceptable Use & System Integrity</span>
            </h2>
            <p>
              You agree not to engage in malicious activities, including attempting unauthorized
              privilege escalation, distributing malware, automated denial-of-service stress tests,
              or reverse-engineering internal API endpoints without prior written approval.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">04.</span>
              <span>Content Ownership & Intellectual Property</span>
            </h2>
            <p>
              You retain 100% intellectual property ownership of all tasks, code snippets, sprint
              assets, and project plans uploaded to Tasker. We claim zero proprietary rights or
              licenses over user data beyond the technical necessity of storing and rendering it on
              your behalf.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 text-base">05.</span>
              <span>Service Availability & Disclaimers</span>
            </h2>
            <p>
              Tasker is provided on an "as is" and "as available" basis. While we maintain a 99.9%
              uptime architecture with optimistic caching, we disclaim liability for indirect or
              consequential damages arising from network interruptions or unauthorized credential
              compromise.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Legal Inquiries
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For contractual agreements or formal legal notices, contact:{" "}
              <a
                href="mailto:legal@tasker.internal"
                className="text-blue-600 dark:text-blue-400 underline font-mono"
              >
                legal@tasker.internal
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
