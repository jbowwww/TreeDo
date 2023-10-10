import TreeNode from './TreeNode';
import { useTreeContext } from '../../State/Tree';
import './Tree.css';

export interface ColumnProps {
    path: number[];                // (absolute) root path for this column - displays sub items underneath this path
    selectedPath?: number[];
    onSelectItem?: (selectedPath: number[]) => void;
}

const Column = (props: ColumnProps) => {
    const [/*treeState*/, treeDispatch] = useTreeContext();
    const items = props.path ? (treeDispatch?.getNode(props.path)?.nodes ?? []) : [];

    return (
        <div className="treeColumn">
            {items?.map((item, index) => {
                const newPath = [...(props.path ?? []), index];
                return (<TreeNode
                    {...item}
                    key={`TN${props.path?.map(p => "-" + p)}-${index}`}
                    index={index}
                    path={newPath}
                    selected={props.selectedPath?.length === 0 ? false : newPath.every((p, i) => p === props.selectedPath![i])}
                    onSelect={() => props.onSelectItem?.(newPath)} />);
            })}
        </div>
    );
};

export default Column;
