import React from "react";
import Navbar from "../../components/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-rows-[64_1fr]">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
