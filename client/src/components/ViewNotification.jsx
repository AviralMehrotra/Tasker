import React from "react";
import { DialogTitle } from "@headlessui/react";
import Button from "./Button";
import ModelWrapper from "./ModelWrapper";

const ViewNotification = ({ open, setOpen, el }) => {
  return (
    <ModelWrapper open={open} setOpen={setOpen}>
      <div className="py-2 w-full flex flex-col gap-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <DialogTitle as="h3" className="font-bold text-lg text-slate-900 dark:text-white">
            {el?.task?.title || "Notification Details"}
          </DialogTitle>
          <span className="text-xs text-slate-400 capitalize">
            {el?.notiType || "Notice"}
          </span>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {el?.text}
        </p>

        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-semibold text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all justify-center"
            onClick={() => setOpen(false)}
            label="Dismiss"
          />
        </div>
      </div>
    </ModelWrapper>
  );
};

export default ViewNotification;
