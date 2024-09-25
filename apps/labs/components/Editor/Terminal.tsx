"use client";
import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useRecoilValue } from "recoil";
import { socketAtom } from "../../store/store";
import useSendSocketMessage from "../../hooks/useSendSocketMessage";

const term = new Terminal();

const XTerminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socket = useRecoilValue(socketAtom);
  const sendSocketMessage = useSendSocketMessage();

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "terminal") term.write(message.data);
    };

    return () => socket.close();
  }, [socket]);

  useEffect(() => {
    if (!terminalRef.current || !socket) return;

    term.open(terminalRef.current);

    term.onKey((e) => {
      if (!sendSocketMessage) return;
      sendSocketMessage(
        JSON.stringify({
          type: "terminalData",
          data: e.key,
        })
      );
    });
  }, [terminalRef, socket]);

  return <div ref={terminalRef} className="h-fit overflow-y-auto" />;
};

export default XTerminal;
