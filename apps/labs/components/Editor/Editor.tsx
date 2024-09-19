"use client";
import Editor from "@monaco-editor/react";
import { useRecoilValue } from "recoil";
import { socketAtom } from "../../store/store";

export default function CodeEditor() {
  const socket = useRecoilValue(socketAtom);
  const handleEditorChange = (value: any, event: any) => {
    console.log(value);
  };

  return (
    <Editor
      className="h-full flex-1"
      theme="vs-dark"
      defaultLanguage={"javacript"}
      onChange={handleEditorChange}
    />
  );
}
