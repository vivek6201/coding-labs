import React from "react";

export default function EditorPlaceholder() {
  return (
    <div className="w-full h-full flex gap-y-2 flex-col items-center justify-center">
      <p className="text-xl">Welcome to <span className="text-red-500 font-bold">CodingLabs</span></p>
      <p className="italic text-sm opacity-70">Select a file to open in editor</p>
    </div>
  );
}
