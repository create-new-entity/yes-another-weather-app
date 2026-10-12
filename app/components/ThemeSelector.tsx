"use client";

import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme, type Theme } from "./ThemeProvider";

const options = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] satisfies {
  value: Theme;
  label: string;
  Icon: typeof Monitor;
}[];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
    >
      {options.map(({ value, label, Icon }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isSelected}
            onClick={() => setTheme(value)}
            className={`group relative rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
              isSelected
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />

            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
