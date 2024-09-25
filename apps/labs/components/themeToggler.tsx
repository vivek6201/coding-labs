import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Button } from "@ui/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggler() {
  const [darkMode, setDarkMode] = useState(true);
  const { setTheme } = useTheme();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    darkMode ? setTheme("dark") : setTheme("light");
  }, [darkMode]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      {darkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
