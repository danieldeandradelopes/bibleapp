"use client";

import { useState } from "react";

type ThemeMode = "light" | "dark";

function getPreferredTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  const current = document.documentElement.dataset.theme;
  if (current === "dark" || current === "light") {
    return current;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return getPreferredTheme();
  });

  function toggleTheme(): void {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("bibleapp-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button className="button-secondary" type="button" onClick={toggleTheme}>
      {theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
    </button>
  );
}
