import React, { useState, useEffect } from "react";
import ModelWrapper from "../ModelWrapper";
import { DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import TextBox from "../TextBox";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import Loading from "../Loader";
import { toast } from "sonner";

const Lists = ["ToDo", "In Progress", "Completed"];
const Priority = ["High", "Medium", "Normal", "Low"];

const uploadFile = async (file) => {
  const url =
    import.meta.env.VITE_CLOUDINARY_URL || import.meta.env.CLOUDINARY_URL;
  const preset =
    import.meta.env.VITE_CLOUDINARY_PRESET || import.meta.env.CLOUDINARY_PRESET;

  if (!url || !preset) {
    throw new Error(
      "Cloudinary upload configuration missing. Please verify VITE_CLOUDINARY_URL."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (data.secure_url) {
    return data.secure_url;
  }
  throw new Error(data?.error?.message || "File upload failed");
};

const AddTask = ({ open, setOpen, task }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(Lists[0]);
  const [priority, setPriority] = useState(Priority[2]);

  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      reset({
        title: task?.title || "",
        date: dateFormatter(task?.date || new Date()),
        description: task?.description || "",
        links: Array.isArray(task?.links)
          ? task.links.join(", ")
          : task?.links || "",
      });
      setTeam(task?.team || []);
      setStage(task?.stage ? task.stage.toUpperCase() : Lists[0]);
      setPriority(task?.priority ? task.priority.toUpperCase() : Priority[2]);
    } else {
      reset({
        title: "",
        date: dateFormatter(new Date()),
        description: "",
        links: "",
      });
      setTeam([]);
      setStage(Lists[0]);
      setPriority(Priority[2]);
    }
    setAssets([]);
  }, [task, open, reset]);

  const URLS = task?.assets ? [...task.assets] : [];

  const submitHandler = async (data) => {
    const uploadedUrls = [];
    if (assets && assets.length > 0) {
      setUploading(true);
      try {
        for (const file of Array.from(assets)) {
          const secureUrl = await uploadFile(file);
          if (secureUrl) uploadedUrls.push(secureUrl);
        }
      } catch (error) {
        setUploading(false);
        toast.error(error.message || "Upload failed");
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        ...data,
        assets: [...URLS, ...uploadedUrls],
        team: team.map((u) => (typeof u === "object" ? u._id : u)),
        stage: stage.toLowerCase(),
        priority: priority.toLowerCase(),
      };

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res?.message || "Task saved successfully.");

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to save task");
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModelWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle
            as="h3"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <span className="text-xs text-slate-400 font-medium">
            {task ? "Update existing task details" : "Add a task to your workspace"}
          </span>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <TextBox
            placeholder="e.g. Redesign Landing Page"
            type="text"
            name="title"
            label="Task Title"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectList
              label="Stage"
              lists={Lists}
              selected={stage}
              setSelected={setStage}
            />
            <SelectList
              label="Priority"
              lists={Priority}
              selected={priority}
              setSelected={setPriority}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextBox
              placeholder="Due Date"
              type="date"
              name="date"
              label="Due Date"
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Attachments ({assets.length || URLS.length} files)
              </span>
              <label
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer transition-colors"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple
                />
                <BiImages size={18} className="text-blue-500" />
                <span>{assets.length > 0 ? `${assets.length} selected` : "Upload Images"}</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Task Description
            </span>
            <textarea
              rows={3}
              name="description"
              placeholder="Provide context, details, or instructions..."
              {...register("description")}
              className="w-full bg-slate-50/50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Reference Links <span className="text-slate-400 normal-case">(comma separated)</span>
            </span>
            <textarea
              rows={2}
              name="links"
              placeholder="https://figma.com/..., https://github.com/..."
              {...register("links")}
              className="w-full bg-slate-50/50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {isLoading || isUpdating || uploading ? (
          <div className="py-3 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              label={task ? "Update Task" : "Create Task"}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-6 py-2.5 shadow-sm shadow-blue-500/20 transition-all justify-center"
            />

            <Button
              type="button"
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all justify-center"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModelWrapper>
  );
};

export default AddTask;
