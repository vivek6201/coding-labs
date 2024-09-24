"use client";

import { TreeChild } from "../components/Editor/DocTree/helper";

const useTraverseChild = () => {
  function syncChildren(tree: TreeChild, child: TreeChild): TreeChild {
    if (tree.path === child.path) {
      if (tree.children !== child.children) {
        return { ...tree, children: child.children };
      }
      return tree;
    }

    // Using DFS to search the current node where update need to be performed
    const updatedChildren: TreeChild[] =
      tree.children
        ?.map((obj) => syncChildren(obj, child))
        .filter((child): child is TreeChild => child !== undefined) || [];

    // Only create a new object if children have changed
    if (tree.children !== updatedChildren) {
      return { ...tree, children: updatedChildren };
    }

    return tree;
  }

  function insertNode(tree: TreeChild, child: TreeChild): TreeChild {
    if (tree.path === child.path) {
      tree.children?.unshift(child);
      return tree;
    }

    // Using DFS to search the current node where update need to be performed
    const updatedChildren: TreeChild[] =
      tree.children
        ?.map((obj) => syncChildren(obj, child))
        .filter((child): child is TreeChild => child !== undefined) || [];

    return { ...tree, children: updatedChildren };
  }

  return { syncChildren, insertNode };
};

export default useTraverseChild;
