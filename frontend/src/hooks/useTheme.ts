import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
    }
    return "dark"; // Default to dark for cinematic portfolio
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (newTheme: Theme) => {
      root.classList.remove("light", "dark");

      if (newTheme === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(systemDark ? "dark" : "light");
      } else {
        root.classList.add(newTheme);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, setTheme };
};

export default useTheme;
