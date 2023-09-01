import { useState, useEffect } from "react";

export interface ItemSizeProps {
    sizeEstimate: number;
    sizeActual?: number;
}

export interface ItemProgressProps {
    completed: number;
    remaining: number;
}

export interface ItemProps {
    index?: number;
    title: string;
    description?: string;
    parent?: ItemData;
    subItems?: ItemData[];
}

export interface ItemDataProps extends ItemProps {
    addSubItem(props?: ItemData): ItemData;
    removeSubItem(index: number): void;
    removeAllSubItems(): void;
}

export class ItemData implements ItemDataProps {
    key: number = -1;
    index?: number = 0;
    title: string = "New Item";
    description?: string = "";
    parent?: ItemData;
    subItems: ItemData[] = [];

    constructor(props?: ItemProps) {
        if (props !== undefined) {
            this.index = props.index ?? undefined;
            this.title = props.title;
            this.description = props.description;
            this.parent = props.parent;
            this.subItems = [...(props.subItems?.map(subItem => new ItemData(subItem)) || [])];
        }
    }

    addSubItem(props?: ItemData): ItemData {
        const child = props === undefined
            ? new ItemData()
            : new ItemData({
                index: props.subItems?.length ?? 0,
                title: props.title,
                description: props.description,
                parent: this,
            }); 
        this.subItems.push(child);
        console.log(`Added subitem ${child.title} (#${child.index}) to item ${this.title} #${this.index}`);
        return child;
    }

    removeSubItem(childId: number) {
        this.subItems.splice(childId, 1);
    }

    removeAllSubItems() {
        this.subItems = [];
    }
};

export const Item = (props: ItemData) => {
    const [subItems, setSubItems] = useState<ItemData[]>(props.subItems);
    const addSubItem = (subProps?: ItemData): ItemData => {
        const index = subProps?.index ?? subItems?.length ?? 0;
        const child = new ItemData({
            index,
            title: subProps?.title ?? props.title + "." + (index + 1),
            description: subProps?.description,
            parent: subProps?.parent ?? this,
            subItems: subProps?.subItems ?? [],
        });
        setSubItems([...subItems, child]);
        console.log(`Added subitem ${child.title} (#${child.index}) to item ${props?.title} #${props.index}`);
        return child;
    };
    return (
        <div key={props.index}>
            <span>{props.title}</span>
            <span>
                <button onClick={() => {
                    addSubItem(/*props*//*.parent*/);
                }}>+</button>
            </span>
            <div>{props.description}</div>
        </div>
    );
};
    
    //const addSubItem = props?.addSubItem?.bind(props);
    //    (parent: ItemData): ItemData => {
    //    return parent.addSubItem();
    //}
    //
    //);
//};

//const style = {
    //onmouseenter={/*set URL hand pointer*/ }
    //href={}
    //description?: string,
//};

//Item.prototype = ItemData;//Item.prototype = ItemData;

export default Item;
