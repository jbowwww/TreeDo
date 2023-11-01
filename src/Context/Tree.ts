import { Context, createContext, useContext } from "react";
import { ItemNode } from "../Components/App/App";
import { TreeActions, TreeRootNodes } from "../State/Tree";

export const TreeContext = createContext<[TreeRootNodes<ItemNode>, TreeActions<ItemNode>] | null>(null);
export const useTreeContext = () => useContext<[TreeRootNodes<ItemNode>, TreeActions<ItemNode>]>(TreeContext as Context<[TreeRootNodes<ItemNode>, TreeActions<ItemNode>]>);
