import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice.js";
import { setCredentials } from "../redux/slices/authSlice.js";
import { toast } from "sonner";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success("Welcome back to your workspace");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || error.message || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] selection:bg-blue-600 selection:text-white transition-colors duration-200 bg-grain">
      {/* Structural Architectural Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* =========================================================================
          TOP UTILITY NAVIGATION
      ========================================================================= */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Overview</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Normal</span>
          </div>

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
        </div>
      </header>

      {/* =========================================================================
          CENTER AUTHENTICATION CARD
      ========================================================================= */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#0d0f17] border border-slate-200/90 dark:border-[#1c202e] shadow-xl shadow-slate-900/5 dark:shadow-none p-7 sm:p-9 space-y-7 transition-all">
            {/* Brand Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-[#161926] p-1.5 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <img
                      src="/logo.png"
                      alt="Tasker"
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Tasker
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                    v2.0
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#151826] border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                  <span>Secure SSL</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Sign In
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Enter your workspace credentials to continue.
                </p>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    autoFocus
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#12141f] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 font-medium"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">Encrypted</span>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#12141f] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 font-medium"
                    {...register("password", { required: "Password is required" })}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Primary Sign-In Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Privacy & Security Telemetry */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1a1e2d] text-center">
              <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                End-to-end token verification • 256-bit encrypted session
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          BOTTOM MINIMALIST FOOTER
      ========================================================================= */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-[#181a25]">
        <div className="flex items-center gap-2">
          <span>Tasker Platform v2.0.4</span>
          <span>•</span>
          <Link to="/" className="hover:underline">
            Product Tour
          </Link>
        </div>

        <div>
          <span>© {new Date().getFullYear()} Tasker Inc. Zero Ceremonial Drag.</span>
        </div>
      </footer>
    </div>
  );
}
