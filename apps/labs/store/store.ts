import { atom } from "recoil";
import { TreeChild } from "../components/Editor/DocTree/helper";

export const socketAtom = atom<WebSocket | null>({
  key: "socketAtom",
  default: null,
});
export const pendingMessagesAtom = atom<string[]>({
  key: "pendingMessagesAtom",
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

export const fileStructureAtom = atom<TreeChild | null>({
  key: "fileStructureAtom",
  default: null,
});

export const currentContentAtom = atom<{
  name: string;
  path: string;
  content: string;
} | null>({
  key: "currentContentAtom",
  default: null,
});
