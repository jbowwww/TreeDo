import { useState } from "react";
import { useTreeDispatchContext } from "./TreeContext";
import EditableText from "../Common/EditableText";

export interface TreeNodeProps {
    title?: string;
    description?: string;
    nodes?: TreeNodeProps[];
}

export interface TreeNodeRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    onSelect?: (args: TreeNodeProps) => void;
};

export const TreeNode = (props: TreeNodeProps & TreeNodeRenderProps) => {
    const [displayAddItemIcon, setDisplayAddItemIcon] = useState(false);
    const toggleDisplayAddItemIcon = (value?: boolean) => setDisplayAddItemIcon(prev => value ?? !prev);
    const treeDispatch = useTreeDispatchContext();

    const handleItemClick = () => props.onSelect?.(props);
    const handleChangeTitle = (value: string) => treeDispatch?.update(props.path, { title: value, description: props.description, nodes: props.nodes });
    const handleChangeDescription = (value: string) => treeDispatch?.update(props.path, { title: props.title, description: value, nodes: props.nodes });

    return (
        <div style={itemStyle({ selected: props.selected ?? false })} onClick={handleItemClick}>
            <div>
                <EditableText name="title" value={props.title} onBlur={handleChangeTitle} />
                <div style={{ float: "right" }}>
                    <button style={buttonStyle}
                        onClick={() => {
                            treeDispatch?.add(props.path, {});
                            props.onSelect?.(props);
                        }}
                        onMouseOver={() => toggleDisplayAddItemIcon(true)}
                        onMouseOut={() => toggleDisplayAddItemIcon(false)}
                    >
                        <div style={addItemIconStyle({ displayAddItemIcon: !displayAddItemIcon })}>{props.nodes?.length ?? "-"}</div>
                        <div style={addItemIconStyle({ displayAddItemIcon: displayAddItemIcon })}>+</div>
                    </button>
                </div>
            </div>
            <div style={itemDescriptionStyle}>
                <EditableText name="description" value={props.description} onBlur={handleChangeDescription} />
            </div>
        </div>
    );
};

export default TreeNode;

const buttonStyle = {
    width: "2.2em",
    height: "1.6em",
    padding: "0px",
    margin: "0px",
};

const itemStyle = ({ selected = false, }: { selected: boolean, }) => ({
    background: selected ? "rgb(128, 128, 64)" : "rgb(6,14,6)",
    border: "1px solid grey",
    borderRadius: "10px",
    padding: "0.2em 0.4em 0.52em",
    margin: "0.8em",
});

const addItemIconStyle = ({ displayAddItemIcon = false, }: { displayAddItemIcon: boolean, }) => ({
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
