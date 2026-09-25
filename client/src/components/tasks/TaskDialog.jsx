import React, { Fragment, useState } from "react";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiDuplicate } from "react-icons/hi";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import ConfirmationDialog from "../ConfirmationDialog";
import {
  useDuplicateTaskMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import clsx from "clsx";

const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

const TaskDialog = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();
  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message || "Task duplicated successfully");
      setOpenDialog(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to duplicate task");
    }
  };

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: task._id,
        isTrashed: "trash",
      }).unwrap();

      setOpenDialog(false);
      toast.success(res?.message || "Task moved to trash", {
        description: `"${task.title}" has been archived.`,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await deleteRestoreTask({
                id: task._id,
                actionType: "restore",
              }).unwrap();
              toast.success("Task restored successfully");
            } catch (restoreErr) {
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

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit Task",
      icon: <MdOutlineEdit className="mr-2 h-4 w-4" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-4 w-4" aria-hidden="true" />,
      onClick: () => setOpen(true),
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-4 w-4" aria-hidden="true" />,
      onClick: () => duplicateHandler(),
    },
  ];

  return (
    <>
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none cursor-pointer">
            <BsThreeDots className="w-4 h-4" />
          </MenuButton>
          <CustomTransition>
            <MenuItems className="absolute right-0 mt-1.5 w-48 origin-top-right rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl ring-1 ring-black/5 focus:outline-none p-1.5 z-50 text-xs font-semibold">
              <div className="space-y-0.5">
                {items.map((el) => (
                  <MenuItem key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={clsx(
                          "group flex w-full items-center rounded-xl px-2.5 py-2 text-xs transition-colors cursor-pointer",
                          active
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {el.icon}
                        <span>{el.label}</span>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>

              {user?.isAdmin && (
                <>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => deleteClicks()}
                        className={clsx(
                          "group flex w-full items-center rounded-xl px-2.5 py-2 text-xs transition-colors text-rose-600 dark:text-rose-400 cursor-pointer",
                          active ? "bg-rose-50 dark:bg-rose-950/40" : ""
                        )}
                      >
                        <RiDeleteBin6Line
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span>Delete Task</span>
                      </button>
                    )}
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </CustomTransition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
      />
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
