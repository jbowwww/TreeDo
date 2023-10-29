import { Context, createContext, useContext } from "react";
import { TreeState } from "./State";
import { TreeActions } from "./Actions";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const TreeContext = createContext<[TreeState<any>, TreeActions<any>] | null>(null);
export const useTreeContext = <N>() => useContext<[TreeState<N>, TreeActions<N>]>(TreeContext as Context<[TreeState<N>, TreeActions<N>]>);
