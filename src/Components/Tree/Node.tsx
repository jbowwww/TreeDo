import { useState } from 'react';
import { useTreeContext } from '../../State/Tree/Context';
import EditableText from '../Common/EditableText';
import HoverButton from '../Common/HoverButton';
import { FaTrashCan } from 'react-icons/fa6';
import classNames from 'classnames';
import './Tree.css';
import { ItemNode } from "../App/App";
import { TreeNodeData } from "../../State/Tree/State";

export interface NodeProps {
    title?: string;
    description?: string;
    children?: TreeNodeData<ItemNode>[];
}

export interface NodeRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    onSelect?: (item: number[]) => void;
}

export const Node = (props: NodeProps & NodeRenderProps) => {
    const [/*treeState*/, treeDispatch] = useTreeContext<ItemNode>();

    const handleChangeTitle = (value: string) => treeDispatch?.update(props.path, { value: { title: value, description: props.description }, children: props.children });
    const handleChangeDescription = (value: string) => treeDispatch?.update(props.path, { value: { title: props.title, description: value }, children: props.children });
    const handleAddSubItem = () => { treeDispatch?.add(props.path, { value: { title: "New Item" } }); props.onSelect?.(props.path); };
    const handleRemoveItem = () => { treeDispatch?.remove(props.path); props.onSelect?.(props.path.slice(0, -1)); };

    const [/*btnHoverRemove*/, setBtnHoverRemove] = useState<boolean>(false);
    const [btnHoverAdd, setBtnHoverAdd] = useState<boolean>(false);

    return (
        <div
            className={classNames({ treeNodeItem: true, treeNodeSelectedItem: props.selected ?? false })}
            onClick={() => props.onSelect?.(props.path)}
        >
            <div className="title" style={{ display: "grid", gridTemplateColumns: "1fr max-content" }}>
                <EditableText value={props.title} placeholder="Item Title" onBlur={handleChangeTitle} />
                <span className="actionButtons">
                    <HoverButton onClick={handleRemoveItem} onHoverChange={setBtnHoverRemove}><FaTrashCan style={{ "marginTop": "2px" }} /></HoverButton>
                    <HoverButton onClick={handleAddSubItem} onHoverChange={setBtnHoverAdd}>
                        <span style={{ "paddingTop": "3px" }}>{btnHoverAdd ? "+" : props.children?.length ?? "-"}</span>
                    </HoverButton>
                </span>
            </div>
            <div className="description">
                <EditableText multiple={true} value={props.description} placeholder="Item Description" onBlur={handleChangeDescription} />
            </div>
        </div>
    );
};

export default Node;
