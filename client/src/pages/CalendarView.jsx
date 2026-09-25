import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  CalendarDays,
  Plus,
} from "lucide-react";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import AddTask from "../components/tasks/AddTask";
import { formatDate, getInitials } from "../utils";
import clsx from "clsx";

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    medium: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    normal: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    low: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider border",
        styles[priority?.toLowerCase()] || styles.normal
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full",
          priority?.toLowerCase() === "high"
            ? "bg-rose-500"
            : priority?.toLowerCase() === "medium"
            ? "bg-amber-500"
            : "bg-blue-500"
        )}
      />
      {priority}
    </span>
  );
};

const CalendarView = () => {
  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "",
    search: "",
  });

  const [openCreate, setOpenCreate] = useState(false);
  const tasks = data?.tasks || [];

  const now = moment().startOf("day");
  const endOfWeek = moment().endOf("week");

  // Group tasks into timeline buckets
  const overdueTasks = [];
  const dueTodayTasks = [];
  const dueThisWeekTasks = [];
  const upcomingTasks = [];
  const completedTasks = [];

  tasks.forEach((task) => {
    if (task.stage === "completed") {
      completedTasks.push(task);
      return;
    }

    if (!task.date) {
      upcomingTasks.push(task);
      return;
    }

    const taskDate = moment(task.date).startOf("day");

    if (taskDate.isBefore(now)) {
      overdueTasks.push(task);
    } else if (taskDate.isSame(now, "day")) {
      dueTodayTasks.push(task);
    } else if (taskDate.isBetween(now, endOfWeek, null, "[]")) {
      dueThisWeekTasks.push(task);
    } else {
      upcomingTasks.push(task);
    }
  });

  const cohorts = [
    {
      id: "overdue",
      title: "Overdue Delivery",
      subtitle: "Past deadline & pending completion",
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      color: "border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10",
      badgeColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
      tasks: overdueTasks,
    },
    {
      id: "today",
      title: "Due Today",
      subtitle: "Targeted for immediate shipment",
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      color: "border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10",
      badgeColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
      tasks: dueTodayTasks,
    },
    {
      id: "week",
      title: "Due This Week",
      subtitle: "Sprint commitments through end-of-week",
      icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
      color: "border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10",
      badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
      tasks: dueThisWeekTasks,
    },
    {
      id: "upcoming",
      title: "Upcoming & Later",
      subtitle: "Future sprints & scheduled milestones",
      icon: <CalendarIcon className="w-4 h-4 text-slate-400" />,
      color: "border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a]",
      badgeColor: "bg-slate-100 dark:bg-[#161924] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
      tasks: upcomingTasks,
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d202d]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Deadlines & Milestones
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-blue-600 dark:text-blue-400 tabular-nums">
              {tasks.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Chronological milestone schedule and delivery cohort tracking
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Cohort Columns Grid */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className={clsx(
                "p-4 rounded-xl border flex flex-col gap-3 min-h-[420px]",
                cohort.color
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#1d202d]">
                <div className="flex items-center gap-2">
                  {cohort.icon}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                    {cohort.title}
                  </h3>
                </div>
                <span
                  className={clsx(
                    "font-mono text-[11px] font-semibold px-2 py-0.5 rounded border tabular-nums",
                    cohort.badgeColor
                  )}
                >
                  {cohort.tasks.length}
                </span>
              </div>

              {/* Task Items in Cohort */}
              <div className="flex-1 space-y-2.5">
                {cohort.tasks.length > 0 ? (
                  cohort.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 rounded-lg bg-white dark:bg-[#12151f] border border-slate-200/80 dark:border-[#1e2333] shadow-sm hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <PriorityBadge priority={task.priority} />
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                          {formatDate(task.date)}
                        </span>
                      </div>

                      <Link
                        to={`/task/${task._id}`}
                        className="block text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {task.title}
                      </Link>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#1d202d] text-[10px] font-mono text-slate-400">
                        <span className="capitalize">{task.stage}</span>
                        <div className="flex -space-x-1 overflow-hidden">
                          {task.team?.slice(0, 2).map((m, i) => (
                            m.avatar ? (
                              <img
                                key={i}
                                src={m.avatar}
                                alt={m.name}
                                title={m.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-[#12151f]"
                              />
                            ) : (
                              <div
                                key={i}
                                title={m.name}
                                className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono flex items-center justify-center text-[9px] ring-1 ring-white dark:ring-[#12151f]"
                              >
                                {getInitials(m.name)}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border border-dashed border-slate-200 dark:border-[#1d202d] rounded-lg">
                    <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                      No items
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTask open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default CalendarView;
