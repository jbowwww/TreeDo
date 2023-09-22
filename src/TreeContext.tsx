import { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';
import { TreeNodeData, TreeNodeDataProps, TreeSparseNodeProps } from './TreeNode';

export type TreeState = TreeNodeDataProps[];
export type TreeSparseState = TreeSparseNodeProps[];

// Available operations on the tree
export const TreeDispatchActions = {
    clear:      (path: number[])                                => ({ type: "clear",    path }),
    add:        (path: number[], node: TreeSparseNodeProps)     => ({ type: "add",      path, node }),
    remove:     (path: number[])                                => ({ type: "remove",   path }),
};
export type TreeDispatchActionNames = keyof typeof TreeDispatchActions;

export type TreeDispatch = {
    [K in TreeDispatchActionNames]: (...args: Parameters<typeof TreeDispatchActions[K]>) => void;
};
//    clear: () => void;
//    add: (path: number[], node: TreeSparseNodeProps) => void;// => ({ type: 'ADD', path, node }),
//    remove: () => void,
//};

const makeDispatchUnsupportedOperation = (name: string) =>
    (...args: any[]) => {
        throw new Error('TreeDispatch: Operation not supported: ' + name + '(' + args + ')');
    };

// The operation definitions. Potentially could substitute different dispatch objects
export const getTreeDispatch = (dispatch: Dispatch<any>): TreeDispatch => ({
    clear: makeDispatchUnsupportedOperation('clear'),
    add: (path: number[], node: TreeSparseNodeProps): void => dispatch({ type: 'ADD', path, node }),
    remove: makeDispatchUnsupportedOperation('remove'),
});

// The tree state context, tree dispatch context, and a combined useTreeContext
// These will only get valid values if cliwnt code has used TreeProvider,
// or manually set up TreeContext.Provider or TreeDispatchContext.Provider
export const TreeContext = createContext<TreeState | null>(null);
export const useTreeState = () => useContext(TreeContext);

export const TreeDispatchContext = createContext<TreeDispatch | null>(null);
export const useTreeDispatch = () => useContext(TreeDispatchContext)

export const useTreeContext = (): [TreeState | null, TreeDispatch | null] =>
    ([useTreeState(), useTreeDispatch()]);

// The tree state is actually created here with the reducer
export const useTreeReducer = (initialState: TreeSparseState) =>
    useReducer(treeReducer, initialState, state => state.map(node => new TreeNodeData(node)));

// The tree reducer, state, and dispatch objects are created here
export const useTree = (initialState: TreeSparseState = []): [TreeState, TreeDispatch] => {
    const [state, rawDispatch] = useTreeReducer(initialState);
    const dispatch = getTreeDispatch(rawDispatch);
    return [state, dispatch];
};

// Tree provider (currently includes both state and dispatch contexts)
export const TreeProvider = ({
    initialState = [],
    children = []
}: {
    initialState: TreeSparseState,
    children?: ReactNode,
}) => {
    const [state, dispatch] = useTree(initialState);
    return (
        <TreeContext.Provider value={state}>
            <TreeDispatchContext.Provider value={dispatch}>
                {children}
            </TreeDispatchContext.Provider>
        </TreeContext.Provider>
    );
};

// Init's a tree aka node list from a Partial<TreeNodeProps>[], applying defaults to node props where required.
// Also doubles as a tree clone function
//export const treeInit = (state: TreeSparseState): TreeState => state.map(treeNodeInit);

// Init's a tree node from a Partial<TreeNodeProps>, applying defaults where required.
// Also doubles as a node clone function
//export const treeNodeInit = (node: Partial<TreeNodeProps>): TreeNodeProps => ({
//    title: node?.title,
//    description: node?.description,
//    subItems: node?.subItems?.map(treeNodeInit) ?? [],
//});

// Returns a tree node, given a Tree (TreeState) and a path
export const getTreeByPath = (
    state: TreeState,
    path: number[],
): TreeNodeDataProps | undefined => {
    let item: TreeNodeDataProps | undefined = undefined;
    for (const index of path)
        item = item ? item.subItems[index] : state[index];
    return item;
};

export const isPathWithin = (path1: number[], path2: number[]) =>
    path1.every((pathIndex, pathIndexIndex) => path2[pathIndexIndex] === pathIndex);

export const treeUpdate = (
    tree: TreeState,
    path: number[],
    nodeReplacer: (node: TreeNodeDataProps) => TreeNodeDataProps,
) => tree.map((node, nodeIndex) => treeNodeUpdate(node, path, nodeReplacer, [ nodeIndex ]));

export const treeNodeUpdate = (
    node: TreeNodeDataProps,
    path: number[],
    nodeReplacer: (node: TreeNodeDataProps) => TreeNodeDataProps,
    traversalPath: number[] = []
): TreeNodeDataProps => (
    // don't clone nodes that aren't within our selection path, just keep as is
    !isPathWithin(traversalPath, path) ? node :
        // but the node that is being updated (specified by path), or any of it's parents,
        // should be cloned for the new state (otherwise react can end up redrawing because
        // the existing state is being modified, and that state is being passed as props to components)
    new TreeNodeData(
        traversalPath.length === path.length ?
            nodeReplacer(node) : {
                ...node,
                subItems: node.subItems.map((subNode, subNodeIndex) =>
                    treeNodeUpdate(
                        subNode,
                        path,
                        nodeReplacer,
                        [...traversalPath, subNodeIndex]
                    )
                )
            }
        )
    );

// The reducer
export const treeReducer = (
    state: TreeState,
    action: any
    //{ type: 'CLEAR', path: number[], } |
    //{ type: 'ADD', path: number[], } |
    //{ type: 'REMOVE', path: number[], id: number, }
) => {
    const newState = treeUpdate(
        state,
        action.path,
        action.type === 'CLEAR' ? node => ({ ...node, subItems: [] }) :
        action.type === 'ADD' ? node => ({ ...node, subItems: [...node.subItems, new TreeNodeData(action.newNode)] }) :
        action.type === 'REMOVE' ? node => ({ ...node, subItems: node.subItems.splice(action.index, 1) }) :
                    () => { throw new Error(`Unknown treeReducer action.type='${action.type}', action=${action}`); }
    );
    console.debug('tree\Reducer', 'action', action, 'state', state, 'newState', newState);
    return newState;
};
