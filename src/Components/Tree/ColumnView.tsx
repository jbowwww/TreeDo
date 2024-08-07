﻿import { useState } from 'react';
import { useTreeContext } from "../../Context/Tree";
import Column from './Column';
import classNames from 'classnames';

export interface ColumnViewProps {
    basePath?: number[];
}

export const ColumnView = ({ basePath = [] }: ColumnViewProps) => {
    // currently selected (absolute) path describes 0 or more selected items selected in each column, by removing
    // first basePath.length items in selectedPath, the next items (if they exist) in the path array are the column selections
    // so selectedPath[N] is the selected item index in column N
    const [selectedPath, setSelectedPath] = useState<number[]>([]);
    const [/*treeState*/, treeActions] = useTreeContext();
    const lastColumnDepth = selectedPath.length - basePath.length;
    const lastColumnDisplay = selectedPath && (selectedPath.length > 0) && ((treeActions.getNodeByPath(selectedPath)?.nodes?.length ?? 0) > 0);
    const columnDisplayCount = lastColumnDepth + (lastColumnDisplay ? 1 : 0);

    const handleSelectedItem = (newPath: number[]) => {
        setSelectedPath(newPath);
    };

    return (
        <div className="treeColumnView">
            <div className={classNames({
                treeColumnView1: 1,
                treeColumnView2: columnDisplayCount > 1,
                treeColumnView3: columnDisplayCount > 2,
            })}>
                <div>&nbsp;</div>
                <Column
                    path={basePath}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <Column
                    path={columnDisplayCount < 2 ? undefined : [...basePath, selectedPath[0]]}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <Column
                    path={columnDisplayCount < 3 ? undefined : [...basePath, selectedPath[0], selectedPath[1]]}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <div>&nbsp;</div>
            </div>
        </div>
    );
}
