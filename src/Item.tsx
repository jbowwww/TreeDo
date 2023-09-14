import { Dispatch, MouseEvent } from "react";

export interface ItemSizeProps {
    sizeEstimate: number;
    sizeActual?: number;
}

export interface ItemProgressProps {
    completed: number;
    remaining: number;
}

export interface ItemDataProps {
    title: string;
    description?: string;
    //parent?: ItemDataProps;
    subItems: Array<ItemDataProps>;
}

export interface ItemRenderProps {
    index: number;
    path: number[];
    selected?: boolean;
    dispatch?: Dispatch<any>;
    handleSelect?: (args: ItemProps) => void;
}

//export interface ItemDataProps extends ItemProps {
//    addSubItem(props?: ItemData): ItemData;
//    removeSubItem(index: number): void;
//    removeAllSubItems(): void;
//}

export type ItemProps = ItemDataProps & ItemRenderProps;

const makeHandleClick = (handleSelect: ((args: ItemProps) => void) | undefined, item: ItemProps) =>
    handleSelect !== undefined
        ? ({ }: MouseEvent) => handleSelect(item)
        : ({ }: MouseEvent) => { };

export const Item = ({
    title,
    description = "",
    subItems = [],
    index = 0,
    path = [0],
    selected = false,
    dispatch,
    handleSelect
}: ItemProps) => (
    <>
        <div
            style={itemStyle({ selected: selected })}
            onClick={makeHandleClick(handleSelect, { title, description, index, path, subItems })}
        >
            <span>{title}</span>
            <span>
                <button
                    style={buttonStyle}
                    onClick={() => {
                        if (dispatch !== undefined)
                            dispatch({ type: "ADD", path });
                    }}>
                    +
                </button>
            </span>
        </div>
        <div>{description}</div>
    </>
);

export default Item;

const buttonStyle = {
    width: "1em",
    height: "1em",
};

const itemStyle = ({ selected }: { selected: boolean }) => ({
    background: selected ? "yellow" : "rgb(6,14,6)",
    border: "1px solid grey",
});
