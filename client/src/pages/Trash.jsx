import React, { useState } from "react";
import clsx from "clsx";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {
  useDeleteRestoreTaskMutation,
  useGetAllTaskQuery,
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import { toast } from "sonner";
import {
  RotateCcw,
  Trash2,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Layers,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
  medium: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  normal: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  low: "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const STAGE_STYLES = {
  todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono",
  "in progress": "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-mono",
  completed: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 font-mono",
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const deleteRestoreHandler = async () => {
    try {
      let res = null;

      switch (type) {
        case "delete":
          res = await deleteRestoreTask({
            id: selected,
            actionType: "delete",
          }).unwrap();
          break;
        case "deleteAll":
          res = await deleteRestoreTask({
            id: "",
            actionType: "deleteAll",
          }).unwrap();
          break;
        case "restore":
          res = await deleteRestoreTask({
            id: selected,
            actionType: "restore",
          }).unwrap();
          break;
        case "restoreAll":
          res = await deleteRestoreTask({
            id: "",
            actionType: "restoreAll",
          }).unwrap();
          break;
      }

      toast.success(res?.message || "Operation completed successfully");

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Operation failed");
    }
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg(
      "This operation will permanently delete ALL trashed tasks. This cannot be undone."
    );
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg(
      "This operation will permanently delete this task. Are you sure you want to proceed?"
    );
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg(
      "This operation will restore ALL trashed tasks back to their respective boards."
    );
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setType("restore");
    setSelected(id);
    setMsg(
      "This operation will restore this task back to your active tasks list."
    );
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const tasksCount = data?.tasks?.length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title title="Trash Bin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Archived and deleted tasks. Restore them to active boards or permanently purge.
          </p>
        </div>

        {tasksCount > 0 && (
          <div className="flex items-center gap-3">
            <Button
              label="Restore All"
              icon={<RotateCcw size={16} />}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl px-4 py-2.5 transition-all"
              onClick={restoreAllClick}
            />
            <Button
              label="Empty Trash"
              icon={<Trash2 size={16} />}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm shadow-rose-500/20 transition-all"
              onClick={deleteAllClick}
            />
          </div>
        )}
      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
        <AlertTriangle size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          Items located in the Trash Bin can either be restored to your boards or permanently removed from database storage.
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-[#10121a] rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1d202d] bg-slate-50/50 dark:bg-[#141722]/50 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3.5 px-6 font-semibold">Task Title</th>
                <th className="py-3.5 px-6 font-semibold">Priority</th>
                <th className="py-3.5 px-6 font-semibold">Previous Stage</th>
                <th className="py-3.5 px-6 font-semibold">Archived On</th>
                <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {tasksCount > 0 ? (
                data.tasks.map((task) => {
                  const priorityClass =
                    PRIORITY_STYLES[task.priority?.toLowerCase()] ||
                    PRIORITY_STYLES.normal;
                  const stageClass =
                    STAGE_STYLES[task.stage?.toLowerCase()] ||
                    "bg-slate-100 text-slate-700";

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                            <Layers size={16} />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {task.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={clsx(
                            "inline-block px-2.5 py-1 rounded-lg text-xs font-bold capitalize border",
                            priorityClass
                          )}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={clsx(
                            "inline-block px-2.5 py-1 rounded-full text-xs font-bold capitalize",
                            stageClass
                          )}
                        >
                          {task.stage}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>{new Date(task.date || task.updatedAt).toDateString()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            onClick={() => restoreClick(task._id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                            title="Restore Task"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => deleteClick(task._id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Permanently Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Trash bin is empty
                      </p>
                      <p className="text-xs text-slate-400">
                        No deleted or trashed tasks at the moment.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </div>
  );
};

export default Trash;
