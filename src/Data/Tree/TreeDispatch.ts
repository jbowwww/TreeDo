import { Dispatch } from 'react';
import { TreeNodeProps } from '../../Components/Tree/TreeNode';
import { TreeState } from './TreeState';

const throwInvalidDispatch = (name: string, ...args: any) => { throw new Error(`TreeDispatch: Operation not supported: ${name}(${args})`); };

// Defines methods for tree dispatch operations, instead of manually creating the underlying POJO objects
export const treeDispatch = (dispatch: Dispatch<TreeDispatchAction>) => ({
    clear(path: number[]) { throwInvalidDispatch('CLEAR', { path }); },
    remove(path: number[]) { throwInvalidDispatch('REMOVE', { path }); },
    add(path: number[], newNode: TreeNodeProps) { dispatch({ type: 'ADD', path, newNode }); },
    update(path: number[], node: TreeNodeProps) { dispatch({ type: 'UPDATE', path, node }); },
});
export type TreeDispatch = ReturnType<typeof treeDispatch>;

// Anyway to make this more concise, and/or automated ??
export type TreeDispatchAction =
    clear({ type: 'clear', path: number[], }):
    { type: 'remove', } |
    { type: 'add', path: number[], newNode: TreeNodeProps, } |
    { type: 'update', path: number[], node: TreeNodeProps, };

enum TreeDispatchActionKind {
    clear,
    remove,
    add,
    update,
};

// The reducer
export const treeReducer = (
    state: TreeState,
    action: TreeDispatchAction
) => {
    let newState: TreeState;
    switch (action.type) {
        case "clear": newState = state.updateNode(action.path, (node: TreeNodeProps) => ({ ...node, nodes: [] })); break;
        case "REMOVE": newState = state; throwInvalidDispatch("REMOVE", action); break;
        case "ADD": newState = state.updateNode(action.path, (node: TreeNodeProps) => ({ ...node, nodes: [...(node.nodes ?? []), action.newNode] })); break;
        case "UPDATE": newState = state.updateNode(action.path, () => action.node); break;
        //default:        newState = state; throwInvalidDispatch(action.type, action);                                                                        break;
    }
    console.debug('treeReducer', 'state', state, 'action', action, 'newState', newState);
    return newState;
};
