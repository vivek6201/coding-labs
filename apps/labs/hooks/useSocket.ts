"use client";

import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { socketAtom } from "../store/store";

export default function useSocket(labSlug: string) {
  const [socket, setSocket] = useRecoilState(socketAtom);
  const socketRef = useRef<WebSocket | null>(null); // Use useRef to store the WebSocket instance
  const reconnectAttemptsRef = useRef(0);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const RECONNECT_INTERVAL = 5000; // 5 seconds
  const KEEP_ALIVE_INTERVAL = 5000; // 5 seconds

  function connectWebSocket() {
    console.log("Attempting to connect to WebSocket...");
    const newSocket = new WebSocket(`ws://${labSlug}.labs.letscodeofficial.tech`);

    newSocket.onopen = () => {
      if(socketRef.current !== null) return;
      
      console.log("WebSocket connection established");
      socketRef.current = newSocket; // Store the WebSocket instance in the ref
      setSocket(newSocket); // Update Recoil state
      reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection

      newSocket.send(
        JSON.stringify({
          type: "requestTerminal",
        })
      );

      // Start keep-alive mechanism
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      keepAliveIntervalRef.current = setInterval(() => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.send(JSON.stringify({ type: "keepAlive" }));
        }
      }, KEEP_ALIVE_INTERVAL);
    };

    newSocket.onclose = () => {
      console.error("WebSocket closed. Reconnecting...");
      if (reconnectAttemptsRef.current < Infinity) {
        reconnectAttemptsRef.current++;
        setTimeout(connectWebSocket, RECONNECT_INTERVAL); // Attempt to reconnect after the interval
      } else {
        console.error("Max reconnection attempts reached. Giving up.");
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      newSocket.close(); // Close the socket on error to trigger reconnection
    };
  }

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up WebSocket connection");
        socketRef.current.close();
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, [labSlug]);

  return { socket: socketRef.current }; // Return the WebSocket instance from the ref
}
