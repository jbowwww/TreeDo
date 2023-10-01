import { Dispatch, useReducer } from "react";

// The tree reducer, state, and dispatch objects are created here
export const useTree = <T extends TNode<T>>(initialState: T[]): [Tree<T>, TreeDispatch<T>] => {
    const [/*rawS*/state, rawDispatch] = useTreeReducer(new Tree<T>(initialState));
    const dispatch = new TreeDispatch(rawDispatch);
    return [state, dispatch];
};

// The tree state is actually created here with the reducer
export const useTreeReducer = <T extends TNode<T>>(initialState: Tree<T>) => useReducer(treeReducer, initialState);

export type TNode<T extends TNode<T>> = {
    nodes: TNode<T>[];
};

export class Tree<T extends TNode<T>> {
    constructor(public readonly nodes: TNode<T>[] = []) { }

    getNode(path: number[]) {
        return path.reduce<TNode<T>>((acc, pathPart) => acc.nodes?.[pathPart] ?? {}, { nodes: this.nodes });
    }

    updateNode(path: number[], nodeUpdater: (node: TNode<T>) => TNode<T>) {
        return new Tree<T>((function nodesVisitor(relativePath: number[], nodes?: TNode<T>[]): TNode<T>[] {
            return nodes?.map((subNode, subNodeIndex) => subNodeIndex === relativePath?.[0] ? relativePath.length === 1 ?
                nodeUpdater(subNode) : { ...subNode, nodes: nodesVisitor(relativePath.slice(1), subNode.nodes) } : subNode) ?? [];
        })(path, this.nodes));
    }

    toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.nodes);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
};

const throwInvalidDispatch = (name: string, ...args: any) => { throw new Error(`TreeDispatch: Operation not supported: ${name}(${args})`); };

// Defines methods for tree dispatch operations, instead of manually creating the underlying POJO objects
export class TreeDispatch<T extends TNode<T>> {
    constructor(public dispatch: Dispatch<any>) { }
    clear(path: number[]) { throwInvalidDispatch('CLEAR', { path }); }
    remove(path: number[]) { throwInvalidDispatch('REMOVE', { path }); }
    add(path: number[], newNode: TNode<T>) { this.dispatch({ type: 'ADD', path, newNode }); }
    update(path: number[], node: TNode<T>) { this.dispatch({ type: 'UPDATE', path, node }); }
};

// Anyway to make this more concise, and/or automated ??
export type TreeDispatchAction<T extends TNode<T>> =
    { type: 'CLEAR' | 'REMOVE', path: number[], } |
    { type: 'ADD', path: number[], newNode: TNode<T>, } |
    { type: 'UPDATE', path: number[], node: TNode<T>, };

// The reducer
export const treeReducer = <T extends TNode<T>>(
        state: Tree<T>,
        action: TreeDispatchAction<T>
    ) => {
    let newState: Tree<T>;
    switch (action.type) {
        case "CLEAR": newState = state.updateNode(action.path, (node: TNode<T>) => ({ ...node, nodes: [] })); break;
        case "REMOVE": newState = state; throwInvalidDispatch("REMOVE", action); break;
        case "ADD": newState = state.updateNode(action.path, (node: TNode<T>) => ({ ...node, nodes: [...(node.nodes ?? []), action.newNode] })); break;
        case "UPDATE": newState = state.updateNode(action.path, () => action.node); break;
        //default:        newState = state; throwInvalidDispatch(action.type, action);                                                                 break;
    }
    console.debug('treeReducer', 'state', state, 'action', action, 'newState', newState);
    return newState;
};
