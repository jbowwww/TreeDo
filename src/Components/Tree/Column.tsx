import Node from './Node';
import { useTreeContext } from "../../Context/Tree";
import './Tree.css';

export interface ColumnProps {
    path?: number[];                // (absolute) root path for this column - displays sub items underneath this path
    selectedPath?: number[];
    onSelectItem?: (selectedPath: number[]) => void;
}

const Column = (props: ColumnProps) => {
    const [treeState, treeActions] = useTreeContext();
    const items = props.path ? props.path.length > 0 ? (treeActions.getNodeByPath(props.path)?.nodes ?? []) : treeState : [];

    return (
        <div className="treeColumn">
            {items?.map((item, index) => {
                const newPath = [...(props.path ?? []), index];
                const isSelected = ((props.selectedPath === undefined) || ((props.selectedPath?.length ?? 0) < newPath.length)) ? false :
                    newPath.every((p, i) => p === props.selectedPath![i]);
                return (<Node
                    {...item}
                    key={`TN${props.path?.map(p => "-" + p)}-${index}`}
                    index={index}
                    path={newPath}
                    selected={isSelected}
                    onSelect={(path: number[]) => { props.onSelectItem?.(path) }} />);
            })}
        </div>
    );
};

export default Column;
