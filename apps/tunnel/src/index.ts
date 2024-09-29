import { WebSocketServer, WebSocket } from "ws";
import { configDotenv } from "dotenv";
import { performActions } from "./action";
import { v4 as uuidv4 } from "uuid";

configDotenv();

export interface CustomWebSocket extends WebSocket {
  id: string;
}

const userWss = new WebSocketServer({ port: 8080 });

userWss.on(
  "connection",
  async function connection(userWs: CustomWebSocket, req) {
    try {
      userWs.on("error", (err) => console.error("error is: ", err));

      const host = req.headers.host;
      const labSlug = host?.split(".")[0];
      userWs.id = uuidv4();

      const mainWs = new WebSocket(
        `ws://${labSlug}.labs.letscodeofficial.tech`
      );

      mainWs.on("open", () => {
        console.log("Connected to main server");

        // Forward messages from user to main server
        userWs.on("message", (data, isBinary) => {
          let message: {
            type: string;
            data: any;
          } | null = null;

          try {
            message = JSON.parse(data.toString());
          } catch (error) {
            console.error("Error parsing message:", error);
          }

          if (message) {
            performActions(message, userWs, mainWs, labSlug);
          }
        });

        // Forward messages from main server to user
        mainWs.on("message", (message, isBinary) => {
          userWs.send(message.toString());
        });
      });

      userWs.on("close", () => {
        console.log("User disconnected");
        mainWs.close();
      });

      mainWs.on("close", () => {
        console.log("Disconnected from main server");
        userWs.close();
      });
    } catch (error) {
      console.log({ error });
    }
  }
);
