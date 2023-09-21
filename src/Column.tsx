import { useState } from 'react';
import { Item, ItemDataProps } from './Item';

export interface ColumnProps {
    items?: ItemDataProps[];
    path?: number[];
    onSelectItem?: (item: ItemDataProps, index: number) => void;
}

const Column = ({ items, path = [], onSelectItem }: ColumnProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number>();
    const handleSelectItem = (index: number, item: ItemDataProps) => {
        setSelectedIndex(index);
        onSelectItem?.(item, index);
    };

    return (
        <div>
            {path && items && items.map((item, index) => (
                <Item
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
