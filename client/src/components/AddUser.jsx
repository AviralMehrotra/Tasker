import { Dialog, DialogTitle } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ModelWrapper from "./ModelWrapper";
import TextBox from "./TextBox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { useEffect } from "react";

const AddUser = ({ open, setOpen, userData }) => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name || "",
        title: userData?.title || "",
        email: userData?.email || "",
        role: userData?.role || "",
      });
    } else {
      reset({
        name: "",
        title: "",
        email: "",
        role: "",
      });
    }
  }, [userData, open, reset]);

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const res = await updateUser({ ...data, _id: userData._id }).unwrap();
        toast.success(res?.message || "User profile updated successfully");
        if (userData?._id === user?._id) {
          dispatch(setCredentials({ ...user, ...res?.user }));
        }
      } else {
        const res = await addNewUser({
          ...data,
          password: data?.email,
        }).unwrap();
        toast.success("New user added successfully");
      }
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Failed to process user action");
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
            {userData ? "Update Member Profile" : "Add Workspace Member"}
          </DialogTitle>
          <span className="text-xs text-slate-400 font-medium">
            {userData ? "Edit member permissions and profile" : "Invite a user to the workspace"}
          </span>
        </div>

        <div className="space-y-4">
          <TextBox
            placeholder="e.g. Jane Doe"
            type="text"
            name="name"
            label="Full Name"
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />
          <TextBox
            placeholder="e.g. Lead Product Designer"
            type="text"
            name="title"
            label="Title / Designation"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />
          <TextBox
            placeholder="e.g. jane@company.com"
            type="email"
            name="email"
            label="Email Address"
            register={register("email", {
              required: "Email address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />

          <TextBox
            placeholder="e.g. Admin, Designer, Developer"
            type="text"
            name="role"
            label="Role"
            register={register("role", {
              required: "User role is required!",
            })}
            error={errors.role ? errors.role.message : ""}
          />
        </div>

        {isLoading || isUpdating ? (
          <div className="py-3 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-6 py-2.5 shadow-sm shadow-blue-500/20 transition-all justify-center"
              label={userData ? "Save Changes" : "Create User"}
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

export default AddUser;
