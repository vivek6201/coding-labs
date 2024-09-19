"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/components/ui/resizable";
import DocTree from "./Editor/DocTree";
import CodeEditor from "./Editor/Editor";
import Terminal from "./Editor/Terminal";
import axios from "axios";
import useSocket from "../hooks/useSocket";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  bootingContainerAtom,
  fileStructureAtom,
  loadingDataAtom,
} from "../store/store";

const LabClient = ({ slug }: { slug: string }) => {
  const [booting, setBooting] = useRecoilState(bootingContainerAtom);

  useEffect(() => {
    const data = localStorage.getItem("server");

    const parsedData: {
      slug: string;
      isStarted: boolean;
    } = data ? JSON.parse(data) : false;

    if (parsedData.isStarted && parsedData.slug === slug) {
      setBooting(false);
    } else {
      setBooting(true);
      axios
        .post(`/api/start`, { slug })
        .then(() => {
          setBooting(false);
          localStorage.setItem(
            "server",
            JSON.stringify({
              slug,
              isStarted: true,
            })
          );
        })
        .catch((err) => console.error(err.response.data.message))
        .finally(() => setBooting(false));
    }
  }, []);

  if (booting) return <div>Booting!</div>;

  return <CodingPlayground slug={slug} />;
};

const CodingPlayground = ({ slug }: { slug: string }) => {
  const { socket } = useSocket(slug);
  const setFileStructure = useSetRecoilState(fileStructureAtom);
  const [dataLoading, setDataLoading] = useRecoilState(loadingDataAtom);

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "init":
          setDataLoading(false);
          setFileStructure(message.data);
          break;

        case "fetchDir":
          setFileStructure((prev) => {
            const allFiles = [...prev, ...message.data];
            return allFiles.filter(
              (file, index, self) =>
                index === self.findIndex((f) => f.path === file.path)
            );
          });
          break;
        case "fetchContent":
          setFileStructure(message.data);
          break;
      }
    });
  }, [socket]);

  if (dataLoading) return <>loading</>;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15}>
        <DocTree />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <Terminal />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default LabClient;
