import { Dispatch, useState } from 'react';
import { Item, ItemDataProps, ItemProps } from './Item';

export interface ColumnProps {
    items: ItemDataProps[];
    dispatch: Dispatch<any>;
    handleSelect?: (args: ItemProps) => void;
}

const Column = ({ items = [], dispatch = () => { }, handleSelect }: ColumnProps) => {
    const [selectedItem, setSelectedItem] = useState<ItemProps | undefined>(undefined);

    const innerHandleSelect = (args: ItemProps): void => {
        setSelectedItem(args);
        if (handleSelect !== undefined)
            handleSelect(args);
    };

    return (
        <div>
            {items.map((item, index) => (
                <Item
                    {...item}
                    key={index}
                    index={index}
                    path={[index]}
                    selected={selectedItem?.path[0] === index}
                    dispatch={dispatch}
                    handleSelect={innerHandleSelect} />
            ))}
        </div>
    );         // selected={selectedItem?.path.every((pathIndex, index) == [index]}
};

export default Column;
