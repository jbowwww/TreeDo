import { Dispatch, useReducer } from "react";
import { TreeNodeProps } from "./TreeNode";

// The tree state is actually created here with the reducer
export const useTreeReducer = (initialState: TreeState) => useReducer(treeReducer, initialState);

// The tree reducer, state, and dispatch objects are created here
export const useTree = (initialState: TreeNodeProps[]): [TreeState, TreeDispatch] => {
    const [/*rawS*/state, rawDispatch] = useTreeReducer(new TreeState(initialState));
    //const state = new TreeState(rawState);
    const dispatch = new TreeDispatch(rawDispatch);
    return [state, dispatch];
};

export class TreeState {
    constructor(public readonly nodes: Array<TreeNodeProps> = []) { }

    getNodeByPath(path: number[]) {
        return path.reduce<TreeNodeProps>((acc, pathPart) => acc.nodes?.[pathPart] ?? {}, { nodes: this.nodes });
    }

    updateNode(path: number[], nodeUpdater: (node: TreeNodeProps) => TreeNodeProps) {
        return new TreeState(
            (function nodesVisitor(relativePath: number[], nodes?: TreeNodeProps[]): TreeNodeProps[] | undefined {
                return nodes?.map((subNode, subNodeIndex) =>
                    subNodeIndex === relativePath.shift() ? // match next part of relativePath? node to update is somewhere beneath here
                        relativePath.length === 0 ?         // was that the last path part?
                            nodeUpdater(subNode)            //  yes - update this node
                            : { ...subNode, nodes: nodesVisitor(relativePath, subNode.nodes) } // no - copy the node and visit it's child nodes
                        : subNode);
            })(path, this.nodes)                            // this node not in the update path, use existing copy (!! confirm this is OK!)
        );
    }
};

const throwInvalidDispatch = (name: string, ...args: any) => {
    throw new Error(`TreeDispatch: Operation not supported: ${name}(${args})`);
};

// Defines methods for tree dispatch operations, instead of manually creating the underlying POJO objects
export class TreeDispatch {
    constructor(public dispatch: Dispatch<any>) { }
    add(path: number[], node: TreeNodeProps) { this.dispatch({ type: 'ADD', path, node }); }
    clear(path: number[]) { throwInvalidDispatch('CLEAR', { path }); }
    remove(path: number[]) { throwInvalidDispatch('REMOVE', { path }); }
};

// The reducer
export const treeReducer = (
    state: TreeState,
    action: {
        type: 'ADD',
        path: number[],
        newNode: TreeNodeProps,
    } | {
        type: 'CLEAR' | 'REMOVE',
        path: number[],
    }
) => {
    const newState = state.updateNode(action.path,
        action.type === 'CLEAR'     ? node => ({ ...node, nodes: [] }) :
        action.type === 'ADD'       ? node => ({ ...node, nodes: [...(node.nodes ?? []), action.newNode] }) :
        action.type === 'REMOVE'    ? node => (node) : // ({ ...node, nodes: node.nodes?.splice(action.index, 1) }) :
                    () => throwInvalidDispatch(action.type, action));
    console.debug('treeReducer', 'action', action, 'state', state, 'newState', newState);
    return newState;
};
