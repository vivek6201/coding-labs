"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentFileContentAtom, fileStructureAtom, loadingDataAtom, socketAtom } from "../../store/store";
import useSendSocketMessage from "../../hooks/useSendSocketMessage";

export interface TreeChild {
  type: "File" | "Folder";
  content?: any;
  name: string;
  path: string;
}

const DocTree = () => {
  const socket = useRecoilValue(socketAtom);
  const fileStructure = useRecoilValue<TreeChild[]>(fileStructureAtom);
  const loaded = useRecoilValue(loadingDataAtom);
  const setFileContent = useSetRecoilState(currentFileContentAtom);

  const onSelect = (child: TreeChild) => {
    if (!socket) return;
    if (child.type === "Folder") {
      useSendSocketMessage(
        JSON.stringify({
          type: "fetchDirClient",
          data: {
            path: child.path,
          },
        })
      );
    } else {
      useSendSocketMessage(
        JSON.stringify({
          type: "fetchContentClient",
          data: { path: child.path },
        })
      );
    }
  };

  useEffect(() => {
    console.log({ fileStructure });
  }, [fileStructure]);

  return <div className="p-5 h-full w-full">{loaded && <p>Loading</p>}</div>;
};

export default DocTree;
