import { ReactNode, createContext, useContext } from 'react';
import { TreeDispatch, TreeState } from './Tree';
    
// The tree state context, tree dispatch context, and a combined useTreeContext
// These will only get valid values if cliwnt code has used TreeProvider,
// or manually set up TreeContext.Provider or TreeDispatchContext.Provider
export const TreeStateContext = createContext<TreeState | null>(null);
export const useTreeStateContext = () => useContext(TreeStateContext);

export const TreeDispatchContext = createContext<TreeDispatch | null>(null);
export const useTreeDispatchContext = () => useContext(TreeDispatchContext)

export const useTreeContext = (): [TreeState | null, TreeDispatch | null] =>
    ([useTreeStateContext(), useTreeDispatchContext()]);

// Tree provider (currently includes both state and dispatch contexts)
export const TreeContextProvider = ({
    state,
    dispatch,
    children = []
}: {
    state: TreeState,
    dispatch: TreeDispatch
    children?: ReactNode,
}) => {
    return (
        <TreeStateContext.Provider value={state}>
            <TreeDispatchContext.Provider value={dispatch}>
                {children}
            </TreeDispatchContext.Provider>
        </TreeStateContext.Provider>
    );
};
