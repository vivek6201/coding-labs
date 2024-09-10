import { appendFile, readdir, readFile } from "fs";

interface IFile {
  type: "file" | "dir";
  name: string;
  path: string;
}

export const fetchDir = async (
  dir: string,
  baseDir: string
): Promise<IFile[] | NodeJS.ErrnoException> => {
  return new Promise((resolve, reject) => {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) reject(err);
      else
        resolve(
          files.map((file) => {
            return {
              type: file.isDirectory() ? "dir" : "file",
              name: file.name,
              path: `${baseDir}/${file.name}`,
            };
          })
        );
    });
  });
};

export const fetchContent = async (file: string) => {
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export const saveFile = async (file: string, data: string) => {
  return new Promise<void>((resolve, reject) => {
    appendFile(file, data, "utf-8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
