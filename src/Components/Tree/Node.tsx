import { useState } from 'react';
import { ItemNode } from "../App/App";
import EditableText from '../Common/EditableText';
import HoverButton from '../Common/HoverButton';
import { useTreeContext } from "../../Context/Tree";
import { TreeNode } from "../../State/Tree";
import { FaTrashCan } from 'react-icons/fa6';
import classNames from 'classnames';
import './Tree.css';

export interface NodeProps {
    title?: string;
    description?: string;
    nodes?: TreeNode<ItemNode>[];
}

export interface NodeRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    onSelect?: (item: number[]) => void;
}

export const Node = (props: NodeProps & NodeRenderProps) => {
    const [/*treeState*/, treeDispatch] = useTreeContext();

    const makeHandleChange = (key: string) => (value: string) => treeDispatch?.update(props.path, {
        title: props.title,
        description: props.description,
        nodes: props.nodes,
        [key]: value
    });
    const handleAddSubItem = () => { treeDispatch?.add(props.path, { title: "New Item", description: "fkng shoot me" }); };
    const handleRemoveItem = () => { treeDispatch?.remove(props.path); setTimeout(() => props.onSelect?.(props.path.slice(0, -1)), 0); };
    const handleSelectItem = () => { props.onSelect?.(props.path); };

    const [/*btnHoverRemove*/, setBtnHoverRemove] = useState<boolean>(false);
    const [btnHoverAdd, setBtnHoverAdd] = useState<boolean>(false);

    return (
        <div
            className={classNames({ treeNodeItem: true, treeNodeSelectedItem: props.selected ?? false })}
            onClick={handleSelectItem}
        >
            <div className="title" style={{ display: "grid", gridTemplateColumns: "1fr max-content" }}>
                <EditableText value={props.title} placeholder="Item Title" onBlur={makeHandleChange("title")} />
                <span className="actionButtons">
                    <HoverButton onClick={handleRemoveItem} onHoverChange={setBtnHoverRemove}><FaTrashCan style={{ "marginTop": "2px" }} /></HoverButton>
                    <HoverButton onClick={handleAddSubItem} onHoverChange={setBtnHoverAdd}>
                        <span style={{ "paddingTop": "3px" }}>{btnHoverAdd ? "+" : props.nodes?.length ?? "-"}</span>
                    </HoverButton>
                </span>
            </div>
            <div className="description">
                <EditableText multiple={true} value={props.description} placeholder="Item Description" onBlur={makeHandleChange("description")} />
            </div>
        </div>
    );
};

export default Node;
