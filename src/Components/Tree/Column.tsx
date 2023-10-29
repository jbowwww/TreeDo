import Node from './Node';
import { useTreeContext } from '../../State/Tree/Context';
import './Tree.css';
import { ItemNode } from "../App/App";

export interface ColumnProps {
    path?: number[];                // (absolute) root path for this column - displays sub items underneath this path
    selectedPath?: number[];
    onSelectItem?: (selectedPath: number[]) => void;
}

const Column = (props: ColumnProps) => {
    const [treeState/*, treeDispatch*/] = useTreeContext<ItemNode>();
    const items = props.path ? (treeState.getByPath(props.path)?.children ?? []) : [];

    return (
        <div className="treeColumn">
            {items?.map((item, index) => {
                const newPath = [...(props.path ?? []), index];
                return (<Node
                    {...item.value}
                    children={item.children}
                    key={`TN${props.path?.map(p => "-" + p)}-${index}`}
                    index={index}
                    path={newPath}
                    selected={props.selectedPath?.length === 0 ? false : newPath.every((p, i) => p === props.selectedPath![i])}
                    onSelect={(/*path: number[]*/) => { props.onSelectItem?.(newPath) }} />);
            })}
        </div>
    );
};

export default Column;
