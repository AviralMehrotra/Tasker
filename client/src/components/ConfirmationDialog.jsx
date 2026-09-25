import { DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { AlertTriangle, RotateCcw, Trash2, HelpCircle } from "lucide-react";
import ModelWrapper from "./ModelWrapper";
import Button from "./Button";

export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const isRestore = type === "restore" || type === "restoreAll";

  return (
    <ModelWrapper open={open} setOpen={closeDialog}>
      <div className="py-2 w-full flex flex-col gap-4 items-center text-center">
        <DialogTitle as="h3">
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-transform",
              isRestore
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                : "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
            )}
          >
            {isRestore ? <RotateCcw size={22} /> : <Trash2 size={22} />}
          </div>
        </DialogTitle>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {isRestore ? "Restore Confirmation" : "Delete Confirmation"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {msg ?? "Are you sure you want to proceed with this action?"}
          </p>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row-reverse gap-2.5 w-full sm:w-auto">
          <Button
            type="button"
            className={clsx(
              "px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all justify-center cursor-pointer",
              isRestore
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-rose-600 hover:bg-rose-700"
            )}
            onClick={onClick}
            label={isRestore ? "Restore" : "Delete Permanently"}
          />

          <Button
            type="button"
            className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all justify-center cursor-pointer"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </ModelWrapper>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <ModelWrapper open={open} setOpen={closeDialog}>
      <div className="py-2 w-full flex flex-col gap-4 items-center text-center">
        <DialogTitle as="h3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-8 ring-blue-50 dark:ring-blue-950/20 shadow-lg">
            <HelpCircle size={28} />
          </div>
        </DialogTitle>

        <div className="space-y-1">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Change Account Status
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Are you sure you want to change the active status of this user account?
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row-reverse gap-3 w-full sm:w-auto">
          <Button
            type="button"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all justify-center"
            onClick={onClick}
            label="Confirm Change"
          />

          <Button
            type="button"
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all justify-center"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </ModelWrapper>
  );
}
