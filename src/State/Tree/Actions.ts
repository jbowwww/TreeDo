import { Dispatch } from "react";
import { TreeNode, TreeNodeData, TreeState } from "./State";

export class TreeActions<N> {
    constructor(
        public readonly state: TreeState<N>,
        public readonly setState: Dispatch<React.SetStateAction<TreeState<N>>>
    ) { }

    private updateNode(path: number[], nodeUpdater: (node: TreeNodeData<N>) => TreeNodeData<N>): TreeState<N> {
        const nodesVisitor = (path: number[], children?: TreeNodeData<N>[]): TreeNodeData<N>[] =>
            children?.map((child, childIndex) => childIndex === path[0] ?
                path.length === 1 ? nodeUpdater(child) :
                    new TreeNode<N>({ value: child.value, children: nodesVisitor(path.slice(1), child.children) }) : child) ?? [];
        const newState = path.length === 0 ? new TreeState<N>() : new TreeState<N>(nodesVisitor(path, this.state.children));
        this.setState(newState);
        return newState;
    }

    clear(path: number[]) { this.updateNode(path, node => new TreeNode<N>({ value: node as N })); }
    remove(path: number[]) { //this.setState(path.length === 0 ? new TreeState<N>() : this.updateNode(path.slice(0, -1), node => new TreeNode<N>(node.value, node.children.filter((_, childIndex) => childIndex !== path.at(-1))))); }
        //if (path.length === 0) {
        //    throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        //}
        const removeIndex = path.pop()!;
        this.updateNode(path, n => new TreeNode<N>({ value: n.value, children: n.children?.splice(removeIndex, 1) }));
    }
    add(path: number[], node: TreeNodeData<N>) {
        if (path.length === 0) {
            this.setState(new TreeState<N>([...this.state.children ?? [], node]));
        } else {
            this.updateNode(path, (n: TreeNodeData<N>) => new TreeNode<N>({ value: n.value, children: [...(n.children ?? []), node] }));
        }
    }
    insert(path: number[], node: TreeNode<N>) {
        if (path.length === 0) {
            throw new Error(`TreeActions.insert() requires path.length > 0, last path component is the position to insert in at the node path specified by the lead portion of the path`);
        }
        const insertIndex = path.pop()!;
        this.setState(path.length === 0 ? new TreeState<N>(this.state.children?.splice(insertIndex, 0, node)) :
            this.updateNode(path, n => new TreeNode<N>({ value: n.value, children: n.children?.splice(insertIndex, 0, node) }))
        );
    }
    update(path: number[], node: TreeNodeData<N>) { this.updateNode(path, () => node); }

    toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.state);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
}
