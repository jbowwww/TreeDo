import { useMemo, useState } from "react";
import { TreeNodeData, TreeState } from "./State";
import { TreeActions } from "./Actions";

export const useTreeState = <N>(initialState: TreeNodeData<N>[]): [TreeState<N>, TreeActions<N>] => {
    const [state, setState] = useState<TreeState<N>>(new TreeState<N>(initialState));
    const actions = useMemo(() => new TreeActions<N>(state, setState), [state, setState]);
    return [state, actions];
};
