import React from "react";
import clsx from "clsx";

const TextBox = React.forwardRef(
  (
    { type, placeholder, label, className, labelClass, register, name, error },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={name}
            className={clsx(
              "text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300",
              labelClass
            )}
          >
            {label}
          </label>
        )}

        <div>
          <input
            type={type || "text"}
            name={name}
            id={name}
            placeholder={placeholder}
            ref={ref}
            className={clsx(
              "w-full bg-slate-50 dark:bg-[#12151f] px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e2333] text-slate-900 dark:text-[#f4f4f6] placeholder-slate-400 dark:placeholder-slate-500 outline-none text-xs sm:text-sm transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-[#10121a] focus:ring-1 focus:ring-blue-500",
              className
            )}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

TextBox.displayName = "TextBox";

export default TextBox;
