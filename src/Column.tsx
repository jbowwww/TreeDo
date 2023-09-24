import TreeNode, { TreeNodeProps } from './TreeNode';
import { useTreeContext } from './TreeContext';

export interface ColumnProps {
    path?: number[];
    selectedIndex?: number;
    onSelectItem?: (item: TreeNodeProps, index: number) => void;
}

const Column = ({ path, selectedIndex, onSelectItem }: ColumnProps) => {
    const [treeState,] = useTreeContext();
    const items = path ? treeState?.getNodeByPath(path).nodes : undefined;
    const handleSelectItem = (index: number, item: TreeNodeProps) => {
        onSelectItem?.(item, index);
    };

    return (
        <div>
            {path && items && items.map((item, index) => (
                <TreeNode
                    {...item}
                    key={index}
                    index={index}
                    path={[...path, index]}
                    selected={selectedIndex === index}
                    onSelect={item => handleSelectItem(index, item)} />
            ))}
        </div>
    );
};

export default Column;
