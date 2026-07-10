import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useHydrated } from "@/lib/use-hydrated";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-11 h-11 rounded-2xl grid place-items-center neu-pressable text-foreground"
    >
      {hydrated && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
