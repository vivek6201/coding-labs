import { WebSocketServer, WebSocket } from "ws";
import { configDotenv } from "dotenv";
import { performActions } from "./actions";
import { fetchDir } from "./fs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

configDotenv();
export interface CustomWebSocket extends WebSocket {
  id: string;
}

export let destroyTimeout: NodeJS.Timeout | null = null;

async function emitRootContent(ws: CustomWebSocket) {
  const data = await fetchDir(process.env.HOME ?? "", "");

  if (Array.isArray(data)) {
    ws.send(
      JSON.stringify({
        type: "init",
        data:{
          name: "root",
          type: "Folder",
          path: "/",
          children: data
        },
      })
    );
  } else {
    console.error("Error fetching directory:", data);
  }
}

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 4000 });
wss.on("connection", async function connection(ws: CustomWebSocket, req) {
  try {
    ws.on("error", (err) => console.error("error is: ", err));

    const host = req.headers.host;
    const labSlug = host?.split(".")[0];
    ws.id = uuidv4();

    // this will emit the root content to the frontend or else throw an error
    await emitRootContent(ws);

    ws.on("message", function message(data, isBinary) {
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
        performActions(message, ws, labSlug);
      }
    });

    ws.on("close", () => {
      //set a setTimeout of 10 min, if user does come back then delete all containers

      destroyTimeout = setTimeout(() => {
        //call the backend api delete the pod
        console.log("destroying resources..")
      }, 600000)

      console.log("user disconnected");
    });
  } catch (error) {
    console.log({ error });
  }
});
