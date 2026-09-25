import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice.js";
import { setCredentials } from "../redux/slices/authSlice.js";
import { toast } from "sonner";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  UserCheck,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";

export default function Login() {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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

  const handleQuickLogin = (email, password) => {
    setValue("email", email);
    setValue("password", password);
    submitHandler({ email, password });
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] transition-colors duration-200 bg-grain">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-lg bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-colors shadow-sm cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Left Editorial Architectural Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0d0f17] dark:bg-[#06070a] border-r border-slate-800/80 p-12 xl:p-16 flex-col justify-between text-white">
        {/* Subtle grid line accents (No purple/indigo blur blobs) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1.5 border border-blue-500/20 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Tasker" className="w-full h-full object-contain drop-shadow" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight">Tasker</span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 border border-slate-700/80 px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </div>

        {/* Center Architectural Showcase */}
        <div className="relative z-10 my-auto space-y-8 max-w-lg">
          <div className="space-y-3">
            <p className="font-mono text-xs text-blue-400 uppercase tracking-widest font-semibold">
              Project Orchestration System
            </p>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Built for speed, precision, and focus.
            </h1>
            <p className="text-sm xl:text-base text-slate-400 leading-relaxed max-w-[50ch]">
              A zero-friction Kanban environment for high-velocity software teams. Track sprints, manage backlogs, and organize releases without ceremonial drag.
            </p>
          </div>

          {/* Structured Architectural Preview Grid */}
          <div className="p-5 rounded-xl bg-[#11131e] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400 uppercase tracking-wider">Active Sprint Board</span>
              <span className="font-mono text-[11px] text-blue-400 font-semibold">Stage Sync Online</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#161926] border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-[11px]">To Do</span>
                </div>
                <p className="font-mono text-base font-bold text-white">08</p>
              </div>

              <div className="p-3 rounded-lg bg-[#161926] border border-blue-950/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium text-[11px]">In Progress</span>
                </div>
                <p className="font-mono text-base font-bold text-white">05</p>
              </div>

              <div className="p-3 rounded-lg bg-[#161926] border border-emerald-950/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-[11px]">Completed</span>
                </div>
                <p className="font-mono text-base font-bold text-white">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Enterprise Ready</span>
          <span>© {new Date().getFullYear()} Tasker</span>
        </div>
      </div>

      {/* Right Login Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1 border border-blue-500/20 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Tasker" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Tasker</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Access your workspace, projects, and active tasks.
            </p>
          </div>

          {/* Quick One-Click Demo Credentials */}
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quick One-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@gmail.com", "admin123")}
                className="group p-3 rounded-lg border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] hover:border-blue-500 dark:hover:border-blue-500 text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Admin</span>
                </div>
                <p className="font-mono text-[10px] text-slate-400 truncate">admin@gmail.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("user@gmail.com", "user123")}
                className="group p-3 rounded-lg border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] hover:border-blue-500 dark:hover:border-blue-500 text-left transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Member</span>
                </div>
                <p className="font-mono text-[10px] text-slate-400 truncate">user@gmail.com</p>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-[#1d202d]"></div>
            <span className="flex-shrink mx-3 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Or credentials
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-[#1d202d]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
