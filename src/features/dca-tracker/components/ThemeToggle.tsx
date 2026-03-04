"use client";

import type { FC } from "react";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle: FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-6 rounded-full bg-dca-card border border-dca-border cursor-pointer transition-colors hover:border-dca-muted flex items-center px-0.5"
      aria-label="Toggle theme"
    >
      {/* Sun icon */}
      <span
        className={`absolute left-1 text-[12px] transition-opacity ${theme === "light" ? "opacity-100" : "opacity-30"}`}
      >
        ☀️
      </span>
      {/* Moon icon */}
      <span
        className={`absolute right-1 text-[12px] transition-opacity ${theme === "dark" ? "opacity-100" : "opacity-30"}`}
      >
        🌙
      </span>
      {/* Toggle ball */}
      <div
        className={`w-4 h-4 rounded-full bg-dca-cyan transition-transform duration-200 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};
