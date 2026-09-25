import React, { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Layers,
  MessageSquare,
  PlayCircle,
  Tag,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

import Tabs from "../components/Tabs";
import Loading from "../components/Loader";
import Button from "../components/Button";
import { getInitials } from "../utils";
import {
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useChangeSubTaskStatusMutation,
} from "../redux/slices/api/taskApiSlice";

const PRIORITY_STYLES = {
  high: {
    bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    dot: "bg-rose-500",
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    dot: "bg-amber-500",
  },
  normal: {
    bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    dot: "bg-blue-500",
  },
  low: {
    bg: "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

const STAGE_STYLES = {
  todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono",
  "in progress": "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-mono",
  completed: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 font-mono",
};

const TABS = [
  { title: "Task Details", icon: <Layers size={18} /> },
  { title: "Activity Timeline", icon: <Clock size={18} /> },
];

const ACT_TYPES = [
  { id: "started", label: "Started", icon: <PlayCircle size={15} /> },
  { id: "in progress", label: "In Progress", icon: <Zap size={15} /> },
  { id: "commented", label: "Commented", icon: <MessageSquare size={15} /> },
  { id: "bug", label: "Bug Report", icon: <Flame size={15} /> },
  { id: "assigned", label: "Assigned", icon: <User size={15} /> },
  { id: "completed", label: "Completed", icon: <CheckCircle2 size={15} /> },
];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  const [selectedTab, setSelectedTab] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const task = data?.task;
  const [changeSubTaskStatus] = useChangeSubTaskStatusMutation();

  const handleToggleSubTask = async (subId, currentStatus) => {
    try {
      await changeSubTaskStatus({
        id,
        subId,
        isCompleted: !currentStatus,
      }).unwrap();
      refetch();
      toast.success("Subtask status updated");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update subtask");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Task not found
        </h2>
        <Button
          label="Back to Tasks"
          onClick={() => navigate("/tasks")}
          className="mt-4 bg-blue-600 text-white rounded-xl px-5 py-2"
        />
      </div>
    );
  }

  const completedSubtasks = task?.subTasks?.filter((st) => st.isCompleted)?.length || 0;
  const totalSubtasks = task?.subTasks?.length || 0;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityStyle =
    PRIORITY_STYLES[task?.priority?.toLowerCase()] || PRIORITY_STYLES.normal;

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <div
              className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize tracking-wide",
                priorityStyle.bg
              )}
            >
              <span className={clsx("w-2 h-2 rounded-full", priorityStyle.dot)} />
              <span>{task?.priority} Priority</span>
            </div>

            {/* Stage Badge */}
            <div
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-bold capitalize",
                STAGE_STYLES[task?.stage?.toLowerCase()] ||
                  "bg-slate-100 text-slate-700"
              )}
            >
              {task?.stage}
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {task?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-slate-400" />
              <span>Created {moment(task?.date || task?.createdAt).format("MMM D, YYYY")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-slate-400" />
              <span>{task?.team?.length || 0} Assignees</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-slate-400" />
              <span>{completedSubtasks}/{totalSubtasks} Subtasks done ({progressPercent}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} setSelected={setSelectedTab}>
        {selectedTab === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details, Description, Links, Subtasks */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description Card */}
              {task?.description && (
                <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Description
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Links Card */}
              {task?.links && (Array.isArray(task.links) ? task.links.length > 0 : task.links) && (
                <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Relevant Links & References
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(task.links)
                      ? task.links
                      : task.links.split(",")
                    ).map((link, idx) => {
                      const trimmed = link.trim();
                      if (!trimmed) return null;
                      const href =
                        trimmed.startsWith("http://") || trimmed.startsWith("https://")
                          ? trimmed
                          : `https://${trimmed}`;
                      return (
                        <a
                          key={idx}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors"
                        >
                          <ExternalLink size={13} />
                          <span className="truncate max-w-xs">{trimmed}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Tasks Card */}
              <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Checklist / Subtasks
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Click any subtask to toggle its completion status
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {completedSubtasks} / {totalSubtasks}
                  </span>
                </div>

                {/* Progress bar */}
                {totalSubtasks > 0 && (
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}

                <div className="space-y-2.5 pt-2">
                  {task?.subTasks?.length > 0 ? (
                    task.subTasks.map((sub, idx) => (
                      <div
                        key={sub._id || idx}
                        onClick={() => handleToggleSubTask(sub._id, sub.isCompleted)}
                        className={clsx(
                          "flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer group",
                          sub.isCompleted
                            ? "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800"
                            : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm"
                        )}
                      >
                        <div
                          className={clsx(
                            "w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0",
                            sub.isCompleted
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-500"
                          )}
                        >
                          {sub.isCompleted && <CheckCircle2 size={15} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={clsx(
                              "text-sm font-medium transition-colors truncate",
                              sub.isCompleted
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-800 dark:text-slate-200"
                            )}
                          >
                            {sub.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {sub.date && (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Calendar size={11} />
                                {moment(sub.date).format("MMM D, YYYY")}
                              </span>
                            )}
                            {sub.tag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                                <Tag size={10} />
                                {sub.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-slate-400">
                      No subtasks added for this task yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Team & Assets */}
            <div className="space-y-6">
              {/* Assigned Team */}
              <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Assigned Team ({task?.team?.length || 0})
                  </h3>
                </div>

                <div className="space-y-3">
                  {task?.team?.length > 0 ? (
                    task.team.map((member, idx) => (
                      <div
                        key={member._id || idx}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#141722] transition-colors"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {member.title || member.role || "Member"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 py-2">No assignees yet.</p>
                  )}
                </div>
              </div>

              {/* Task Assets Gallery */}
              <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Attached Assets ({task?.assets?.length || 0})
                </h3>

                {task?.assets?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {task.assets.map((asset, index) => (
                      <div
                        key={index}
                        onClick={() => setLightboxImage(asset)}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video cursor-pointer"
                      >
                        <img
                          src={asset}
                          alt={`Asset ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded-lg backdrop-blur-sm">
                            View Image
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 py-2">No assets attached to this task.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Timeline / Activity Section */
          <Activities
            activity={task?.activities}
            id={id}
            refetch={refetch}
          />
        )}
      </Tabs>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-sm transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImage}
              alt="Asset Fullscreen"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Activities = ({ activity = [], id, refetch }) => {
  const [selectedType, setSelectedType] = useState(ACT_TYPES[2].id); // default: commented
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.warning("Please type a message before submitting");
      return;
    }
    try {
      const res = await postActivity({
        data: {
          type: selectedType,
          activity: text,
        },
        id,
      }).unwrap();
      setText("");
      toast.success(res?.message || "Activity logged successfully");
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to log activity");
    }
  };

  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return <PlayCircle className="text-blue-500" size={18} />;
      case "in progress":
        return <Zap className="text-amber-500" size={18} />;
      case "bug":
        return <Flame className="text-rose-500" size={18} />;
      case "completed":
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "assigned":
        return <User className="text-blue-500" size={18} />;
      case "commented":
      default:
        return <MessageSquare className="text-slate-500" size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Timeline List (Left 2 cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Activity Stream ({activity?.length || 0})
          </h3>
        </div>

        {activity && activity.length > 0 ? (
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {activity.map((item, index) => (
              <div key={item._id || index} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm">
                  {getIconForType(item.type)}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item?.by?.name || "Team Member"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize font-medium">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {moment(item.date).fromNow()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {item.activity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
            No activity logged yet. Be the first to add an update!
          </div>
        )}
      </div>

      {/* Post Activity Form (Right 1 col) */}
      <div className="bg-white dark:bg-[#10121a] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-[#1d202d] shadow-sm space-y-5 h-fit">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Post Update
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Action Type:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ACT_TYPES.map((type) => {
              const active = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={clsx(
                    "flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all border text-left",
                    active
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                >
                  {type.icon}
                  <span className="truncate">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Message:
          </label>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share details, updates, or leave a note..."
            className="w-full bg-slate-50/50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {isLoading ? (
          <div className="py-2">
            <Loading />
          </div>
        ) : (
          <Button
            type="button"
            label="Post Update"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all justify-center"
          />
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
