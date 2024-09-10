"use client";
import React, { useEffect, useRef } from "react";
import { XTerm } from "xterm-for-react";

const Terminal = ({ socket }: { socket: WebSocket | null }) => {
  const terminalRef = useRef<XTerm>(null);

  const handleTermData = (value: string) => {
    console.log(value);
  };

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) return;
  }, [terminalRef]);

  return (
    <XTerm
      ref={terminalRef}
      className="min-h-[400px]"
      onData={handleTermData}
    />
  );
};

export default Terminal;
