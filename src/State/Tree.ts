import { useMemo, useState, Dispatch } from "react";

export type TreeNodeBase<N> = {
    nodes?: TreeNode<N>[];
};
export type TreeNode<N> = N & TreeNodeBase<N>;
export type TreeRoot<N, R = object> = R & TreeNodeBase<N>;
export type TreeNodeUpdater<N> = ((node: TreeNodeBase<N>) => TreeNodeBase<N>);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTreeNode = <N = unknown>(node: any): node is TreeNode<N> => typeof node === 'object' && Array.isArray(node?.nodes);
// Don't expect to use these outside this file without trouble, hence no exporting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTreeNodeRoot = <N = unknown, R = object>(node: any): node is TreeRoot<N, R> => typeof node === 'object' && Array.isArray(node?.nodes);

export const useTreeState = <N, R extends object = object>(initialState: TreeRoot<N, R>): [TreeRoot<N, R>, TreeActions<N, R>] => {
    const [state, setState] = useState<TreeRoot<N, R>>(initialState);
    const actions = useMemo(() => new TreeActions<N, R>(state, setState), [state, setState]);
    return [state, actions];
};

export class TreeActions<N, R = object> {
    // technically this means N exists as a singular root at the tree, and I think it could be used like this, but really I'm ignoring
    // all members of this.state except for .nodes, treating the tree like its root is a list of nodes (N & { nodes: TreeNode<N>[] })
    constructor(
        public readonly state: TreeRoot<N, R>,
        public readonly setState: Dispatch<React.SetStateAction<TreeRoot<N, R>>>
    ) { }

    // path must have .length > 0
    public getNodeByPath = (path: number[]): TreeNode<N> => {
        return path.reduce<TreeNodeBase<N>>((node, p) => (node.nodes ?? [])?.[p], this.state) as TreeNode<N>;
    }

    // Update a node at a given path, either with a supplied new node or an updater function that takes the current node and returns a new one
    // Now can update the root nodes (plural - there is no single root node) with same arguments, just note:
    // - if supplying new nodes as an arg, can supply either the root nodes array, or a singular node with { nodes: new_root_nodes } where other usual node props are ignored
    // - if supplying new nodes via an updater function, the return value must be a { nodes: new_root_nodes }
    // path must have .length  > 0
    // The tree structure overall is awkward when state cannot be mutated, as any node that is modified, or any parent nodes, must be new copies
    // (unmodified nodes and parents are ok to reuse)
    public update(path: number[], update: TreeNode<N> | TreeRoot<N, R> | TreeNodeUpdater<N>): TreeRoot<N, R> {
        const updater = isTreeNode(update) ? () => update : update;
        const nodesVisitor = (path: number[], nodes?: TreeNode<N>[]): TreeNode<N>[] | undefined =>
            nodes?.map<TreeNode<N>>((node, nodeIndex) =>
                nodeIndex === path[0] ?
                    path.length === 1 ?
                        updater(node) as TreeNode<N> :
                        ({ ...node, nodes: nodesVisitor(path.slice(1), node.nodes) } as TreeNode<N>) :
                    node)
            ?? undefined;
        const newState: TreeRoot<N, R> = path.length === 0 ?
            isTreeNodeRoot(update) ? (update as TreeRoot<N, R>) :
                (update as TreeNodeUpdater<N>)({ ...this.state, nodes: this.state.nodes as TreeNode<N>[] }) as TreeRoot<N, R> :
            { ...this.state, nodes: nodesVisitor(path, this.state.nodes) };
        this.setState(newState as TreeRoot<N, R>);
        return newState! as TreeRoot<N, R>;
    }

    // reset to a whole new tree
    public reset(state: TreeNodeBase<N> = { nodes: [] }) {
        this.setState(state as TreeRoot<N, R>);
    }

    // clear a node's sub items
    public clear(path: number[], clear: TreeNode<N>[] = []) {
        this.update(path, node => ({ ...node, nodes: clear }));
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
        this.update(path, n => ({ ...n, nodes: [...(n.nodes ?? []), node] }));
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

    // return an object that will work on a specific node path only
    public node(path: number[]) {
        return {
            remove: () => this.remove(path),
            update: (update: TreeNode<N> | TreeNodeUpdater<N>) => this.update(path, update),
            clear: (clear: TreeNode<N>[] = []) => this.clear(path, clear),
            add: (add: TreeNode<N>) => this.add(path, add),
            insert: (insert: TreeNode<N>) => this.insert(path, insert),
        };
    }

    public toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}
