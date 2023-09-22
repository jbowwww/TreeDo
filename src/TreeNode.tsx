import { useState } from "react";
import { useTreeDispatch } from "./TreeContext";

export interface TreeNodeDataProps {
    title?: string;
    description?: string;
    subItems: TreeNodeDataProps[];
};
export type TreeSparseNodeProps = Partial<TreeNodeDataProps>;

// This is a concrete implementation of a TreeNode that implements TreeNodeProps,
// but can be initialised using only TreeSparseNodeProps.
// This simply allows for terser definitions of tree node state data. (see App.ts)
// A completely empty tree node can be created with no title, or subItems (or just some of these).
export class TreeNodeData implements TreeNodeDataProps {
    title?: string;
    description?: string;
    subItems: TreeNodeDataProps[];
    constructor(props: TreeSparseNodeProps = {}) {
        this.title = props.title;
        this.description = props.description;
        this.subItems = props.subItems?.map(node => new TreeNodeData(node)) ?? [];
    }
}

export interface TreeNodeRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    onSelect?: (args: TreeNodeProps) => void;
};

export type TreeNodeProps = TreeNodeDataProps & TreeNodeRenderProps;

export const TreeNode = (props: TreeNodeProps) => {
    const [displayAddItemIcon, setDisplayAddItemIcon] = useState(false);
    const toggleDisplayAddItemIcon = (value?: boolean) => setDisplayAddItemIcon(prev => value ?? !prev);
    const treeDispatch = useTreeDispatch();

    const handleItemClick = () => {
        props.onSelect?.(props);
    };

    return (<div
        style={itemStyle({ selected: props.selected ?? false })}
        onClick={handleItemClick}
    >
        <div>
            <span>
                {props.title ?? <span>&nbsp;</span>}
                <span style={{ float: "right" }}>
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            treeDispatch?.add(props.path, { });
                            props.onSelect?.(props);
                        }}
                        onMouseOver={() => toggleDisplayAddItemIcon(true)}
                        onMouseOut={() => toggleDisplayAddItemIcon(false)}
                    >
                        <div style={addItemIconStyle({ displayAddItemIcon: !displayAddItemIcon }) }>
                            {props.subItems.length}
                        </div>
                        <div style={addItemIconStyle({ displayAddItemIcon: displayAddItemIcon }) }>
                            +
                        </div>
                    </button>
                </span>
            </span>
        </div>
        <div style={itemDescriptionStyle}>
            {props.description ?? <span>&nbsp;</span>}
        </div>
    </div>);
};

export default TreeNode;

const buttonStyle = {
    width: "2.2em",
    height: "1.6em",
    padding: "0px",
    margin: "0px",
};

const itemStyle = ({
    selected = false,
}: {
    selected: boolean,
}) => ({
    background: selected ? "rgb(128, 128, 64)" : "rgb(6,14,6)",
    border: "1px solid grey",
    borderRadius: "10px",
    padding: "0.2em 0.4em 0.52em",
    margin: "0.8em",
});

const addItemIconStyle = ({
    displayAddItemIcon = false,
}: {
    displayAddItemIcon: boolean,
}) => ({
    display: displayAddItemIcon ? "inline-flex" : "none",
    background: "rgb(4, 24, 8)",
    margin: "0px",
    padding: "0px",
    top: "0px",
});

const itemDescriptionStyle = {
    background: "rgb(64, 64, 64)",
    borderRadius: "6px",
    marginTop: "5px",
    padding: "4px",
    fontSize: "0.75em",
};
