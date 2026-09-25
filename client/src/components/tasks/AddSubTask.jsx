import { DialogTitle } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "../Button";
import Loading from "../Loader";
import ModelWrapper from "../ModelWrapper";
import TextBox from "../TextBox";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await addSbTask({ data, id }).unwrap();
      toast.success(res.message);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <ModelWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle
            as="h3"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Add Checklist Subtask
          </DialogTitle>
          <span className="text-xs text-slate-400 font-medium">
            Break tasks down into manageable steps
          </span>
        </div>

        <div className="space-y-4">
          <TextBox
            placeholder="e.g. Design responsive wireframes"
            type="text"
            name="title"
            label="Subtask Title"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextBox
              placeholder="Date"
              type="date"
              name="date"
              label="Target Date"
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />
            <TextBox
              placeholder="e.g. Design, Frontend, Review"
              type="text"
              name="tag"
              label="Tag / Category"
              register={register("tag", {
                required: "Tag is required!",
              })}
              error={errors.tag ? errors.tag.message : ""}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-3 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-6 py-2.5 shadow-sm shadow-blue-500/20 transition-all justify-center"
              label="Add Subtask"
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

export default AddSubTask;
