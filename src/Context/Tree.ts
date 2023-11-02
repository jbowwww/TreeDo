import { Context, createContext, useContext } from "react";
import { ItemNode } from "../Components/App/App";
import { TreeActions, TreeRoot } from "../State/Tree";

export const TreeContext = createContext<[TreeRoot<ItemNode>, TreeActions<ItemNode>] | null>(null);
export const useTreeContext = () => useContext<[TreeRoot<ItemNode>, TreeActions<ItemNode>]>(TreeContext as Context<[TreeRoot<ItemNode>, TreeActions<ItemNode>]>);
