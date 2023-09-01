import { Item, ItemData } from './Item';

interface ColumnProps {
    items: ItemData[];
}

const Column = (props: ColumnProps) => (
    <div>{props.items.map((item, index) => (
        <Item {...item} key={index} />
    ))}</div>
);

export default Column;

