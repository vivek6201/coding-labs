"use client";
import Editor from "@monaco-editor/react";
import { useRecoilValue } from "recoil";
import { currentContentAtom, socketAtom } from "../../store/store";
import useSendSocketMessage from "../../hooks/useSendSocketMessage";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { debounce } from "../../lib/clientUtils";

export default function CodeEditor() {
  const socket = useRecoilValue(socketAtom);
  const currentContent = useRecoilValue(currentContentAtom);
  const sendMessage = useSendSocketMessage();
  let pathname = usePathname();

  const handleEditorChange = useCallback(
    (value: string) => {
      if (!socket || !sendMessage) return;

      sendMessage(
        JSON.stringify({
          type: "updateFile",
          data: {
            path: currentContent?.path,
            slug: pathname.split("/").at(-1),
            content: value,
          },
        })
      );
    },
    [socket, sendMessage, currentContent, pathname]
  );

  const debouncedHandleEditorChange = useCallback(
    debounce(handleEditorChange, 500),
    [handleEditorChange]
  );

  let language = currentContent?.name?.split(".").at(-1);

  switch (language) {
    case "js":
    case "jsx":
      language = "javascript";
      break;
    case "ts":
    case "tsx":
      language = "typescript";
      break;
    case "py":
      language = "python";
      break;
    case "json":
      language = "json";
      break;
    default:
      language = "javascript";
  }

  return (
    <Editor
      className="h-full flex-1"
      theme="vs-dark"
      defaultLanguage={language}
      onChange={debouncedHandleEditorChange}
      value={currentContent?.content ?? ""}
    />
  );
}
