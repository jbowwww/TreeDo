import TreeNode, { TreeNodeProps } from './TreeNode';
import { useTreeContext } from './TreeContext';

export interface ColumnProps {
    path?: number[];
    selectedIndex?: number;
    onSelectItem?: (item: TreeNodeProps, index: number) => void;
}

const Column = ({ path, selectedIndex, onSelectItem }: ColumnProps) => {
    const [treeState,] = useTreeContext();
    const items = path ? treeState?.getNode(path).nodes : undefined;
    const handleSelectItem = (index: number, item: TreeNodeProps) => {
        onSelectItem?.(item, index);
    };

    return (
        <div>
            {path && items && items.map((item, index) => {
                const newPath = [...path, index];
                return (
                    <TreeNode
                        {...item}
                        key={`TN-${newPath.join('-')}`}
                        index={index}
                        path={newPath}
                        selected={selectedIndex === index}
                        onSelect={item => handleSelectItem(index, item)} />
                );
            })}
        </div>
    );
};

export default Column;
