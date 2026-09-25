import React from "react";
import moment from "moment";
import { AlertCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export const DueDateBadge = ({ date, stage, className }) => {
  if (!date) {
    return (
      <span className={clsx("text-slate-400 font-mono text-[11px]", className)}>
        No due date
      </span>
    );
  }

  const isCompleted = stage?.toLowerCase() === "completed";
  const dueDate = moment(date).startOf("day");
  const today = moment().startOf("day");
  const diffDays = dueDate.diff(today, "days");
  const formattedFull = moment(date).format("MMM DD, YYYY");

  // If completed, keep it subtle
  if (isCompleted) {
    return (
      <span
        title={`Completed task · Due was ${formattedFull}`}
        className={clsx(
          "inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums",
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
        <span>{moment(date).format("MMM DD")}</span>
      </span>
    );
  }

  // Overdue
  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return (
      <span
        title={`Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""} (${formattedFull})`}
        className={clsx(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 tabular-nums shrink-0",
          className
        )}
      >
        <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
        <span>Overdue ({overdueDays}d)</span>
      </span>
    );
  }

  // Due Today
  if (diffDays === 0) {
    return (
      <span
        title={`Due today (${formattedFull})`}
        className={clsx(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 tabular-nums shrink-0",
          className
        )}
      >
        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
        <span>Due Today</span>
      </span>
    );
  }

  // Due Tomorrow
  if (diffDays === 1) {
    return (
      <span
        title={`Due tomorrow (${formattedFull})`}
        className={clsx(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tabular-nums shrink-0",
          className
        )}
      >
        <Clock className="w-3 h-3 text-blue-500 shrink-0" />
        <span>Tomorrow</span>
      </span>
    );
  }

  // Due Soon (2 - 3 days)
  if (diffDays <= 3) {
    return (
      <span
        title={`Due in ${diffDays} days (${formattedFull})`}
        className={clsx(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tabular-nums shrink-0",
          className
        )}
      >
        <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
        <span>In {diffDays}d</span>
      </span>
    );
  }

  // Standard Future Date
  return (
    <span
      title={`Due on ${formattedFull}`}
      className={clsx(
        "inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums",
        className
      )}
    >
      <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
      <span>{moment(date).format("MMM DD")}</span>
    </span>
  );
};

export default DueDateBadge;
