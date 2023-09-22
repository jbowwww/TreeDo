import { useState } from 'react';
import Column from './Column';
import { TreeDispatchContext, getTreeByPath, useTree } from './TreeContext';
//import { TreeNodeProps } from './Item';

export const App = () => {
    const [treeState, treeDispatch] = useTree(items);
    //const [column2Items, setColumn2Items] = useState <TreeNodeProps[]>();
    const [column2Path, setColumn2Path] = useState<number[]>();
    //const [column3Items, setColumn3Items] = useState<TreeNodeProps[]>();
    const [column3Path, setColumn3Path] = useState<number[]>();

    return (
        <div style={appStyle}>
            <TreeDispatchContext.Provider value={treeDispatch}>
                <Column
                    items={treeState}
                    path={[]}
                    onSelectItem={(item, index) => {
                        //setColumn2Items(item.subItems);
                        setColumn2Path([index]);
                        setColumn3Path(undefined);
                        console.debug(`App: Column #1.onSelectItem(${item}, ${index})`);
                    }}
                />
                <Column
                    items={column2Path ? getTreeByPath(treeState, column2Path)?.subItems : undefined}
                    path={column2Path}
                    onSelectItem={(item, index) => {
                        //setColumn3Items(item.subItems);
                        setColumn3Path([...column2Path ?? [], index]);
                        console.debug(`App: Column #2.onSelectItem(${item}, ${index})`);
                    }}
                />
                <Column
                    items={column3Path ? getTreeByPath(treeState, column3Path)?.subItems : undefined}
                    path={column3Path}
                    onSelectItem={(item, index) => {
                        console.debug(`App: Column #3.onSelectItem(${item}, ${index})`);
                    }}
                />
            </TreeDispatchContext.Provider>
        </div>
    );
};

const items: any = [{
    title: "Item 1", description: "Description 1", subItems: [{
        title: "Item 1.1", description: "Description 1.1",
    }, {
        title: "Item 1.2", description: "Description 1.2",
    }]
}, {
    title: "Item 2", description: "Description 2", subItems: [{
        title: "Item 2.1", description: "Description 2.1",
    }, {
        title: "Item 2.2", description: "Description 2.2",
    }]
}, {
    title: "Item 3", description: "Description 3",
}, {
    title: "Item 4", description: "Description 4",
}];

export const appStyle = {
    display: "grid",
    height: "880px",
    gridTemplateColumns: "0.6fr 0.9fr 0.6fr",
    gridTemplateRows: "1fr",
    gridGap: 20
};
