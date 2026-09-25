import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmationDialog, {
  UserAction,
} from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import Loading from "../components/Loader";
import { Plus, Shield, User, Search, Edit3, Trash2, CheckCircle2, XCircle } from "lucide-react";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useGetTeamListsQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });
      refetch();
      toast.success(res?.data?.message || "User status updated successfully");
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message || "Action failed");
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);

      refetch();
      toast.success(res?.data?.message || "User deleted successfully");
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message || "Failed to delete user");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(id);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const filteredUsers = data?.filter((u) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.title?.toLowerCase().includes(query) ||
      u.role?.toLowerCase().includes(query)
    );
  });

  return isLoading ? (
    <div className="py-20 flex justify-center items-center">
      <Loading />
    </div>
  ) : (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title title="Team Members" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your workspace members, roles, and account access permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            label="Add Member"
            icon={<Plus size={18} />}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-4 py-2.5 shadow-sm shadow-blue-500/20 transition-all"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-[#10121a] rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm overflow-hidden">
        {/* Search Bar & Stats */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1d202d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search members by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Total Members:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#181c2a] text-slate-700 dark:text-slate-300 font-bold tabular-nums">
              {data?.length || 0}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1d202d] bg-slate-50/50 dark:bg-[#141722]/50 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3.5 px-6 font-semibold">Member</th>
                <th className="py-3.5 px-6 font-semibold">Title / Designation</th>
                <th className="py-3.5 px-6 font-semibold">Role</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1d202d] text-sm">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isAdmin = user.isAdmin || user.role?.toLowerCase() === "admin";
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#141722] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200 dark:border-slate-800"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                              {user.email || "No email available"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium text-xs">
                        {user.title || "Team Member"}
                      </td>

                      <td className="py-4 px-6">
                        <div
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border",
                            isAdmin
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          )}
                        >
                          {isAdmin ? <Shield size={11} /> : <User size={11} />}
                          <span className="capitalize">{user.role || (isAdmin ? "Admin" : "Member")}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => userStatusClick(user)}
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all",
                            user?.isActive
                              ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                              : "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                          )}
                        >
                          {user?.isActive ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            onClick={() => editClick(user)}
                            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="Edit User"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteClick(user?._id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    {searchQuery ? "No members match your search criteria." : "No team members found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected?._id || "new-user"}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </div>
  );
};

export default Users;
