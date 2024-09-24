"use client";
import React from "react";
import { fileStructureAtom } from "../../../store/store";
import { useRecoilValue } from "recoil";
import { TreeChild } from "./helper";

const DocTree = () => {
  const fileStructure = useRecoilValue(fileStructureAtom);
  if (!fileStructure) return <>loading</>;
  
  return <TreeChild child={fileStructure} />;
};

export default DocTree;
