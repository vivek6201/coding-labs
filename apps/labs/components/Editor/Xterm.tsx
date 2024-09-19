"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { sendMessage } from "../../hooks/useSocket";

export default function XTerm({
  socket,
  pendingMessages,
}: {
  socket: WebSocket | null;
  pendingMessages: string[];
}) {
  const xtermRef = useRef<Terminal>();
  const ref = useRef<HTMLDivElement>(null);
  const fitAddon = new FitAddon();
  const webLinks = new WebLinksAddon();

  function ab2str(buf: ArrayBufferLike) {
    return String.fromCharCode.apply(null, [...new Uint8Array(buf)]);
  }

  useEffect(() => {
    if (!ref.current || !socket) return;

    if (!xtermRef.current) {
      xtermRef.current = new Terminal({
        cursorBlink: true,
        cols: 100,
        rows: 30,
      });
    }

    const terminal = xtermRef.current;

    terminal.open(ref.current);
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinks);

    sendMessage(
      socket,
      pendingMessages,
      JSON.stringify({
        type: "requestTerminal",
      })
    );

    const handleTermData = (event: MessageEvent) => {
      const { data } = JSON.parse(event.data);
      console.error(data);
      terminal.write(data);
    };

    socket.addEventListener("message", (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.type === "terminal") {
        handleTermData(event);
      }
    });

    terminal.onData((data) => {
      if (data) {
        sendMessage(
          socket,
          pendingMessages,
          JSON.stringify({ type: "terminalData", data })
        );
      } else console.log("recieved undefined data");
    });

    terminal.onData((data) => {
      sendMessage(
        socket,
        pendingMessages,
        JSON.stringify({
          type: "terminalData",
          data,
        })
      );
    });

    setTimeout(() => {
      fitAddon.fit();
    }, 0);

    return () => {
      socket.removeEventListener("message", handleTermData);
      socket.close();
      terminal.dispose();
    };
  }, [socket, xtermRef]);

  return <div ref={ref} />;
}
