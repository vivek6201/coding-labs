"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/components/ui/resizable";
import DocTree from "./Editor/DocTree";
import CodeEditor from "./Editor/Editor";
import Terminal from "./Editor/Terminal";
import useSocket from "../hooks/useSocket";

const LabClient = ({ slug }: { slug: string }) => {
  const socket = useSocket(slug);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15}>
        <DocTree socket={socket}/>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <CodeEditor socket={socket}/>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <Terminal socket={socket}/>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default LabClient;
