import React, { Fragment, useEffect, useState } from "react";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { getInitials } from "../../utils";
import { MdCheck } from "react-icons/md";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice";

const UserList = ({ setTeam, team }) => {
  const { data } = useGetTeamListsQuery();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleChange = (el) => {
    setSelectedUsers(el);
    setTeam(el?.map((u) => u._id));
  };
  useEffect(() => {
    if (!data) return;

    if (team && team.length > 0) {
      const matched = team
        .map((t) => {
          const id = typeof t === "object" ? t?._id : t;
          return data.find((u) => u._id === id);
        })
        .filter(Boolean);
      setSelectedUsers(matched);
    } else {
      setSelectedUsers([]);
    }
  }, [data, team]);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        Assign Members:
      </span>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className="relative">
          <ListboxButton className="relative w-full cursor-default rounded-xl bg-slate-50/50 dark:bg-slate-800/60 pl-3.5 pr-10 text-left py-2.5 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[42px]">
            {selectedUsers.length === 0 ? (
              <span className="text-slate-400 dark:text-slate-500 text-sm">Select team members...</span>
            ) : (
              <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                {selectedUsers?.map((user) => user.name).join(", ")}
              </span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <BsChevronExpand
                className="h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="z-50 absolute mt-1.5 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-slate-800 p-1 text-sm shadow-xl ring-1 ring-black/5 dark:ring-white/10 border border-slate-200 dark:border-slate-700 focus:outline-none">
              {data?.map((user, index) => (
                <ListboxOption
                  key={user._id || index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-9 pr-4 rounded-lg transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-2.5 truncate ${
                          selected ? "font-semibold text-blue-600 dark:text-blue-400" : "font-normal"
                        }`}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-lg object-cover shadow-sm border border-slate-200 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-lg text-white dark:text-slate-900 bg-slate-900 dark:bg-white flex items-center justify-center font-mono text-[10px] font-bold shadow-sm">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{user.role}</span>
                        </div>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-blue-600 dark:text-blue-400">
                          <MdCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
