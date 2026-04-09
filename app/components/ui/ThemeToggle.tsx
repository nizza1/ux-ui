import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Read current theme from html element
    const currentTheme = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;
    setTheme(currentTheme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-(--bg-elevated) border border-(--bg-hover) text-(--text-secondary) cursor-pointer shrink-0 transition-colors duration-150 hover:bg-(--bg-hover) hover:text-(--text-primary)"
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
