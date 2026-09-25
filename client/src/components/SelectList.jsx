import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Fragment } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";

const SelectList = ({ lists, selected, setSelected, label }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-default rounded-xl bg-slate-50/50 dark:bg-slate-800/60 pl-3.5 pr-10 text-left py-2.5 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
            <span className="block truncate font-medium">{selected}</span>
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
              {lists.map((list, index) => (
                <ListboxOption
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-9 pr-4 rounded-lg transition-colors ${
                      active
                        ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-slate-700 dark:text-slate-200"
                    }`
                  }
                  value={list}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold text-blue-600 dark:text-blue-400" : "font-normal"
                        }`}
                      >
                        {list}
                      </span>
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
export default SelectList;
