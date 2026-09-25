import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../utils/ThemeContext";
import { Search, Sun, Moon, Menu } from "lucide-react";

const Navbar = ({ onOpenCommandPalette }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isDark, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchTerm.trim())}`);
    } else if (location.pathname === "/tasks") {
      navigate("/tasks");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/90 dark:bg-[#08090d]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1d202d] transition-colors duration-200">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="p-1.5 -ml-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161924] md:hidden transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-full max-w-md">
          <div
            onClick={onOpenCommandPalette}
            className="relative w-full flex items-center cursor-pointer group"
          >
            <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
            <div className="w-full pl-9 pr-14 py-1.5 rounded-lg text-xs sm:text-sm bg-slate-100 dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2333] group-hover:border-blue-500/50 text-slate-500 dark:text-slate-400 select-none transition-colors">
              Search commands, tasks, actions...
            </div>
            <kbd className="absolute right-2.5 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-400 bg-white dark:bg-[#181c2a] border border-slate-200 dark:border-[#22273b] rounded group-hover:border-blue-400/50 group-hover:text-blue-500 transition-colors pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#141722] transition-colors cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <NotificationPanel />
        <UserAvatar />
      </div>
    </header>
  );
};

export default Navbar;
