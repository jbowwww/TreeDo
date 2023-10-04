import { useTreeDispatchContext } from "./TreeContext";
import EditableText from "../Common/EditableText";
import { useHover } from "../../Hooks/useHover";
import './Tree.css';
import classNames from 'classnames';

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
    const [nodeAddButtonRef, isNodeAddButtonHovering] = useHover<HTMLButtonElement>();
    const treeDispatch = useTreeDispatchContext();

    //const handleItemClick = () => props.onSelect?.(props);
    const handleChangeTitle = (value: string) => treeDispatch?.update(props.path, { title: value, description: props.description, nodes: props.nodes });
    const handleChangeDescription = (value: string) => treeDispatch?.update(props.path, { title: props.title, description: value, nodes: props.nodes });

    return (
        <div className={classNames({
            treeNodeItem: true,
            treeNodeSelectedItem: props.selected ?? false
        })} onClick={() => props.onSelect?.(props)}>
            <div>
                <EditableText id="title" value={props.title} onBlur={handleChangeTitle} />
                <div style={{ float: "right" }}>
                    <button
                        ref={nodeAddButtonRef} className="treeNodeAddbutton"
                        onClick={() => treeDispatch?.add(props.path, {})}>
                        {isNodeAddButtonHovering ? "+" : props.nodes?.length ?? "-"}
                    </button>
                </div>
            </div>
            <div>
                <EditableText id="description" value={props.description} onBlur={handleChangeDescription} />
            </div>
        </div>
    );
};

export default TreeNode;
