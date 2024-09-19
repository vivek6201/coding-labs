import { CustomWebSocket } from "./index";
import { fetchContent, fetchDir } from "./fs";
import { TerminalManager } from "./terminal";

const terminal = TerminalManager.getInstance();

export async function performActions(
  message: {
    type: string;
    data: any;
  },
  ws: CustomWebSocket,
  labSlug: string | undefined
) {
  switch (message.type) {
    //fetches the content of the file upon request
    case "fetchContentClient": {
      const path = `/workspace/${message.data.path}`;
      const data = await fetchContent(path);
      ws.send(
        JSON.stringify({
          type: "fetchContent",
          data,
        })
      );
      break;
    }

    //fetches the files of the requested dir on the workspace
    case "fetchDirClient": {
      const path = `/workspace/${message.data.path}`;
      const data = await fetchDir(path, message.data.path);

      ws.send(
        JSON.stringify({
          type: "fetchDir",
          data,
        })
      );
      break;
    }

    case "requestTerminal": {
      try {
        terminal.createTermSession(ws.id, labSlug!, async (data, id) => {
          try {
            if (data) {
              // Ensure data is valid before sending
              ws.send(
                JSON.stringify({
                  type: "terminal",
                  data
                })
              );
            } else {
              console.error(
                "Empty or undefined data received for WebSocket send"
              );
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Received empty or invalid terminal data",
                })
              );
            }
          } catch (error) {
            console.error("Error sending terminal data:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Error sending terminal data",
              })
            );
          }
        });
      } catch (error) {
        console.error("Error creating terminal session:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Error creating terminal session",
          })
        );
      }
      break;
    }

    case "terminalData": {
      terminal.writeData(ws.id, message.data);
      break;
    }

    case "createDir": {
    }

    case "createFile": {
    }
  }
}
