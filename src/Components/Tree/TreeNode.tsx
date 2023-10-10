import { useTreeContext } from '../../State/Tree';
import EditableText from '../Common/EditableText';
import { useHover } from '../../Hooks/useHover';
import classNames from 'classnames';
import './Tree.css';

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
    const [/*treeState*/, treeDispatch] = useTreeContext();

    const handleItemClick = () => props.onSelect?.(props);
    const handleChangeTitle = (value: string) => treeDispatch?.update(props.path, { title: value, description: props.description, nodes: props.nodes });
    const handleChangeDescription = (value: string) => treeDispatch?.update(props.path, { title: props.title, description: value, nodes: props.nodes });
    const handleAddSubItem = () => { treeDispatch?.add(props.path, {}); props.onSelect?.(props); }

    return (
        <div
            className={classNames({ treeNodeItem: true, treeNodeSelectedItem: props.selected ?? false })}
            onClick={handleItemClick}
        >
            <div style={{ display: "grid", gridTemplateColumns: "1fr min-content" }}>
                <EditableText id="title" value={props.title} onBlur={handleChangeTitle} />
                <div style={{ float: "right" }}>
                    <button
                        ref={nodeAddButtonRef} className="treeNodeAddbutton"
                        onClick={handleAddSubItem}
                    >
                        {isNodeAddButtonHovering ? "+" : props.nodes?.length ?? "-"}
                    </button>
                </div>
            </div>
            <div>
                <EditableText id="description" multiple={true} value={props.description} onBlur={handleChangeDescription} />
            </div>
        </div>
    );
};

export default TreeNode;
