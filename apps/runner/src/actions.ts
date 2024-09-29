import { CustomWebSocket, destroyTimeout } from "./index";
import {
  createFile,
  createFolder,
  fetchContent,
  fetchDir,
  saveFile,
} from "./fs";
// import { TerminalManager } from "./terminal";
import { s3Utils } from "@repo/lib/src/index";

// const terminal = TerminalManager.getInstance();
const cred = {
  accessKey: process.env.AWS_ACCESS_KEY ?? "",
  secretKey: process.env.AWS_SECRET_KEY ?? "",
  bucketName: process.env.AWS_BUCKET_NAME ?? "",
  region: process.env.AWS_REGION ?? "ap-south-1",
};

export const S3Instance = s3Utils.S3Manager.getInstance(
  cred.accessKey,
  cred.secretKey,
  cred.bucketName,
  cred.region
);

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
      const path = `${process.env.HOME}/${message.data.path}`;
      const data = await fetchContent(path);
      ws.send(
        JSON.stringify({
          type: "fetchContent",
          data: {
            name: message.data.name,
            path: message.data.path,
            type: "File",
            content: data,
          },
        })
      );
      break;
    }

    //fetches the files of the requested dir on the workspace
    case "fetchDirClient": {
      const path = `${process.env.HOME}/${message.data.path}`;
      const data = await fetchDir(path, message.data.path);

      ws.send(
        JSON.stringify({
          type: "fetchDir",
          data: {
            name: message.data.name,
            type: "Folder",
            path: message.data.path,
            children: data,
          },
        })
      );
      break;
    }

    case "createDirClient": {
      try {
        //creating new directory
        await createFolder(message.data.path);
        const name = message.data.path.split("/").pop();

        ws.send(
          JSON.stringify({
            type: "createDir",
            data: {
              name: name,
              type: "Folder",
              path: message.data.path,
              children: [],
            },
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "createDirError",
            error: {
              data: error,
            },
          })
        );
      }
    }

    case "createFileClient": {
      try {
        //creating new directory
        await createFile(message.data.path);
        const name = message.data.path.split("/").pop();

        ws.send(
          JSON.stringify({
            type: "createFile",
            data: {
              name: name,
              type: "File",
              path: message.data.path,
              content: "",
            },
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "createFileError",
            error: {
              data: error,
            },
          })
        );
      }
    }

    case "updateFile": {
      try {
        const path = `${process.env.HOME}/${message.data.path}`;
        await saveFile(path, message.data.content);
        await S3Instance.saveToS3(
          `labs/${message.data.slug}`,
          message.data.path,
          message.data.content
        );
      } catch (error) {
        console.error(error);
      }
    }

    case "keepAlive": {
      if (destroyTimeout !== null) {
        clearTimeout(destroyTimeout);
      } else {
        ws.send(
          JSON.stringify({
            type: "alive",
            data: {
              message: "i am alive",
            },
          })
        );
      }
    }
  }
}
