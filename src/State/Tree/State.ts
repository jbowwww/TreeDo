
// State has methods (one for now - getByPath) - but they do NOT modify the state, only read some part of it.
// Anything that mutates state (which is does by cloning a new state to modify) will be in TreeActions.

export interface TreeStateData<N> {
    children?: TreeNodeData<N>[];
}

export class TreeState<N> implements TreeStateData<N> {
    children?: TreeNode<N>[];
    constructor(children: TreeNodeData<N>[] = [] ) {
        this.children = children.map(child => new TreeNode<N>(child));
    }
    getByPath(path: number[]): TreeNode<N> | TreeState<N> | undefined {
        if (path.length > 0)
            return this.children?.[path[0]].getByPath(path.slice(1));
        return this;
    }
}

export interface TreeNodeData<N> extends TreeStateData<N> {
    value: N;
}

export class TreeNode<N> extends TreeState<N> implements TreeNodeData<N> {
    value: N;

    constructor({ value, children }: { value: N, children?: TreeNodeData<N>[] }) {
        super(children);
        this.value = value;
    }

    valueOf(): N { return this.value; }     // this might let me use both Objects and primitives for N e.g. string, while still having child nodes (without having to do node.value)

    getByPath(path: number[]): TreeNode<N> | undefined {
        return path.length === 0 ? this : this.children?.[path[0]].getByPath(path.slice(1));
    }
}
