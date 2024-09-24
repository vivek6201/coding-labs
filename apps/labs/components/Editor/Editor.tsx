"use client";
import Editor, { OnChange } from "@monaco-editor/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentContentAtom, socketAtom } from "../../store/store";
import useSendSocketMessage from "../../hooks/useSendSocketMessage";
import { usePathname } from "next/navigation";

export default function CodeEditor() {
  const socket = useRecoilValue(socketAtom);
  const currentContent = useRecoilValue(currentContentAtom);
  const sendMessage = useSendSocketMessage();
  let pathname = usePathname();

  const handleEditorChange = (value: any, event: any) => {
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
  };

  let language = currentContent?.name?.split(".").at(-1);

  switch (language) {
    case "js" || "jsx":
      language = "javascript";
      break;
    case "ts" || "tsx":
      language = "typescript";
      break;
    case "py":
      language = "python";
      break;
    case "json":
      language = "json";
    default:
      language = "javascript";
  }

  return (
    <Editor
      className="h-full flex-1"
      theme="vs-dark"
      defaultLanguage={language}
      onChange={handleEditorChange}
      value={currentContent?.content ?? ""}
    />
  );
}
