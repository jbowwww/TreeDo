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
        <div>
            <div
                style={itemStyle({ selected: selected })}
                onClick={makeHandleClick(handleSelect, { title, description, index, path, subItems })}
            >
                <div>
                    <span>{title}</span>
                    <span style={{ float: "right", }}>
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
                <div style={{ background: "rgb(64, 64, 64)", borderRadius: "6px", marginTop: "5px", padding: "4px", fontSize: "0.75em", }}>{description}</div>
            </div>
        </div>
    </>
);

export default Item;

const buttonStyle = {
    width: "2.2em",
    height: "1.6em",
};

const itemStyle = ({ selected }: { selected: boolean }) => ({
    background: selected ? "rgb(128, 128, 64)" : "rgb(6,14,6)",
    border: "1px solid grey",
    borderRadius: "10px",
    padding: "0.2em 0.4em 0.52em",
    margin: "0.8em",
});
