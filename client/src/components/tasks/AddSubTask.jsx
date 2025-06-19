import { Dialog, DialogTitle } from "@headlessui/react";
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
    <>
      <ModelWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <DialogTitle
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            Add Subtasks
          </DialogTitle>
          <div className="mt-2 flex flex-col gap-6">
            <TextBox
              placeholder="Sub-Task title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className="flex items-center gap-4">
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
              <TextBox
                placeholder="Tag"
                type="text"
                name="tag"
                label="Tag"
                className="w-full rounded"
                register={register("tag", {
                  required: "Tag is required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="mt-8">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto rounded"
                label="Add Task"
              />

              <Button
                type="button"
                className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto rounded"
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

export default AddSubTask;
