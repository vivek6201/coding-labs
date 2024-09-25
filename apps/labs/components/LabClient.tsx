"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/components/ui/resizable";
import CodeEditor from "./Editor/Editor";
import Terminal from "./Editor/Terminal";
import axios from "axios";
import useSocket from "../hooks/useSocket";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  bootingContainerAtom,
  currentContentAtom,
  fileStructureAtom,
  loadingDataAtom,
} from "../store/store";
import DocTree from "./Editor/DocTree/DocTree";
import useTraverseChild from "../hooks/useTraverseChild";
import { Loader2 } from "lucide-react";
import EditorPlaceholder from "./Editor/EditorPlaceholder";
import { Button } from "@ui/components/button";
import { useRouter } from "next/navigation";
import { useToast } from "@ui/hooks/use-toast";

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

  if (booting)
    return (
      <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Loader2 className="animate-spin" />
          <p>Booting...</p>
        </div>
      </div>
    );

  return <CodingPlayground slug={slug} />;
};

const CodingPlayground = ({ slug }: { slug: string }) => {
  const { socket } = useSocket(slug);
  const [fileStructure, setFileStructure] = useRecoilState(fileStructureAtom);
  const [currentContent, setCurrentContent] =
    useRecoilState(currentContentAtom);
  const [dataLoading, setDataLoading] = useRecoilState(loadingDataAtom);
  const { syncChildren, insertNode } = useTraverseChild();
  const router = useRouter();
  const { toast } = useToast();
  const [exitLoader, setExitLoader] = useState(false);

  const handleLab = async () => {
    try {
      setExitLoader(true);
      const res = await axios.post("/api/stop", { slug });
      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "something went wrong while exiting!",
      });
      router.push("/dashboard");
    } finally {
      setExitLoader(false);
    }
  };

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
          if (message.data && fileStructure) {
            const updatedTree = syncChildren(fileStructure, message.data);
            if (updatedTree) {
              setFileStructure(updatedTree);
            }
          }
          break;
        case "createDir":
          if (message.data && fileStructure) {
            const updatedTree = insertNode(fileStructure, message.data);
            if (updatedTree) {
              setFileStructure(updatedTree);
            }
          }
          break;
        case "createFile":
          if (message.data && fileStructure) {
            const updatedTree = insertNode(fileStructure, message.data);
            if (updatedTree) {
              setFileStructure(updatedTree);
            }
          }
          break;
        case "fetchContent":
          setCurrentContent({
            name: message.data.name,
            content: message.data.content,
            path: message.data.path,
          });
          break;
      }
    });
  }, [socket, fileStructure]);

  if (dataLoading)
    return (
      <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Loader2 className="animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );

  return (
    <ResizablePanelGroup direction="horizontal" className="h-">
      <ResizablePanel
        defaultSize={15}
        className="p-2 min-w-[200px] h-full flex flex-col justify-between"
      >
        <DocTree />
        <Button
          onClick={handleLab}
          disabled={exitLoader}
          className="flex items-center gap-2"
        >
          {exitLoader ? <Loader2 className="animate-spin" /> : null}
          Exit Lab
        </Button>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            {currentContent ? <CodeEditor /> : <EditorPlaceholder />}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} className="overflow-y-auto">
            <Terminal />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default LabClient;
