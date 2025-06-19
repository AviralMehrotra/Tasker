import { Dialog, DialogTitle } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { toast } from "sonner";
import ModelWrapper from "./ModelWrapper";
import TextBox from "./TextBox";
import Loading from "./Loader";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords doesn't match");
      return;
    }
    try {
      const res = await changeUserPassword(data).unwrap();
      toast.success("Your password has been changed successfully!");

      setTimeout(() => {
        setOpen(false);
      }, 1500);
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
            Change Passowrd
          </DialogTitle>
          <div className="mt-2 flex flex-col gap-6">
            <TextBox
              placeholder="New Passowrd"
              type="password"
              name="password"
              label="New Passowrd"
              className="w-full rounded"
              register={register("password", {
                required: "New Passowrd is required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <TextBox
              placeholder="Confirm New Passowrd"
              type="password"
              name="cpass"
              label="Confirm New Passowrd"
              className="w-full rounded"
              register={register("cpass", {
                required: "Confirm New Passowrd is required!",
              })}
              error={errors.cpass ? errors.cpass.message : ""}
            />
          </div>

          {isLoading ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse gap-2">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded"
                label="Save"
              />

              <button
                type="button"
                className="bg-gray-200 px-5 text-sm font-semibold text-gray-900 sm:w-auto rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </ModelWrapper>
    </>
  );
};

export default ChangePassword;
