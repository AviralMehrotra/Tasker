import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  MessageSquare,
  Paperclip,
  CheckSquare,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "../utils";
import UserInfo from "./UserInfo";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import AddTask from "./tasks/AddTask";
import DueDateBadge from "./DueDateBadge";

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

const StageBadge = ({ stage }) => {
  const styles = {
    todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    "in progress": "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
    completed: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
  };

  return (
    <span
      className={clsx(
        "px-2 py-0.5 rounded text-[10px] font-mono font-medium capitalize border",
        styles[stage?.toLowerCase()] || styles.todo
      )}
    >
      {stage}
    </span>
  );
};

const Table = ({ tasks = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [trashTask] = useTrashTaskMutation();
  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: selected,
        isTrashed: "trash",
      }).unwrap();

      const trashedId = selected;
      setOpenDialog(false);
      toast.success(res?.message || "Task moved to trash", {
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await deleteRestoreTask({
                id: trashedId,
                actionType: "restore",
              }).unwrap();
              toast.success("Task restored successfully");
            } catch (err) {
              toast.error("Failed to restore task");
            }
          },
        },
        duration: 5000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to delete task");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-[#1d202d] text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th className="pb-3.5 pr-4 font-semibold">Task Title</th>
            <th className="pb-3.5 pr-4 font-semibold">Stage</th>
            <th className="pb-3.5 pr-4 font-semibold">Priority</th>
            <th className="pb-3.5 pr-4 font-semibold">Due Date</th>
            <th className="pb-3.5 pr-4 font-semibold">Progress / Meta</th>
            <th className="pb-3.5 pr-4 font-semibold">Team</th>
            <th className="pb-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-[#1d202d]">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#141722] transition-colors group"
              >
                <td className="py-3.5 pr-4">
                  <Link
                    to={`/task/${task._id}`}
                    className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 tracking-tight"
                  >
                    {task.title}
                  </Link>
                </td>

                <td className="py-3.5 pr-4">
                  <StageBadge stage={task.stage} />
                </td>

                <td className="py-3.5 pr-4">
                  <PriorityBadge priority={task.priority} />
                </td>

                <td className="py-3.5 pr-4">
                  <DueDateBadge date={task.date} stage={task.stage} />
                </td>

                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.activities?.length || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.assets?.length || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      <span>{task.subTasks?.length || 0}</span>
                    </span>
                  </div>
                </td>

                <td className="py-3.5 pr-4">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {task.team?.slice(0, 3).map((m, index) => (
                      <div
                        key={m._id || index}
                        className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#10121a] flex items-center justify-center text-[10px] font-mono font-bold text-white bg-slate-800 shadow-sm"
                      >
                        <UserInfo user={m} />
                      </div>
                    ))}
                    {task.team?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-[#10121a] flex items-center justify-center text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                        +{task.team.length - 3}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/task/${task._id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#181c2a] transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {user?.isAdmin && (
                      <>
                        <button
                          onClick={() => editClickHandler(task)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#181c2a] transition-colors cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteClicks(task._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-12 text-center text-xs font-mono text-slate-400 dark:text-slate-500">
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
      />
    </div>
  );
};

export default Table;
