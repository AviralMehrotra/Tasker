import React, { useState, memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  MessageSquare,
  Paperclip,
  CheckSquare,
  Calendar,
  AlertCircle,
  Plus,
} from "lucide-react";
import UserInfo from "./UserInfo";
import TaskDialog from "./tasks/TaskDialog";
import AddSubTask from "./tasks/AddSubTask";
import DueDateBadge from "./DueDateBadge";
import { useChangeSubTaskStatusMutation } from "../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { formatDate } from "../utils";

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

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const [changeSubtaskStatus] = useChangeSubTaskStatusMutation();

  const subTasks = task?.subTasks || [];
  const completedSubtasks = subTasks.filter((st) => st.isCompleted).length;
  const subtaskProgress =
    subTasks.length > 0 ? Math.round((completedSubtasks / subTasks.length) * 100) : 0;

  const handleToggleSubtask = async (subId, nextStatus) => {
    try {
      await changeSubtaskStatus({
        id: task._id,
        subId,
        isCompleted: nextStatus,
      }).unwrap();
    } catch (err) {
      toast.error("Failed to update subtask");
    }
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-[#12151f] rounded-xl border border-slate-200/90 dark:border-[#1e2333] p-4 shadow-sm hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-3 group">
        {/* Top Header: Priority & Actions */}
        <div className="flex items-center justify-between gap-2">
          <PriorityBadge priority={task?.priority} />
          {user?.isAdmin && <TaskDialog task={task} />}
        </div>

        {/* Task Title & Description */}
        <div className="space-y-1">
          <Link
            to={`/task/${task._id}`}
            className="block text-sm font-bold text-slate-900 dark:text-[#f4f4f6] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight"
          >
            {task?.title}
          </Link>
          {task?.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Subtask Progress Bar (Clickable to reveal checklist) */}
        {subTasks.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>
                  {completedSubtasks}/{subTasks.length} subtasks {showSubtasks ? "▲" : "▼"}
                </span>
              </span>
              <span className="tabular-nums font-semibold">{subtaskProgress}%</span>
            </button>
            <div className="w-full bg-slate-100 dark:bg-[#1c2030] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>

            {/* Micro Subtask Checklist */}
            {showSubtasks && (
              <div className="pt-2 pb-1 space-y-1 border-t border-slate-100 dark:border-[#1d202d] animate-in fade-in duration-150">
                {subTasks.map((st) => (
                  <div
                    key={st._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSubtask(st._id, !st.isCompleted);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#181c28] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={st.isCompleted}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer pointer-events-none"
                    />
                    <span
                      className={clsx(
                        "text-xs truncate flex-1 font-normal select-none",
                        st.isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-100 dark:border-[#1d202d] my-0.5" />

        {/* Footer: Date, Stats, and Team Avatars */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            {/* Due Date with Urgency Signals */}
            <DueDateBadge date={task?.date} stage={task?.stage} />

            {/* Attachments / Activities count */}
            {task?.assets?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] tabular-nums">
                <Paperclip className="w-3 h-3" />
                <span>{task.assets.length}</span>
              </span>
            )}

            {task?.activities?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] tabular-nums">
                <MessageSquare className="w-3 h-3" />
                <span>{task.activities.length}</span>
              </span>
            )}
          </div>

          {/* Team Avatar Stack */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {task?.team?.slice(0, 3).map((m, index) => (
              <div
                key={m._id || index}
                className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#12151f] flex items-center justify-center text-[9px] font-mono font-bold text-white bg-slate-800"
              >
                <UserInfo user={m} />
              </div>
            ))}
            {task?.team?.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-[#12151f] flex items-center justify-center text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                +{task.team.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Subtask Button for Admins */}
        {user?.isAdmin && (
          <button
            onClick={() => setOpenSubtask(true)}
            aria-label={`Add subtask to ${task?.title}`}
            className="w-full mt-0.5 py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-[#22273b] text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Subtask</span>
          </button>
        )}
      </div>

      <AddSubTask
        open={openSubtask}
        setOpen={setOpenSubtask}
        id={task?._id}
      />
    </>
  );
};

export default memo(TaskCard);
