import React, { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  UserCheck,
  Activity,
  Calendar,
  Users,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice.js";
import clsx from "clsx";
import { getInitials } from "../utils";
import ProfileModal from "./ProfileModal";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "All Tasks",
    link: "tasks",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    label: "My Tasks",
    link: "my-tasks",
    icon: <UserCheck className="w-4 h-4" />,
  },
  {
    label: "Activity Feed",
    link: "activity",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    label: "Deadlines",
    link: "calendar",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "Team Members",
    link: "team",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Trash Bin",
    link: "trashed",
    icon: <Trash2 className="w-4 h-4" />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  const currentPath = location.pathname.split("/")[1] || "dashboard";

  // Admins see all links; Members see all links except admin-only management (Team and Trash)
  const sidebarLinks = user?.isAdmin ? linkData : linkData.filter((l) => l.link !== "team" && l.link !== "trashed");

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const isLinkActive = (el) => {
    const routePrefix = el.link.split("/")[0];
    return currentPath === routePrefix;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-[#0c0e15] border-r border-slate-200 dark:border-[#1d202d] transition-colors duration-200">
      <div className="space-y-6">
        {/* Brand Header with Actual Logo from Tab Bar */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-2 py-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1 border border-blue-500/20 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Tasker"
              className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tasker
            </span>
            <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-800 px-1 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-2 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
            Workspace
          </p>
          <nav className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.label}
                  to={link.link}
                  onClick={closeSidebar}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer",
                    active
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141722] hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={clsx(
                        "transition-colors",
                        active ? "text-white" : "text-slate-400 dark:text-slate-500"
                      )}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Pill */}
      {user && (
        <div className="pt-3 border-t border-slate-200 dark:border-[#1d202d]">
          <div
            onClick={() => setOpenProfile(true)}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-[#12151f] border border-slate-200/80 dark:border-[#1d202d] hover:border-blue-500/50 hover:bg-slate-100/80 dark:hover:bg-[#161a26] transition-all cursor-pointer group"
            title="Open Account & Profile Settings"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "Avatar"}
                className="w-8 h-8 rounded-lg object-cover shadow-xs shrink-0 group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {user?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={clsx(
                    "font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded border font-semibold",
                    user?.isAdmin
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  )}
                >
                  {user?.isAdmin ? "Admin" : "Member"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  Settings
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Profile Modal */}
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
    </div>
  );
};

export default Sidebar;
