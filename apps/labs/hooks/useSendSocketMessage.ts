import { useRecoilValue, useSetRecoilState } from "recoil";
import { pendingMessagesAtom, socketAtom } from "../store/store";

const useSendSocketMessage = () => {
  const socket = useRecoilValue(socketAtom);
  const setPendingMessages = useSetRecoilState(pendingMessagesAtom);

  if (!socket) return;

  const sendMessage = (message: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else if (socket.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket is still connecting. Queuing the message.");
      setPendingMessages((prev) => [...prev, message]); // Queue the message until connection is open
    } else {
      console.log("cannot send");
      console.error("WebSocket is not open. ReadyState:", socket.readyState);
    }
  };

  return sendMessage;
};

export default useSendSocketMessage;
