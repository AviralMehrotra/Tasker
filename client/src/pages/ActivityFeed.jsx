import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  Activity,
  MessageSquare,
  Flame,
  CheckCircle2,
  Clock,
  PlayCircle,
  UserCheck,
  ArrowUpRight,
  Search,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { useGetTeamListsQuery } from "../redux/slices/api/userApiSlice";
import Loading from "../components/Loader";
import { getInitials } from "../utils";
import clsx from "clsx";

const getActivityConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "started":
      return {
        icon: <PlayCircle className="w-3.5 h-3.5 text-blue-500" />,
        badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        label: "STARTED",
      };
    case "in progress":
      return {
        icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        label: "IN PROGRESS",
      };
    case "bug":
      return {
        icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        label: "BUG REPORT",
      };
    case "completed":
      return {
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        label: "COMPLETED",
      };
    case "assigned":
      return {
        icon: <UserCheck className="w-3.5 h-3.5 text-sky-500" />,
        badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        label: "ASSIGNED",
      };
    case "commented":
    default:
      return {
        icon: <MessageSquare className="w-3.5 h-3.5 text-slate-400" />,
        badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        label: "COMMENT",
      };
  }
};

const formatActivityText = (text) => {
  if (!text) return "";
  return text
    .replace(/^New task has been assigned to you The/i, "New task has been assigned to you. The")
    .replace(/set a (High|Medium|Normal|Low) priority/i, "set to $1 priority")
    .replace(/\. Thank you!!!/i, ".");
};

const ActivityFeed = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data: teamData } = useGetTeamListsQuery();
  const teamList = teamData || [];

  const { data, isLoading, refetch, isFetching } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "",
    search: "",
  });

  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tasks = data?.tasks || [];

  // Team lookup map by ID
  const teamMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(teamList)) {
      teamList.forEach((m) => {
        if (m?._id) map.set(m._id, m);
      });
    }
    return map;
  }, [teamList]);

  // Resolve author metadata cleanly (no raw MongoDB ObjectIDs)
  const resolveAuthor = (act, taskTeam) => {
    // 1. Populated object
    if (act.by && typeof act.by === "object") {
      return {
        name: act.by.name || "Team Member",
        title: act.by.title || act.by.role || "Member",
      };
    }

    const byId = typeof act.by === "string" ? act.by : act.by?._id;

    // 2. Check current user
    if (byId && currentUser && (byId === currentUser._id || byId === currentUser.id)) {
      return {
        name: currentUser.name || "You",
        title: currentUser.title || currentUser.role || "Admin",
      };
    }

    // 3. Check team member in task.team
    if (Array.isArray(taskTeam)) {
      const match = taskTeam.find((m) => (typeof m === "object" ? m._id === byId : m === byId));
      if (match && typeof match === "object" && match.name) {
        return {
          name: match.name,
          title: match.title || "Member",
        };
      }
    }

    // 4. Check global teamList map
    if (byId && teamMap.has(byId)) {
      const member = teamMap.get(byId);
      return {
        name: member.name,
        title: member.title || member.role || "Member",
      };
    }

    // 5. Fallback for raw MongoDB 24-character hexadecimal IDs
    if (typeof byId === "string" && /^[0-9a-fA-F]{24}$/.test(byId)) {
      return {
        name: currentUser?.name || "Project Lead",
        title: "Workspace Member",
      };
    }

    // 6. Generic string fallback
    return {
      name: typeof act.by === "string" && act.by ? act.by : "Team Member",
      title: "Member",
    };
  };

  // Flatten and normalize all activities across tasks
  const allActivities = useMemo(() => {
    const list = [];
    tasks.forEach((task) => {
      if (task.activities && task.activities.length > 0) {
        task.activities.forEach((act) => {
          const author = resolveAuthor(act, task.team);
          list.push({
            ...act,
            author,
            taskId: task._id,
            taskTitle: task.title,
            taskStage: task.stage,
            taskPriority: task.priority,
          });
        });
      }
    });

    // Sort chronologically descending
    return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }, [tasks, currentUser, teamMap]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return allActivities.filter((item) => {
      // Type filter
      const matchesType =
        filterType === "all"
          ? true
          : filterType === "in progress"
          ? item.type?.toLowerCase() === "in progress" || item.type?.toLowerCase() === "started"
          : item.type?.toLowerCase() === filterType;

      if (!matchesType) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.activity?.toLowerCase().includes(q) ||
        item.taskTitle?.toLowerCase().includes(q) ||
        item.author?.name?.toLowerCase().includes(q)
      );
    });
  }, [allActivities, filterType, searchQuery]);

  const filterTabs = [
    { id: "all", label: "All Activity", count: allActivities.length },
    {
      id: "assigned",
      label: "Assignments",
      count: allActivities.filter((a) => a.type?.toLowerCase() === "assigned").length,
    },
    {
      id: "commented",
      label: "Comments",
      count: allActivities.filter((a) => a.type?.toLowerCase() === "commented").length,
    },
    {
      id: "in progress",
      label: "Progress Updates",
      count: allActivities.filter(
        (a) => a.type?.toLowerCase() === "in progress" || a.type?.toLowerCase() === "started"
      ).length,
    },
    {
      id: "completed",
      label: "Completions",
      count: allActivities.filter((a) => a.type?.toLowerCase() === "completed").length,
    },
    {
      id: "bug",
      label: "Bug Reports",
      count: allActivities.filter((a) => a.type?.toLowerCase() === "bug").length,
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d202d]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Activity Stream
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-blue-600 dark:text-blue-400 tabular-nums">
              {filteredActivities.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Chronological audit log of comments, commits, transitions, and task lifecycle events
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] hover:bg-slate-50 dark:hover:bg-[#141722] text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors cursor-pointer w-fit shadow-xs"
        >
          <RefreshCw className={clsx("w-3.5 h-3.5", isFetching && "animate-spin text-blue-500")} />
          <span>Sync Feed</span>
        </button>
      </div>

      {/* Control bar: Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border",
                filterType === tab.id
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                  : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={clsx(
                  "px-1.5 py-0.2 rounded text-[10px] tabular-nums font-mono",
                  filterType === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-[#161924] text-slate-500 dark:text-slate-400"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Search inside Activity */}
        <div className="relative shrink-0 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed activities..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loading />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="p-12 rounded-xl bg-white dark:bg-[#10121a] border border-dashed border-slate-200 dark:border-[#1d202d] text-center space-y-2">
          <SlidersHorizontal className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No activity records match this filter
          </p>
          <p className="text-xs text-slate-400">
            {searchQuery
              ? "Try clearing your search query to see more events."
              : "New updates posted to tasks will automatically stream in here."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#10121a] rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm divide-y divide-slate-100 dark:divide-[#1d202d]">
          {filteredActivities.map((act, index) => {
            const config = getActivityConfig(act.type);
            const dateObj = new Date(act.date || act.createdAt);
            const formattedDate = moment(dateObj).fromNow();
            const fullDate = moment(dateObj).format("MMM DD, YYYY · hh:mm A");

            return (
              <div
                key={`${act.taskId}-${index}`}
                className="py-4 px-4 sm:px-6 flex items-start gap-4 hover:bg-slate-50/60 dark:hover:bg-[#12151f]/50 transition-colors group"
              >
                {/* Author Avatar with micro action badge */}
                <div className="relative shrink-0 mt-0.5">
                  {act.author?.avatar ? (
                    <img
                      src={act.author.avatar}
                      alt={act.author.name || "Task Member"}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-[#1e2333] shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#181c28] dark:to-[#121520] border border-slate-200 dark:border-[#1e2333] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 font-mono shadow-xs">
                      {getInitials(act.author?.name || "Task Member")}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1e2333] flex items-center justify-center shadow-xs">
                    {config.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {act.author?.name}
                      </span>
                      {act.author?.title && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                          · {act.author.title}
                        </span>
                      )}
                      <span
                        className={clsx(
                          "font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded border tracking-wider",
                          config.badgeClass
                        )}
                      >
                        {config.label}
                      </span>
                    </div>

                    <span
                      title={fullDate}
                      className="font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums cursor-help"
                    >
                      {formattedDate}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {formatActivityText(act.activity)}
                  </p>

                  <div className="pt-0.5 flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">On task:</span>
                    <Link
                      to={`/task/${act.taskId}`}
                      className="font-semibold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                      <span className="truncate max-w-sm">{act.taskTitle}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
