"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => setMounted(true), []);

  // Set default theme to system if not set
  useEffect(() => {
    if (mounted && !theme) {
      setTheme("system");
    }
  }, [mounted, theme, setTheme]);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 px-0 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Monitor className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg animate-in fade-in-80 slide-in-from-top-1 z-50"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
