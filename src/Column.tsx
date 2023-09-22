import { useState } from 'react';
import { TreeNode, TreeNodeDataProps } from './TreeNode';

export interface ColumnProps {
    items?: TreeNodeDataProps[];
    path?: number[];
    onSelectItem?: (item: TreeNodeDataProps, index: number) => void;
}

const Column = ({ items, path = [], onSelectItem }: ColumnProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number>();
    const handleSelectItem = (index: number, item: TreeNodeDataProps) => {
        setSelectedIndex(index);
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
    );         // selected={selectedItem?.path.every((pathIndex, index) == [index]}
};

export default Column;
