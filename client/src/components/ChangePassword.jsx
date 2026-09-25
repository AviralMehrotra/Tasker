import { DialogTitle } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { toast } from "sonner";
import ModelWrapper from "./ModelWrapper";
import TextBox from "./TextBox";
import Loading from "./Loader";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { Lock } from "lucide-react";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords do not match");
      return;
    }
    try {
      const res = await changeUserPassword(data).unwrap();
      toast.success(res?.message || "Password changed successfully!");
      reset();
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to change password");
    }
  };

  return (
    <ModelWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <DialogTitle
              as="h3"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Change Password
            </DialogTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your new credentials below
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <TextBox
            placeholder="Enter new password"
            type="password"
            name="password"
            label="New Password"
            register={register("password", {
              required: "New password is required!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password ? errors.password.message : ""}
          />
          <TextBox
            placeholder="Confirm new password"
            type="password"
            name="cpass"
            label="Confirm New Password"
            register={register("cpass", {
              required: "Confirm password is required!",
            })}
            error={errors.cpass ? errors.cpass.message : ""}
          />
        </div>

        {isLoading ? (
          <div className="py-4">
            <Loading />
          </div>
        ) : (
          <div className="pt-2 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all justify-center"
              label="Update Password"
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

export default ChangePassword;
