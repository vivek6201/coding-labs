import { MutableRefObject } from "react";
import { atom } from "recoil";
import { TreeChild } from "../components/Editor/DocTree";

export const socketAtom = atom<WebSocket | null>({
  key: "socketAtom",
  default: null,
});
export const pendingMessagesAtom = atom<string[]>({
  key: "pendingMessagesAtom",
  default: [],
});

export const currentFileContentAtom = atom<string>({
  key: "currentFileContentAtom",
  default: "",
});

export const fileStructureAtom = atom<TreeChild[]>({
  key: "fileStructureAtom",
  default: [],
});

export const bootingContainerAtom = atom<boolean>({
  key: "bootingContainerAtom",
  default: false,
});
export const loadingDataAtom = atom<boolean>({
  key: "loadingDataAtom",
  default: true,
});
