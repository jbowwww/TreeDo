import { useMemo, useState, Dispatch } from "react";

export type TreeNode<N> = N & {
    nodes?: TreeNode<N>[];
};
export type TreeRootNodes<N> = TreeNode<N>[];

export const useTreeState = <N>(initialState: TreeRootNodes<N>): [TreeRootNodes<N>, TreeActions<N>] => {
    const [state, setState] = useState<TreeRootNodes<N>>(initialState);
    const actions = useMemo(() => new TreeActions<N>(state, setState), [state, setState]);
    return [state, actions];
};

export class TreeActions<N> {
    // technically this means N exists as a singular root at the tree, and I think it could be used like this, but really I'm ignoring
    // all members of this.state except for .nodes, treating the tree like its root is a list of nodes (N & { nodes: TreeNode<N>[] })
    constructor(
        public readonly state: TreeRootNodes<N>,
        public readonly setState: Dispatch<React.SetStateAction<TreeRootNodes<N>>>
    ) { }

    // path must have .length  > 0
    // this is painful for definition of actions below, because to add a root node, you cannot use this method
    // But whichever tradepffs make, tradeoffs exist, might as well stick to the correct semantic name of the method
    // The tree structure overall is awkward when state cannot be mutated, as any node that is modified, or any parent nodes, must be new copies
    // (unmodified nodes and parents are ok to reuse)
    private updateNode(path: number[], nodeUpdater: (node: TreeNode<N>) => TreeNode<N>): TreeRootNodes<N> {
        if (!path || path.length === 0)
            throw new Error(`TreeActions.updateNode(${path ? "[" + path.join(",") + "]" : "undefined"}, ${nodeUpdater}): path is not defined or empty`);
        const nodesVisitor = (path: number[], nodes?: TreeNode<N>[]): TreeNode<N>[] =>
            nodes?.map((node, childIndex) => childIndex === path[0] ?
                path.length === 1 ? nodeUpdater(node) :
                    ({ ...node, nodes: nodesVisitor(path.slice(1), node.nodes) }) : node) ?? [];
        const newState = nodesVisitor(path, this.state);
        return newState;
    }

    // path must have .length > 0
    public getNodeByPath = (path: number[]): TreeNode<N> => {
        if (!path || path.length === 0)
            throw new Error(`TreeActions.getNodeByPath(${path ? "[" + path.join(",") + "]" : "undefined"}): path is not defined or empty`);
        path = [...path];
        return path.reduce<TreeNode<N>>((node, p) => (node.nodes ?? [])?.[p], this.state[path.shift()!]);
    }

    public clear(path: number[]) {
        this.setState(path.length === 0 ? [] : this.updateNode(path, node => ({ ...node, nodes: [] })));
    }

    public reset(state: TreeRootNodes<N>) {
        this.setState(state);
    }

    // path must have .length > 0
    public remove(path: number[]) { //this.setState(path.length === 0 ? new TreeState<N>() : this.updateNode(path.slice(0, -1), node => new TreeNode<N>(node.value, node.children.filter((_, childIndex) => childIndex !== path.at(-1))))); }
        if (path.length === 0) {
            throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        }
        const removeIndex = path.pop()!;
        this.setState(path.length === 0 ?
            state => state.splice(removeIndex, 1) :
            this.updateNode(path, n => ({ ...n, children: n.nodes?.splice(removeIndex, 1) }))
        );
    }

    public add(path: number[], node: TreeNode<N>) {
        this.setState(path.length === 0 ?
            state => ([...state, node]) ://{ ...this.state ?? [], nodes: [...this.state?.nodes ?? [], node] });
            this.updateNode(path, (n: TreeNode<N>) => ({ ...n, nodes: [...(n.nodes ?? []), node] }))
        );
    }

    // path must have .length > 0
    public insert(path: number[], node: TreeNode<N>) {
        if (path.length === 0) {
            throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        }
        const insertIndex = path.pop()!;
        this.setState(path.length === 0 ?
            state => state?.splice(insertIndex, 0, node) :
            this.updateNode(path, n => ({ ...n, children: n.nodes?.splice(insertIndex, 0, node) }))
        );
    }

    // path must have .length > 0
    public update(path: number[], node: TreeNode<N>) {
        this.setState(this.updateNode(path, () => node));
    }

    public toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}
