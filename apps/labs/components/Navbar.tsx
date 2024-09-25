"use client";
import { Code } from "lucide-react";
import Link from "next/link";
import React from "react";
import ThemeToggler from "./themeToggler";
import { Button } from "@ui/components/ui/button";

function Navbar() {
  return (
    <div className="container flex justify-between item-center">
      <Link
        className="font-bold text-xl cursor-pointer flex items-center gap-2"
        href={"/dashboard"}
      >
        <Code className="h-5 w-5 text-red-500" />
        <span className="text-xl tracking-tight">CodingLabs</span>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggler />
        <Button className="dark:bg-gray-800 hover:bg-gray-700">Logout</Button>
      </div>
    </div>
  );
}

export default Navbar;
