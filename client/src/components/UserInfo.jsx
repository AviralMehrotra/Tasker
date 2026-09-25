import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { getInitials } from "../utils";

const UserInfo = ({ user }) => {
  return (
    <div className="inline-flex items-center justify-center w-full h-full">
      <Popover className="relative w-full h-full flex items-center justify-center">
        <PopoverButton className="group inline-flex items-center justify-center w-full h-full outline-none cursor-pointer overflow-hidden rounded-full">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "Member"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="font-mono">{getInitials(user?.name)}</span>
          )}
        </PopoverButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className="absolute left-1/2 z-50 mt-3 w-72 -translate-x-1/2 transform">
            <div className="flex items-center gap-3.5 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "Member"}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-600 rounded-xl text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm font-mono">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-bold truncate">
                  {user?.name}
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.title || user?.role || "Collaborator"}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                  {user?.email ?? "email@example.com"}
                </span>
              </div>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
};

export default UserInfo;
