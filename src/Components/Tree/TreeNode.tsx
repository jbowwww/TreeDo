import { useTreeContext } from '../../State/Tree';
import EditableText from '../Common/EditableText';
import classNames from 'classnames';
import './Tree.css';
import HoverButton from '../Common/HoverButton';
import { FaTrashCan } from 'react-icons/fa6';
import { useState } from 'react';

export interface TreeNodeProps {
    title?: string;
    description?: string;
    nodes?: TreeNodeProps[];
}

export interface TreeNodeRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    onSelect?: (item: number[]) => void;
};

export const TreeNode = (props: TreeNodeProps & TreeNodeRenderProps) => {
    const [/*treeState*/, treeDispatch] = useTreeContext();

    const handleChangeTitle = (value: string) => treeDispatch?.update(props.path, { title: value, description: props.description, nodes: props.nodes });
    const handleChangeDescription = (value: string) => treeDispatch?.update(props.path, { title: props.title, description: value, nodes: props.nodes });
    const handleAddSubItem = () => { treeDispatch?.add(props.path, { title: "New Item" }); props.onSelect?.(props.path); };
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
                        <span style={{ "paddingTop": "3px" }}>{btnHoverAdd ? "+" : props.nodes?.length ?? "-"}</span>
                    </HoverButton>
                </span>
            </div>
            <div className="description">
                <EditableText multiple={true} value={props.description} placeholder="Item Description" onBlur={handleChangeDescription} />
            </div>
        </div>
    );
};

export default TreeNode;
