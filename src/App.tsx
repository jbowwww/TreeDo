import { useState } from 'react';
import Column from './Column';
import { ItemDataProps, ItemProps } from './Item';
import { useTreedoReducer } from './useTreedoReducer';

export const App = () => {
    const [itemsState, itemsDispatch] = useTreedoReducer(items);
    const [itemsStateColumnTwo, setItemsStateColumnTwo] = useState<ItemDataProps[]>([]);

    const makeHandleColumnItemSelect = (columnIndex: number) => (args: ItemProps): void => {
        console.debug('App.handleColumnItemSelect', 'columnIndex', columnIndex, 'args', args);
        if (columnIndex === 0)
            setItemsStateColumnTwo(args.subItems);
    };

    return (
        <div style={appStyle}>
            {/*<TreedoContext.Provider value={{ state: itemsState, dispatch: itemsDispatch }} >*/}
            <Column items={itemsState} dispatch={itemsDispatch} handleSelect={makeHandleColumnItemSelect(0)} />
            <Column items={itemsStateColumnTwo} dispatch={itemsDispatch} />
            <Column items={[]} dispatch={itemsDispatch} />
            {/*</TreedoContext.Provider>*/}
        </div>
    );

};

const items = [{
    title: "Item 1", description: "Description 1", subItems: [{
        title: "Item 1.1", description: "Description 1.1", }, {
        title: "Item 1.2", description: "Description 1.2", }] }, {
    title: "Item 2", description: "Description 2", subItems: [{
        title: "Item 2.1", description: "Description 2.1", }, {
        title: "Item 2.2", description: "Description 2.2", }] }, {
    title: "Item 3", description: "Description 3", }, {
    title: "Item 4", description: "Description 4", }];

export const appStyle = {
    display: "grid",
    height: "880px",
    gridTemplateColumns: "0.6fr 0.9fr 0.6fr",
    gridTemplateRows: "1fr",
    gridGap: 20
};
