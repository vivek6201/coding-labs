"use client";
import Editor from "@monaco-editor/react";

export default function CodeEditor({socket}:{socket:WebSocket | null}) {
  const handleEditorChange = (value:any, event:any) => {
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
