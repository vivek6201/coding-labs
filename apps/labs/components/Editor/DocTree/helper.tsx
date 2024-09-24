import { memo, useState } from "react";
import { FileIcon } from "./icon";
import useSendSocketMessage from "../../../hooks/useSendSocketMessage";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { File, FilePlus2, FolderPlus } from "lucide-react";
import useTraverseChild from "../../../hooks/useTraverseChild";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentContentAtom, fileStructureAtom } from "../../../store/store";

export interface TreeChild {
  name: string;
  path: string;
  children?: TreeChild[];
  content?: string;
  type: "File" | "Folder";
}

const getPaddingClass = (level: number) => {
  const paddingClasses = [
    "pl-0",
    "pl-2",
    "pl-4",
    "pl-6",
    "pl-8",
    "pl-10",
    "pl-12",
    "pl-14",
    "pl-16",
  ];
  return paddingClasses[Math.min(level, paddingClasses.length - 1)];
};

export const TreeChild = memo(
  ({
    child,
    paddingLevel = 0,
  }: {
    child: TreeChild;
    paddingLevel?: number;
  }) => {
    const [expanded, setExpanded] = useState(false);
    const [currentContent, setCurrentContent] =
      useRecoilState(currentContentAtom);
    const sendMessage = useSendSocketMessage();
    const [input, setInput] = useState<{
      isVisible: boolean;
      type: "File" | "Folder" | undefined;
    }>({
      isVisible: false,
      type: undefined,
    });
    const [fileStructure, setFileStructure] = useRecoilState(fileStructureAtom);

    const handleFetchContent = () => {
      setCurrentContent({
        name: child.name,
        path: child.path,
        content: child.content ?? "",
      });
      sendMessage?.(
        JSON.stringify({
          type: "fetchContentClient",
          data: {
            path: child.path,
            name: child.name,
          },
        })
      );
    };

    const handleFolderContent = () => {
      sendMessage?.(
        JSON.stringify({
          type: "fetchDirClient",
          data: {
            path: child.path,
            name: child.name,
          },
        })
      );
      setExpanded(!expanded);
    };

    const handleInput = (
      e: React.MouseEvent<HTMLButtonElement>,
      type: "File" | "Folder"
    ) => {
      e.stopPropagation();
      setInput({
        type,
        isVisible: !input.isVisible,
      });
    };

    const addNode = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!fileStructure) return;
      if (!(e.key === "Enter" && (e.target as HTMLInputElement).value)) return;

      const path = `${child.path}/${(e.target as HTMLInputElement).value}`;

      if (input.type === "Folder") {
        sendMessage?.(
          JSON.stringify({
            type: "createDirClient",
            data: {
              path,
            },
          })
        );

        setInput({ ...input, isVisible: false });
      } else {
        console.log({ path });

        sendMessage?.(
          JSON.stringify({
            type: "createFileClient",
            data: {
              path,
            },
          })
        );

        setInput({ ...input, isVisible: false });
      }
    };

    const paddingClass = getPaddingClass(paddingLevel);

    if (child.name === "root" && child.type === "Folder") {
      return (
        <div>
          {child?.children?.map((item) => {
            return (
              <TreeChild
                child={item}
                key={item.path}
                paddingLevel={paddingLevel + 1}
              />
            );
          })}
        </div>
      );
    }

    if (child?.type === "File") {
      const extension = child.name.split(".").at(-1);
      return (
        <div
          className={`flex items-center gap-2 py-1 select-none hover:bg-gray-800 rounded-sm cursor-pointer ${paddingClass} ${currentContent?.path === child.path && "bg-gray-700"}`}
          onClick={handleFetchContent}
        >
          <FileIcon extension={extension} />
          {child.name}
        </div>
      );
    }

    return (
      <div>
        <div
          className={`flex justify-between items-center select-none gap-2 py-1 hover:bg-gray-700 rounded-sm cursor-pointer ${paddingClass} group`}
          onClick={handleFolderContent}
        >
          <div className="flex gap-2 items-center">
            {expanded ? (
              <FileIcon name="openDirectory" />
            ) : (
              <FileIcon name="closedDirectory" />
            )}
            <p>{child.name}</p>
          </div>
          <div className="group-hover:flex mx-2 gap-1 items-center hidden ">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="h-6 w-6"
              onClick={(e) => handleInput(e, "File")}
            >
              <FilePlus2 size={16} />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="h-6 w-6"
              onClick={(e) => handleInput(e, "Folder")}
            >
              <FolderPlus size={15} />
            </Button>
          </div>
        </div>
        {input.isVisible ? (
          <div className={`flex gap-2 items-center ${paddingClass} my-2`}>
            {input.type === "Folder" ? (
              <FileIcon name="closedDirectory" />
            ) : (
              <File size={16} />
            )}
            <Input
              className="h-6 max-w-[80%]"
              autoFocus
              onKeyDown={addNode}
              onBlur={() => setInput({ ...input, isVisible: false })}
            />
          </div>
        ) : null}
        {expanded &&
          child?.children?.map((item) => {
            return (
              <TreeChild
                child={item}
                key={item.path}
                paddingLevel={paddingLevel + 1}
              />
            );
          })}
      </div>
    );
  }
);
