import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import ProfileModal from "./ProfileModal";
import { toast } from "sonner";
import clsx from "clsx";

export default function UserAvatar() {
  const [openProfile, setOpenProfile] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutUser] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#161924] transition-colors outline-none cursor-pointer">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "User Avatar"}
              className="w-8 h-8 rounded-lg object-cover shadow-xs border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-xs shadow-xs">
              {getInitials(user?.name)}
            </div>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block" />
        </MenuButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-xl focus:outline-none overflow-hidden z-50 p-1.5 text-sm">
            {/* User Header Summary with Avatar */}
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
              <div className="flex items-center gap-2.5">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || "User Avatar"}
                    className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <span
                      className={clsx(
                        "font-mono text-[9px] uppercase px-1.5 py-0.2 rounded font-bold border shrink-0",
                        user?.isAdmin
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                          : "bg-slate-100 dark:bg-[#181c28] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                      )}
                    >
                      {user?.isAdmin ? "Admin" : "Member"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Unified Profile & Account Settings (Includes Password Change) */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => setOpenProfile(true)}
                  className={clsx(
                    "flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                    active
                      ? "bg-slate-100 dark:bg-[#181c28] text-slate-900 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span>Profile & Security</span>
                </button>
              )}
            </MenuItem>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            {/* Sign Out */}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={logoutHandler}
                  className={clsx(
                    "flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-rose-600 dark:text-rose-400 cursor-pointer",
                    active ? "bg-rose-50 dark:bg-rose-950/40" : ""
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>

      {/* Unified Profile & Password Modal */}
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
    </>
  );
}
