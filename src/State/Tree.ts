import { useMemo, useState, Dispatch } from "react";

export type TreeNode<N> = N & {
    nodes?: TreeNode<N>[];
};
export type TreeRootNodes<N> = TreeNode<N>[];
export type TreeNodeUpdater<N> = (node: TreeNode<N>) => TreeNode<N>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTreeNode = <N = unknown>(node: any): node is TreeNode<N> => typeof node === 'object' && Array.isArray(node?.nodes);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTreeRootNodes = <N = unknown>(nodes: any): nodes is TreeRootNodes<N> => Array.isArray(nodes) && nodes.every(node => isTreeNode(node));

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

    // path must have .length > 0
    public getNodeByPath = (path: number[]): TreeNode<N> => {
        if (!path || path.length === 0)
            throw new Error(`TreeActions.getNodeByPath(${path ? "[" + path.join(",") + "]" : "undefined"}): path is not defined or empty`);
        return path.slice(1).reduce<TreeNode<N>>((node, p) => (node.nodes ?? [])?.[p], this.state[path[0]]);
    }

    // Update a node at a given path, either with a supplied new node or an updater function that takes the current node and returns a new one
    // Now can update the root nodes (plural - there is no single root node) with same arguments, just note:
    // - if supplying new nodes as an arg, can supply either the root nodes array, or a singular node with { nodes: new_root_nodes } where other usual node props are ignored
    // - if supplying new nodes via an updater function, the return value must be a { nodes: new_root_nodes }
    // path must have .length  > 0
    // The tree structure overall is awkward when state cannot be mutated, as any node that is modified, or any parent nodes, must be new copies
    // (unmodified nodes and parents are ok to reuse)
    public update(path: number[], nodeUpdater: TreeNode<N> | TreeNodeUpdater<N>): TreeRootNodes<N> {
        const updater = isTreeNode(nodeUpdater) ? () => nodeUpdater : nodeUpdater;
        const nodesVisitor = (path: number[], nodes?: TreeNode<N>[]): TreeNode<N>[] | undefined =>
            nodes?.map((node, nodeIndex) => nodeIndex === path[0] ? path.length === 1 ?
                updater(node) : ({ ...node, nodes: nodesVisitor(path.slice(1), node.nodes) }) : node) ?? undefined;
        const newState = path.length === 0 ?
                isTreeNode(nodeUpdater) ? (nodeUpdater as TreeNode<N>).nodes :
                (nodeUpdater as TreeNodeUpdater<N>)({ nodes: this.state } as TreeNode<N>).nodes :
            nodesVisitor(path, this.state);
        this.setState(newState!);
        return newState!;
    }

    // reset to a whole new tree
    public reset(state: TreeRootNodes<N>) {
        this.setState(state);
    }

    // clear a node's sub items
    public clear(path: number[]) {
        this.update(path, node => ({ ...node, nodes: [] }));
    }

    // remove a node
    // path must have .length > 0
    public remove(path: number[]) { //this.setState(path.length === 0 ? new TreeState<N>() : this.updateNode(path.slice(0, -1), node => new TreeNode<N>(node.value, node.children.filter((_, childIndex) => childIndex !== path.at(-1))))); }
        if (path.length === 0) {
            throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        }
        const removeIndex = path[path.length - 1];
        this.update(path.slice(0, -1), n => ({ ...n, nodes: [...(n.nodes?.slice(0, removeIndex) ?? []), ...(n.nodes?.slice(removeIndex + 1) ?? [])] }));
    }

    // add a sub item
    public add(path: number[], node: TreeNode<N>) {
        this.update(path, (n: TreeNode<N>) => ({ ...n, nodes: [...(n.nodes ?? []), node] }));
    }

    // insert an item at a given path (sibling items after insertion point increase in index)
    // path must have .length > 0
    public insert(path: number[], node: TreeNode<N>) {
        if (path.length === 0) {
            throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        }
        const insertIndex = path[path.length - 1];
        this.update(path.slice(0, -1), n => ({ ...n, nodes: [...(n.nodes?.slice(0, insertIndex) ?? []), node, ...(n.nodes?.slice(insertIndex) ?? [])] }));
    }

    public toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}
