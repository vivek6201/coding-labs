import { appendFile, mkdir, readdir, readFile, writeFile } from "fs";
import { resolve } from "path";
interface IFile {
  type: "File" | "Folder";
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
              type: file.isDirectory() ? "Folder" : "File",
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
    writeFile(file, data, "utf-8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const createFolder = async (dirPath: string) => {
  dirPath = resolve(`${process.env.HOME}/${dirPath}`);
  return new Promise<void>((resolve, reject) => {
    mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("folder created successfully");
        resolve();
      }
    });
  });
};

export const createFile = async (filepath: string) => {
  filepath = resolve(`${process.env.HOME}/${filepath}`);
  return new Promise<void>((resolve, reject) => {
    writeFile(filepath, "", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
