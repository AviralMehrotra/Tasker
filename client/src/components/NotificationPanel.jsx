import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { Bell, AlertCircle, MessageSquare, CheckCheck } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const viewHandler = (el) => {
    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const readHandler = async (type, id) => {
    try {
      await markAsRead({ type, id }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Popover className="relative">
        <PopoverButton className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative outline-none cursor-pointer">
          <Bell className="w-5 h-5" />
          {data?.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              {data.length > 9 ? "9+" : data.length}
            </span>
          )}
        </PopoverButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
        >
          <PopoverPanel className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-xl overflow-hidden text-sm">
            {() => (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1d202d]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Notifications</span>
                    {data?.length > 0 && (
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-semibold tabular-nums">
                        {data.length} new
                      </span>
                    )}
                  </div>
                  {data?.length > 0 && (
                    <button
                      onClick={() => readHandler("all", "")}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {data?.length > 0 ? (
                    data.slice(0, 8).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => viewHandler(item)}
                        className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          {item.notiType === "alert" ? (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                              {item.notiType}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                        <Bell className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        All caught up! No unread notifications.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  );
}
