import React, { useEffect, useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  CircleDot,
  Plus,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import Chart from "../components/Chart";
import Loading from "../components/Loader";
import AddTask from "../components/tasks/AddTask";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { getInitials } from "../utils";

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    medium: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    normal: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    low: "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase tracking-wider border",
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

const StageBadge = ({ stage }) => {
  const styles = {
    todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    "in progress": "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
    completed: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
  };

  return (
    <span
      className={clsx(
        "px-2 py-0.5 rounded text-[11px] font-mono font-medium capitalize border",
        styles[stage?.toLowerCase()] || styles.todo
      )}
    >
      {stage}
    </span>
  );
};

const TaskTable = ({ tasks }) => {
  return (
    <div className="w-full lg:w-2/3 bg-white dark:bg-[#10121a] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-[#1d202d]">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Tasks
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
            Latest activity across your active workspace
          </p>
        </div>
        <Link
          to="/tasks"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1d202d] text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="pb-3 font-semibold">Task</th>
              <th className="pb-3 font-semibold">Stage</th>
              <th className="pb-3 font-semibold">Priority</th>
              <th className="pb-3 font-semibold">Team</th>
              <th className="pb-3 font-semibold text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1d202d]">
            {tasks && tasks.length > 0 ? (
              tasks.slice(0, 7).map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#141722] transition-colors group"
                >
                  <td className="py-3 pr-4">
                    <Link
                      to={`/task/${task._id}`}
                      className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <StageBadge stage={task.stage} />
                  </td>
                  <td className="py-3 pr-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {task?.team?.map((m, index) => (
                        m.avatar ? (
                          <img
                            key={index}
                            src={m.avatar}
                            alt={m.name}
                            title={m.name}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-[#10121a]"
                          />
                        ) : (
                          <div
                            key={index}
                            title={m.name}
                            className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#10121a]"
                          >
                            {getInitials(m.name)}
                          </div>
                        )
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-right text-xs font-mono text-slate-400 dark:text-slate-500">
                    {moment(task.createdAt).fromNow()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-mono">
                  No tasks recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  return (
    <div className="w-full lg:w-1/3 bg-white dark:bg-[#10121a] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-[#1d202d]">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Team Directory
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
            Active collaborators
          </p>
        </div>
        <Link
          to="/team"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 group"
        >
          <span>Manage</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {users && users.length > 0 ? (
          users.slice(0, 6).map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#141722] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-xs">
                      {getInitials(u.name)}
                    </div>
                  )}
                  <span
                    className={clsx(
                      "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-[#10121a]",
                      u.isActive ? "bg-emerald-500" : "bg-slate-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {u.name}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {u.role || u.title || "Collaborator"}
                  </p>
                </div>
              </div>
              <span
                className={clsx(
                  "font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider",
                  u.isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                )}
              >
                {u.isActive ? "Active" : "Disabled"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-mono">
            No collaborators found.
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading } = useGetDasboardStatsQuery();
  const { user } = useSelector((state) => state.auth);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const totals = data?.tasks || {};
  const totalCount = data?.totalTasks || 0;
  const completedCount = totals["completed"] || 0;
  const inProgressCount = totals["in progress"] || 0;
  const todoCount = totals["todo"] || 0;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Architectural Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d202d]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Workspace Overview
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getTimeGreeting()}, {user?.name?.split(" ")[0] || "Explorer"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Bento: Primary Velocity Hero + Secondary Metric Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8-col: Velocity & Health Card */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-[#161926] text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Sprint Health: {completionRate > 50 ? "On Track" : "Active Delivery"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalCount} Total Workspace Items
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                You have <span className="font-mono font-bold text-slate-900 dark:text-white">{inProgressCount} tasks</span> currently in active development, with <span className="font-mono font-bold text-slate-900 dark:text-white">{todoCount} pending backlog items</span>.
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                {completionRate}%
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
                Completed
              </span>
            </div>
          </div>

          {/* Progress telemetry track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Sprint Progress</span>
              <span>{completedCount} of {totalCount} completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#161926] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(3, completionRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right 4-col: High-density Stacked Metrics */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed</p>
                <p className="font-mono text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {completedCount}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Progress</p>
                <p className="font-mono text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {inProgressCount}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <CircleDot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Backlog</p>
                <p className="font-mono text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {todoCount}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-slate-400 font-semibold">
              {totalCount > 0 ? Math.round((todoCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#10121a] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-[#1d202d]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Priority Distribution
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                Task distribution across urgency levels
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#161926] text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <Chart data={data?.graphData || []} type="bar" />
        </div>

        <div className="bg-white dark:bg-[#10121a] p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-[#1d202d]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Priority Breakdown
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                Ratio of team allocation
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#161926] text-blue-600 dark:text-blue-400">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <Chart data={data?.graphData || []} type="pie" />
        </div>
      </div>

      {/* Tables Split View */}
      <div className="flex flex-col lg:flex-row gap-5">
        <TaskTable tasks={data?.last10Task || []} />
        <UserTable users={data?.users || []} />
      </div>

      {/* Task Creation Modal */}
      <AddTask open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default Dashboard;
