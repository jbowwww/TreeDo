import { useReducer } from "react";
import { TreeNodeProps } from "../Components/Tree/TreeNode";
import { TreeDispatch, treeReducer } from "./TreeDispatch";

// The tree reducer, state, and dispatch objects are created here
export const useTree = (initialState: TreeNodeProps[]): [TreeState, TreeDispatch] => {
    const [/*rawS*/state, rawDispatch] = useTreeReducer(new TreeState(initialState));
    const dispatch = new TreeDispatch(rawDispatch);
    return [state, dispatch];
};

// The tree state is actually created here with the reducer
export const useTreeReducer = (initialState: TreeState) => useReducer(treeReducer, initialState);

export class TreeState {
    constructor(public readonly nodes: Array<TreeNodeProps> = []) { }

    getNode(path: number[]) {
        return path.reduce<TreeNodeProps>((acc, pathPart) => acc.nodes?.[pathPart] ?? {}, { nodes: this.nodes });
    }

    updateNode(path: number[], nodeUpdater: (node: TreeNodeProps) => TreeNodeProps) {
        return new TreeState((function nodesVisitor(relativePath: number[], nodes?: TreeNodeProps[]): TreeNodeProps[] | undefined {
            return relativePath.length === 0 ? nodeUpdater({ nodes }).nodes : nodes?.map((subNode, subNodeIndex) =>
                subNodeIndex === relativePath?.[0] ? relativePath.length === 1 ? nodeUpdater(subNode) :
                    { ...subNode, nodes: nodesVisitor(relativePath.slice(1), subNode.nodes) } : subNode) ?? [];
        })(path, this.nodes));
    }

    toJSON(/*options: any*/) {
        const jsonData = JSON.stringify(this.nodes);
        window.document.textContent = jsonData;
        //const jsonFile = jsonData, "tree.json", { endings: "transparent", type: "text/json" });\
    }
};
