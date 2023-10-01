import { Dispatch } from "react";
import { TreeNodeProps } from "../Components/Tree/TreeNode";
import { TreeState } from "./TreeState";

const throwInvalidDispatch = (name: string, ...args: any) => { throw new Error(`TreeDispatch: Operation not supported: ${name}(${args})`); };

// Defines methods for tree dispatch operations, instead of manually creating the underlying POJO objects
export class TreeDispatch {
    constructor(public dispatch: Dispatch<any>) { }
    clear(path: number[]) { throwInvalidDispatch('CLEAR', { path }); }
    remove(path: number[]) { throwInvalidDispatch('REMOVE', { path }); }
    add(path: number[], newNode: TreeNodeProps) { this.dispatch({ type: 'ADD', path, newNode }); }
    update(path: number[], node: TreeNodeProps) { this.dispatch({ type: 'UPDATE', path, node }); }
};

// Anyway to make this more concise, and/or automated ??
export type TreeDispatchAction =
    { type: 'CLEAR' | 'REMOVE', path: number[], } |
    { type: 'ADD', path: number[], newNode: TreeNodeProps, } |
    { type: 'UPDATE', path: number[], node: TreeNodeProps, };

// The reducer
export const treeReducer = (
    state: TreeState,
    action: TreeDispatchAction
) => {
    let newState: TreeState;
    switch (action.type) {
        case "CLEAR":   newState = state.updateNode(action.path, (node: TreeNodeProps) => ({ ...node, nodes: [] }));                                        break;
        case "REMOVE":  newState = state; throwInvalidDispatch("REMOVE", action);                                                                           break;
        case "ADD":     newState = state.updateNode(action.path, (node: TreeNodeProps) => ({ ...node, nodes: [...(node.nodes ?? []), action.newNode] }));   break;
        case "UPDATE":  newState = state.updateNode(action.path, () => action.node);                                                                        break;
        //default:        newState = state; throwInvalidDispatch(action.type, action);                                                                        break;
    }
    console.debug('treeReducer', 'state', state, 'action', action, 'newState', newState);
    return newState;
};
