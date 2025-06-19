import React, { useState } from "react";
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

const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const url = import.meta.env.CLOUDINARY_URL;
  const preset = import.meta.env.CLOUDINARY_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  return fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.secure_url) {
        uploadedFileURLs.push(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    });
};

const AddTask = ({ open, setOpen, task }) => {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || Lists[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || Priority[2]
  );

  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const URLS = task?.assets ? [...task.assets] : [];

  const submitHandler = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        ...data,
        assets: [...URLS, ...uploadedFileURLs],
        team,
        stage,
        priority,
      };
      console.log(data, newData);
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModelWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogTitle
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </DialogTitle>

          <div className="mt-2 flex flex-col gap-6">
            <TextBox
              placeholder="Task title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <UserList setTeam={setTeam} team={team} />
            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={Lists}
                selected={stage}
                setSelected={setStage}
              />
              <SelectList
                label="Priority Level"
                lists={Priority}
                selected={priority}
                setSelected={setPriority}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <TextBox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="w-full">
              <p>Task Description</p>
              <textarea
                name="description"
                {...register("description")}
                className="w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
            dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
            text-gray-900 outline-none text-base focus:ring-2
            ring-blue-300"
              ></textarea>
            </div>

            <div className="w-full">
              <p>
                Add Links{" "}
                <span className="text- text-gray-600">
                  seperated by comma (,)
                </span>
              </p>
              <textarea
                name="links"
                {...register("links")}
                className="w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
            dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
            text-gray-900 outline-none text-base focus:ring-2
            ring-blue-300"
              ></textarea>
            </div>
          </div>

          {isLoading || isUpdating || uploading ? (
            <div className="py-4">
              <Loading />
            </div>
          ) : (
            <div className="bg-gray-50 mt-6 mb-4 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModelWrapper>
    </>
  );
};

export default AddTask;
