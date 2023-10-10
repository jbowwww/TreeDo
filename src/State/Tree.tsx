import { Dispatch, ReactNode, createContext, useContext, useMemo, useState } from 'react';

export type TreeNode = {
    nodes?: TreeNode[];
} & {
    [K: string]: any;
}

export type TreeState = TreeNode[];

export const useTree = (initialState: TreeState): [TreeState, TreeActions] => {
    const [state, setState] = useState<TreeState>(initialState);
    const actions = useMemo(() => new TreeActions(state, setState), [state, setState]);
    return [state, actions];
};

export class TreeActions {
    constructor(
        public readonly state: TreeState,
        public readonly setState: Dispatch<React.SetStateAction<TreeState>>
    ) { }

    getNode(path: number[]) {
        return path.reduce<TreeNode | undefined>((acc, pathPart) => acc?.nodes?.[pathPart] ?? this.state[pathPart], { nodes: this.state });
    }

    private updateNode(path: number[], nodeUpdater: (node: TreeNode) => TreeNode): TreeState {
        const nodesVisitor = (relativePath: number[], nodes: TreeNode[]): TreeNode[] =>
            relativePath.length === 0 ? (nodeUpdater({ nodes }).nodes ?? []) :
                nodes.map((subNode, subNodeIndex) => subNodeIndex === relativePath.at(0) ?
                    { ...subNode, nodes: nodesVisitor(relativePath.slice(1), subNode.nodes ?? []) } : subNode);
        const newState = nodesVisitor(path, this.state);
        this.setState(newState ?? this.state);
        return newState ?? this.state;
    }

    clear   (path: number[])                    { this.updateNode(path, node => ({ ...node, nodes: [] }));                                  }
    remove  (/*path: number[]*/)                { }
    add     (path: number[], node: TreeNode)    { this.updateNode(path, (n: TreeNode) => ({ ...n, nodes: [...(n.nodes ?? []), node] }));    }
    update  (path: number[], node: TreeNode)    { this.updateNode(path, () => node);                                                        }

    toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}

export const TreeContext = createContext<[TreeState, TreeActions] | null>(null);
export const useTreeContext = () => useContext<[TreeState, TreeActions] | null>(TreeContext) ?? [];

// Tree provider (currently includes both state and dispatch contexts)
export const TreeContextProvider = ({
    value,
    children = []
}: {
    value: [TreeState, TreeActions],
    children?: ReactNode
}) => (
    <TreeContext.Provider value={value}>
        {children}
    </TreeContext.Provider>
);
