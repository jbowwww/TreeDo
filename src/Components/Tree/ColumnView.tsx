import { useState } from 'react';
import Column from './Column';
import { useTreeContext } from '../../State/Tree/Context';
import classNames from 'classnames';
import { ItemNode } from "../App/App";

export interface ColumnViewProps {
    basePath?: number[];
}

export const ColumnView = ({ basePath = [] }: ColumnViewProps) => {
    // currently selected (absolute) path describes 0 or more selected items selected in each column, by removing
    // first basePath.length items in selectedPath, the next items (if they exist) in the path array are the column selections
    // so selectedPath[N] is the selected item index in column N
    const [selectedPath, setSelectedPath] = useState<number[]>([]);
    const [treeState/*, treeDispatch*/] = useTreeContext<ItemNode>();
    const lastColumnDepth = selectedPath.length - basePath.length;
    const lastColumnDisplay = (treeState?.getByPath(selectedPath)?.children?.length ?? 0) > 0;
    const columnDisplayCount = lastColumnDepth + (lastColumnDisplay ? 1 : 0);

    const sanitisePath = (path: number[]) => path.filter(p => p !== undefined);
    const handleSelectedItem = (newRelativePath: number[]) => {
        setSelectedPath([...basePath, ...newRelativePath]);
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
                    path={columnDisplayCount < 2 ? undefined : sanitisePath([...basePath, selectedPath[0]])}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <Column
                    path={columnDisplayCount < 3 ? undefined : sanitisePath([...basePath, selectedPath[0], selectedPath[1]])}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <div>&nbsp;</div>
            </div>
        </div>
    );
}
