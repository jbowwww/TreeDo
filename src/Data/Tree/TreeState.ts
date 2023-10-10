import { Dispatch, /*useMemo,*/ useReducer } from 'react';
//import { TreeNodeProps } from '../../Components/Tree/TreeNode';
//import { TreeDispatch, treeDispatch, treeReducer } from './TreeDispatch';

// The tree reducer, state, and dispatch objects are created here
export const useTree = <T>(initialState: TreeNode<T>[]): TreeStore<T> => { // /*[*/TreeState<T>/*, TreeDispatch]*/ => {
    const [/*rawS*/state, rawDispatch] = useTreeReducer<T>(new TreeState<T>(initialState));
    //const dispatch = useMemo(() => treeDispatch(rawDispatch), [rawDispatch]);
    //state.dispatch = rawDispatch;
    //return state as TreeState<T>;
    return new TreeStore<T>(state as TreeState<T>, rawDispatch);
    //return [state, dispatch];
};

// The tree state is actually created here with the reducer
export const useTreeReducer = <T>(initialState: TreeState<T>) => useReducer(TreeState.treeReducer, initialState);

export class TreeStore<T> {
    public readonly state: TreeState<T>;
    public readonly dispatch: Dispatch<(state: TreeState<T>) => TreeState<T>>;

    constructor(state: TreeState<T>, dispatch: Dispatch<any>) {
        this.state = state;
        this.dispatch = dispatch;
    }

    // Return the node at the given path in the tree (or undefined)
    getNode(path: number[]) {
        return path.reduce<TreeNode<T> | undefined>((acc, pathPart) => acc?.nodes?.[pathPart], this.state.nodes.at(path.unshift()));
    }

    // Replace a node at the given path in the tree using nodeUpdater function.
    // Constructs and returns a new TreeState<T> because we shouldn't modify state directly.
    // Combining these two steps should be more efficient than cloning the entire tree and then replacing the node.
    // At each node, the new state receives a new array instances where the items are the old instances, except
    // for the node that is to be replaced, or any of that node's parents. This should minimise memory use and copying,
    // while still ensuring react updates any components depending on the state appropriately.
    updateNode(path: number[], nodeUpdater: (node: TreeNode<T>) => TreeNode<T>): TreeState<T> {
        const nodesVisitor = (relativePath: number[], nodes?: TreeNode<T>[]): TreeNode<T>[] | undefined =>
            relativePath.length === 0 ? nodes : nodes?.map((subNode, subNodeIndex) =>       // nodes[] arrray recrecreated for every node
                subNodeIndex === relativePath.at(0) ? relativePath.length === 1 ? nodeUpdater(subNode) :    // node being replaced
                    { ...subNode, nodes: nodesVisitor(relativePath.slice(1), subNode.nodes) } : // parents of the node being replaced (also replace)
                    subNode) ?? [];     // nodes not in the path to the node being replaced, are not cloned, the instances are just used in new nodes[] arrays (but child nodes[] are not)
        // if this function were called with path = [], it would be cloning the tree for no point (so don't)
        return new TreeState(nodesVisitor(path, this.state.nodes));
    }

    clear(path: number[]) {
        this.dispatch(() => this.updateNode(path, node => ({ ...node, nodes: [] })));   // using state parameter avoids having to bind to this
    }



    toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state.nodes);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}

// The essential (tree-related) data for each node - just a list of child nodes
// The type parameter T allows the client code to specify the other properties to add,
// and have the properties included in the typing for each node in the tree heirarchy
export type TreeNode<T> = T & {
    nodes?: TreeNode<T>[];
}

// A (hopefully) (generic-ish) representation of a tree.
// T is a type describing the data contained in each node.
// T is combined using TreeNode<T>, which adds a property nodes? representing the node's child nodes.
// Note this doesn't have a single root node, rather a list.
// If client code wants to define extra data at the base of the tree, they could inherit from this class.
// If inheriting from this class, would want to implement a constructor to handle those extra properties, but then call the super() ctor.
// While I worry that using a class instead of POJO may be inefficient or have other implications for React's state management,
// i'm hoping that the functions are created on the prototype and so only the data is copied on state updates (like updateNode)
// I know it's unusual to do it this way, but I wanted the client code to be able to get at child nodes if they want to.
// Having updateNode here is even less defensible (shouldn't alter state directly, much less allow client code to), but I'm keeping it for now.
// f it, I'm even gonna try dispatch actions as functions on this class too
export class TreeState<T> {
    dispatch?: Dispatch<any>;

    constructor(public readonly nodes: Array<TreeNode<T>> = []) { }



    static treeReducer<T>(state: TreeState<T>, action: (state: TreeState<T>) => TreeState<T>): TreeState<T> {
        return action(state);
    }
};
