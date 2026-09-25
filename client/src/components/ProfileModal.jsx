import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  User,
  ShieldCheck,
  Sliders,
  X,
  Lock,
  Eye,
  EyeOff,
  Check,
  Mail,
  Briefcase,
  KeyRound,
  Sun,
  Moon,
  Copy,
  LogOut,
  Sparkles,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "../redux/slices/api/userApiSlice";
import { setCredentials, logout } from "../redux/slices/authSlice";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { useTheme } from "../utils/ThemeContext";
import { getInitials } from "../utils";
import clsx from "clsx";

// Curated modern vector avatar presets
const AVATAR_PRESETS = [
  {
    name: "Felix",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
  },
  {
    name: "Aneka",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka",
  },
  {
    name: "Aiden",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Aiden",
  },
  {
    name: "Sara",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Sara",
  },
  {
    name: "Oliver",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver",
  },
  {
    name: "Jasper",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=Jasper",
  },
];

// Client-side canvas image optimizer (max 256x256, compressed WebP/JPEG ~15-30KB)
const compressImage = (file, maxWidth = 256, maxHeight = 256, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file must be an image."));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl;
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ProfileModal = ({ open, setOpen, initialTab = "profile" }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutations
  const [updateUser, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [logoutUser] = useLogoutMutation();

  // Form for Profile
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  // Form for Password
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassValue = watchPassword("newPassword", "");
  const confirmPassValue = watchPassword("confirmPassword", "");

  // Sync user data to form & global trigger
  useEffect(() => {
    const handleOpenGlobal = (e) => {
      setOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };

    window.addEventListener("open-profile-settings", handleOpenGlobal);
    return () => window.removeEventListener("open-profile-settings", handleOpenGlobal);
  }, [setOpen]);

  useEffect(() => {
    if (user && open) {
      resetProfile({
        name: user?.name || "",
        title: user?.title || "",
        email: user?.email || "",
      });
      resetPassword({
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarPreview(user?.avatar || "");
      setActiveTab(initialTab);
    }
  }, [user, open, resetProfile, resetPassword, initialTab]);

  // File upload change handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Please select an image under 10MB.");
      return;
    }

    try {
      setIsOptimizing(true);
      const compressedDataUrl = await compressImage(file, 256, 256, 0.85);
      setAvatarPreview(compressedDataUrl);
      toast.success("Photo uploaded & optimized! Click 'Save Changes' to apply.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process image. Please try another file.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Remove avatar handler
  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Avatar reset to initials. Click 'Save Changes' to apply.");
  };

  // Handle Profile Update
  const onProfileSubmit = async (formData) => {
    try {
      const res = await updateUser({
        _id: user?._id,
        name: formData.name.trim(),
        title: formData.title.trim(),
        role: user?.role,
        avatar: avatarPreview,
      }).unwrap();

      const updatedData = res?.user || {
        ...user,
        name: formData.name,
        title: formData.title,
        avatar: avatarPreview,
      };
      dispatch(setCredentials({ ...user, ...updatedData }));
      toast.success(res?.message || "Profile updated successfully");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update profile");
    }
  };

  // Handle Password Update
  const onPasswordSubmit = async (formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    try {
      const res = await changePassword({
        password: formData.newPassword,
      }).unwrap();

      toast.success(res?.message || "Password updated successfully");
      resetPassword();
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to change password");
    }
  };

  // Copy Member ID
  const handleCopyId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      toast.success("User ID copied to clipboard");
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      setOpen(false);
      window.location.href = "/login";
    } catch (err) {
      dispatch(logout());
      setOpen(false);
      window.location.href = "/login";
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 w-full" onClose={() => setOpen(false)}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-xl transform rounded-2xl bg-white dark:bg-[#0c0e17] text-left shadow-2xl border border-slate-200 dark:border-[#1e2333] transition-all overflow-hidden">
                {/* Modal Top Header / Banner */}
                <div className="relative px-6 pt-6 pb-5 border-b border-slate-100 dark:border-[#161926] bg-slate-50/50 dark:bg-[#0a0c14]">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161926] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-4">
                    {/* User Avatar / Initials */}
                    <div className="relative shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={user?.name || "Avatar"}
                          className="w-14 h-14 rounded-2xl object-cover shadow-md ring-2 ring-blue-500/30 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-lg shadow-md ring-2 ring-blue-500/30">
                          {getInitials(user?.name)}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0e17]" title="Active Account" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <DialogTitle as="h2" className="text-lg font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
                          {user?.name}
                        </DialogTitle>
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border",
                            user?.isAdmin
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                              : "bg-slate-100 dark:bg-[#181c28] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                          )}
                        >
                          {user?.isAdmin ? "Workspace Admin" : "Team Member"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                      {user?.title && (
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {user?.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Segmented Tabs */}
                  <div className="flex items-center gap-1.5 mt-5 bg-slate-200/60 dark:bg-[#141724] p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeTab === "profile"
                          ? "bg-white dark:bg-[#0c0e17] text-slate-900 dark:text-white shadow-xs font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>General Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("security")}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeTab === "security"
                          ? "bg-white dark:bg-[#0c0e17] text-slate-900 dark:text-white shadow-xs font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Security & Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("preferences")}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        activeTab === "preferences"
                          ? "bg-white dark:bg-[#0c0e17] text-slate-900 dark:text-white shadow-xs font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Preferences</span>
                    </button>
                  </div>
                </div>

                {/* Modal Body / Active Tab Content */}
                <div className="p-6">
                  {/* TAB 1: GENERAL PROFILE */}
                  {activeTab === "profile" && (
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                      {/* Avatar Upload & Customization Section */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                          Profile Photo
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-[#1e2333] bg-slate-50/60 dark:bg-[#10121a]">
                          {/* Image preview with hover camera overlay */}
                          <div className="relative group shrink-0 self-center sm:self-auto">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt={user?.name || "Avatar"}
                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm border border-slate-200 dark:border-slate-800"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-xl shadow-sm ring-2 ring-blue-500/30">
                                {getInitials(user?.name)}
                              </div>
                            )}

                            {/* Camera overlay button */}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isOptimizing}
                              className="absolute inset-0 rounded-2xl bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                              title="Upload new image"
                            >
                              <Camera className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] font-semibold uppercase tracking-wider">Change</span>
                            </button>
                          </div>

                          <div className="flex-1 min-w-0 space-y-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isOptimizing}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{isOptimizing ? "Optimizing..." : "Upload Photo"}</span>
                              </button>

                              {avatarPreview && (
                                <button
                                  type="button"
                                  onClick={handleRemoveAvatar}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#22273b] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              PNG, JPG, or WEBP. Automatically cropped and optimized to 256×256 px.
                            </p>

                            {/* Quick Avatar Presets */}
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                                Or choose a curated preset:
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                {AVATAR_PRESETS.map((preset, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setAvatarPreview(preset.url)}
                                    className={clsx(
                                      "w-8 h-8 rounded-xl overflow-hidden border transition-all cursor-pointer hover:scale-105",
                                      avatarPreview === preset.url
                                        ? "ring-2 ring-blue-500 border-transparent scale-105 shadow-sm"
                                        : "border-slate-200 dark:border-[#22273b] hover:border-blue-400 opacity-80 hover:opacity-100"
                                    )}
                                    title={preset.name}
                                  >
                                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Your full name"
                            {...registerProfile("name", {
                              required: "Full name is required",
                            })}
                            className="w-full bg-slate-50 dark:bg-[#12151f] px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#10121a] transition-colors"
                          />
                        </div>
                        {profileErrors.name && (
                          <span className="text-xs text-rose-500 mt-1 block">
                            {profileErrors.name.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Professional Title / Position
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Frontend Architect, Product Lead"
                          {...registerProfile("title")}
                          className="w-full bg-slate-50 dark:bg-[#12151f] px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#10121a] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full bg-slate-100 dark:bg-[#151824] px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-500 dark:text-slate-400 text-xs sm:text-sm outline-none cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-400 bg-slate-200/80 dark:bg-[#1c2030] px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Email is your primary workspace login credential and cannot be changed here.
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#161926]">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161926] cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isUpdatingProfile ? "Saving Changes..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 2: SECURITY & PASSWORD (INTEGRATED) */}
                  {activeTab === "security" && (
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 flex items-start gap-3">
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                            Update Account Password
                          </p>
                          <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                            Choose a strong password with at least 6 characters to protect your task activities.
                          </p>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...registerPassword("newPassword", {
                              required: "New password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                              },
                            })}
                            className="w-full bg-slate-50 dark:bg-[#12151f] pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#10121a] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <span className="text-xs text-rose-500 mt-1 block">
                            {passwordErrors.newPassword.message}
                          </span>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            {...registerPassword("confirmPassword", {
                              required: "Please confirm your password",
                            })}
                            className="w-full bg-slate-50 dark:bg-[#12151f] pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-[#f4f4f6] text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#10121a] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <span className="text-xs text-rose-500 mt-1 block">
                            {passwordErrors.confirmPassword.message}
                          </span>
                        )}
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#10121a] border border-slate-200/80 dark:border-[#1d202d] space-y-1 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]",
                              newPassValue.length >= 6
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                            )}
                          >
                            ✓
                          </span>
                          <span
                            className={clsx(
                              newPassValue.length >= 6
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-slate-500"
                            )}
                          >
                            At least 6 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]",
                              newPassValue && newPassValue === confirmPassValue
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                            )}
                          >
                            ✓
                          </span>
                          <span
                            className={clsx(
                              newPassValue && newPassValue === confirmPassValue
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-slate-500"
                            )}
                          >
                            Passwords match exactly
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#161926]">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#161926] cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={
                            isChangingPassword ||
                            newPassValue.length < 6 ||
                            newPassValue !== confirmPassValue
                          }
                          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isChangingPassword ? "Updating Password..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 3: WORKSPACE PREFERENCES */}
                  {activeTab === "preferences" && (
                    <div className="space-y-4">
                      {/* Theme Toggle Option */}
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1e2333] bg-slate-50/50 dark:bg-[#12151f] flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Interface Appearance
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Switch between Obsidian dark theme and crisp daylight mode.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleTheme}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#22273b] bg-white dark:bg-[#181c2a] text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-blue-500 cursor-pointer transition-all shadow-xs"
                        >
                          {isDark ? (
                            <>
                              <Moon className="w-3.5 h-3.5 text-blue-400" />
                              <span>Obsidian Dark</span>
                            </>
                          ) : (
                            <>
                              <Sun className="w-3.5 h-3.5 text-amber-500" />
                              <span>Light Mode</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Technical Identifier */}
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1e2333] bg-slate-50/50 dark:bg-[#12151f] space-y-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Member ID Identifier
                        </p>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-[#1d202d] text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span className="truncate">{user?._id || "N/A"}</span>
                          <button
                            type="button"
                            onClick={handleCopyId}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#181c28] text-slate-400 hover:text-blue-500 cursor-pointer ml-2"
                            title="Copy ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Sign Out Card */}
                      <div className="p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            Active Session
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            End your current session across this browser.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfileModal;
