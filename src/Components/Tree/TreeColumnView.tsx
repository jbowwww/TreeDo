import { useState } from 'react';
import Column from './TreeColumn';
import { TreeNodeProps } from './TreeNode';

export interface TreeColumnViewProps {
    basePath?: number[];
};

export const TreeColumnView = ({ basePath = [] }: TreeColumnViewProps) => {
    const [column1SelectedIndex, setColumn1SelectedIndex] = useState<number | undefined>();
    const [column2SelectedIndex, setColumn2SelectedIndex] = useState<number | undefined>();
    const [column3SelectedIndex, setColumn3SelectedIndex] = useState<number | undefined>();

    const column2Path = column1SelectedIndex !== undefined ?
        [...basePath, column1SelectedIndex] : undefined;
    const column3Path = column2Path !== undefined && column2SelectedIndex !== undefined ?
        [...column2Path, column2SelectedIndex] : undefined;
    const setColumnSelectedIndex = [
        setColumn1SelectedIndex,
        setColumn2SelectedIndex,
        setColumn3SelectedIndex
    ];

    const makeHandleColumnSelectItem = (columnIndex: number) =>
        (item: TreeNodeProps, index: number) => {
            setColumnSelectedIndex[columnIndex](index);
            console.debug(`App: Column #${columnIndex}.onSelectItem(${item}, ${index})`);
        };

    return (
        <div style={treeColumnViewStyle} >
            <Column key={0} path={basePath} selectedIndex={column1SelectedIndex} onSelectItem={makeHandleColumnSelectItem(0)} />
            <Column key={1} path={column2Path} selectedIndex={column2SelectedIndex} onSelectItem={makeHandleColumnSelectItem(1)} />
            <Column key={2} path={column3Path} selectedIndex={column3SelectedIndex} onSelectItem={makeHandleColumnSelectItem(2)} />
        </div>
    );
}

const treeColumnViewStyle = {
    display: "grid",
    height: "880px",
    gridTemplateColumns: "0.6fr 0.9fr 0.6fr",
    gridTemplateRows: "1fr",
    gridGap: "20px",
};
