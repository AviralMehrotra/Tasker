import clsx from "clsx";
import React from "react";
import { MdAdd } from "react-icons/md";

const TaskTitle = ({ label, className }) => {
  return (
    <div className="w-full h-10 md:h-12 px-3 md:px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
      <div className="flex gap-2.5 items-center">
        <div className={clsx("w-3.5 h-3.5 rounded-full", className)} />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      </div>
      <button className="hidden md:block text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <MdAdd className="text-lg" />
      </button>
    </div>
  );
};

export default TaskTitle;
