import { TerminalManager } from "./terminal";
import { CustomWebSocket } from "./index";
import { WebSocket } from "ws";

const terminal = TerminalManager.getInstance();

export async function performActions(
  message: {
    type: string;
    data: any;
  },
  userWs: CustomWebSocket,
  mainWs: WebSocket,
  labSlug: string | undefined
) {
  switch (message.type) {
    case "requestTerminal": {
      try {
        terminal.createTermSession(userWs.id, labSlug!, async (data, id) => {
          try {
            if (data) {
              // Ensure data is valid before sending
              userWs.send(
                JSON.stringify({
                  type: "terminal",
                  data,
                })
              );
            } else {
              console.error(
                "Empty or undefined data received for WebSocket send"
              );
              userWs.send(
                JSON.stringify({
                  type: "error",
                  message: "Received empty or invalid terminal data",
                })
              );
            }
          } catch (error) {
            console.error("Error sending terminal data:", error);
            userWs.send(
              JSON.stringify({
                type: "error",
                message: "Error sending terminal data",
              })
            );
          }
        });
      } catch (error) {
        console.error("Error creating terminal session:", error);
        userWs.send(
          JSON.stringify({
            type: "error",
            message: "Error creating terminal session",
          })
        );
      }
      break;
    }

    case "terminalData": {
      terminal.writeData(userWs.id, message.data);
      break;
    }

    default: {
      mainWs.send(JSON.stringify(message));
      break;
    }
  }
}
