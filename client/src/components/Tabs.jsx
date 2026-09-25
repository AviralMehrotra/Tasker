import React from "react";
import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import clsx from "clsx";

const Tabs = ({ tabs, setSelected, children }) => {
  return (
    <div className="w-full">
      <TabGroup>
        <TabList className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] w-fit">
          {tabs.map((tab, index) => (
            <Tab
              key={index + tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                clsx(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 outline-none",
                  selected
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/30"
                )
              }
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.title}</span>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="w-full mt-4">{children}</TabPanels>
      </TabGroup>
    </div>
  );
};

export default Tabs;
