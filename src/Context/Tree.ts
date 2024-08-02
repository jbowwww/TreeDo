import { Context, createContext, useContext } from "react";
import { ItemNode } from "../Components/App/App";
import { TreeActions, TreeRoot } from "../State/Tree";

export type TreeContextType = [TreeRoot<ItemNode>, TreeActions<ItemNode>];
export const TreeContext = createContext<TreeContextType | null>(null);
export const useTreeContext = () => useContext<TreeContextType>(TreeContext as Context<TreeContextType>);
