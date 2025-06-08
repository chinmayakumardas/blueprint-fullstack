"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "blue",
  enableSystem = true,
  ...props
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark", "blue", "green", "red");

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    root.classList.add(color);
  }, [theme, color, enableSystem]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
    },
    color,
    setColor: (newColor) => {
      setColor(newColor);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};