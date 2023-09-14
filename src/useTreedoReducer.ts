import { useReducer } from "react";
import { ItemDataProps } from "./Item";

export const getByPath = (
    state: ItemDataProps[],
    path: number[]
): ItemDataProps | undefined => {
    let item: ItemDataProps | undefined = undefined; 
    for (const index of path)
        item = item ? item.subItems[index] : state[index];
    console.debug('getByPath', 'path', path, 'state', state);
    return item;
}

export const treedoReducer = (
    state: ItemDataProps[],
    action: any
    //{ type: "CLEAR", path: number[], } |
    //{ type: "ADD", path: number[], } |
    //{ type: "REMOVE", path: number[], id: number, }
) => {
    const newState = state.map(item => ({ ...item, subItems: [...item.subItems] }));
    const item = getByPath(newState, action.path)!;
    switch (action.type) {
        case "CLEAR":
            item.subItems = [];
            break;
        case "ADD":
            item.subItems.push({
                title: "",
                description: "",
                subItems: []
            });
            break;
        case "REMOVE":
            item.subItems.splice(action.index, 1);
            break;
        default:
            break;
    }
    console.log('treedoReducer', 'action', action, 'newState', newState);
    return newState;
};

export const useTreedoReducer = (initialState: any[]) => useReducer(
    treedoReducer,
    initialState,
    items => items.map(
        item => ({
            title: item.title ?? '',
            description: item.description ?? '',
            subItems: item.subItems ?? []
        } as ItemDataProps)));
