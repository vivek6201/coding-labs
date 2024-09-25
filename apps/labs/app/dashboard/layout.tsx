import React from "react";
import Navbar from "../../components/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-rows-[80px_1fr] dark:bg-gray-900 min-h-screen relative">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
