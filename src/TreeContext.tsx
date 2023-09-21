import { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';
import { ItemDataProps } from './Item';

// The tree state (TODO: Move ItemDataProps here & rename?)
export type TreeState = ItemDataProps[];     // top level of items in the tree
export type TreeSparseNodeProps = Partial<ItemDataProps>;
export type TreeSparseState = TreeSparseNodeProps[];
    // This allows initial state arguments passed to useTreedoReducer to be sparsely written,
    // i.e. if an item doesn't have subItems, just omit subItems. The tree reducer initialiser
    // will shimmy it into valid data as used by the tree.

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

// The tree state context
export const TreeContext = createContext<TreeState | null>(null);
export const useTreeState = () => useContext(TreeContext);

// The tree dispatch context
export const TreeDispatchContext = createContext<TreeDispatch | null>(null);
export const useTreeDispatch = () => useContext(TreeDispatchContext)

// components can call this to receive ([state: TreeState, dispatch: TreeDispatch])
export const useTreeContext = (): [TreeState | null, TreeDispatch | null] =>
    //([useContext(TreeContext), useContext(TreeDispatchContext)]);
    ([useTreeState(), useTreeDispatch()]);

export const useTree = (initialState: TreeState = []): [TreeState, TreeDispatch] => {
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
    const [state, dispatch] = useTree(treeInit(initialState));
    return (
        <TreeContext.Provider value={state}>
            <TreeDispatchContext.Provider value={dispatch}>
                {children}
            </TreeDispatchContext.Provider>
        </TreeContext.Provider>
    );
};

// Init's a tree aka node list from a Partial<ItemDataProps>[], applying defaults to node props where required.
// Also doubles as a tree clone function
export const treeInit = (state: TreeSparseState): TreeState =>
    state.map(treeNodeInit);

// Init's a tree node from a Partial<ItemDataProps>, applying defaults where required.
// Also doubles as a node clone function
export const treeNodeInit = (node: Partial<ItemDataProps>): ItemDataProps => ({
    title: node?.title,
    description: node?.description,
    subItems: node?.subItems?.map(treeNodeInit) ?? [],
});

// Returns a tree node, given a Tree (TreeState) and a path
export const getTreeByPath = (
    state: TreeState,
    path: number[],
): ItemDataProps | undefined => {
    let item: ItemDataProps | undefined = undefined;
    for (const index of path)
        item = item ? item.subItems[index] : state[index];
    return item;
};

export const treeUpdate = (
    tree: TreeState,
    path: number[],
    nodeReplacer: (node: ItemDataProps) => ItemDataProps,
) => tree.map((node, nodeIndex) => treeNodeUpdate(node, path, nodeReplacer, [ nodeIndex ]));

export const treeNodeUpdate = (
    node: ItemDataProps,
    path: number[],
    nodeReplacer: (node: ItemDataProps) => ItemDataProps,
    traversalPath: number[] = []
): ItemDataProps => (
    traversalPath.every((pathIndex, pathIndexIndex) => path[pathIndexIndex] === pathIndex) ?
        (traversalPath.length === path.length ?
            nodeReplacer(node)
            : {
                ...node,
                subItems: node.subItems.map((subNode, subNodeIndex) =>
                    treeNodeUpdate(subNode, path, nodeReplacer, [...traversalPath, subNodeIndex]))
            }
        )
        : node
);

export const useTreeReducer = (initialState: TreeSparseState) =>
    useReducer(treeReducer, initialState, treeInit);
    
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
        action.type === 'ADD' ? node => ({ ...node, subItems: [...node.subItems, treeNodeInit(action.newNode)] }) :
        action.type === 'REMOVE' ? node => ({ ...node, subItems: node.subItems.splice(action.index, 1) }) :
                    () => { throw new Error(`Unknown treeReducer action.type='${action.type}', action=${action}`); }
    );
    console.debug('tree\Reducer', 'action', action, 'state', state, 'newState', newState);
    return newState;
};
