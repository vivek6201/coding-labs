"use client";

import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { pendingMessagesAtom, socketAtom } from "../store/store";
import useSendSocketMessage from "./useSendSocketMessage";

//modify this and apply reconnecting logic on disconnect
export default function useSocket(labSlug: string) {
  const [socket, setSocket] = useRecoilState(socketAtom);
  const pendingMessages = useRecoilValue(pendingMessagesAtom);
  const sendSocketMessage = useSendSocketMessage();

  useEffect(() => {
    const newSocket = new WebSocket(
      `ws://${labSlug}.labs.letscodeofficial.tech`
    );

    newSocket.onopen = () => {
      // Send any pending messages
      setSocket(newSocket);

      newSocket.send(
        JSON.stringify({
          type: "requestTerminal",
        })
      );

      while (pendingMessages.length > 0) {
        const message = pendingMessages.shift();
        if (message !== undefined) {
          if (!sendSocketMessage) return;
          sendSocketMessage(message);
        }
      }
    };

    return () => {
      newSocket.close();
    };
  }, [labSlug]);

  return { socket, pendingMessages };
}
