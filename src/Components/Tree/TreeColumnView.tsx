import { useState } from 'react';
import Column from './TreeColumn';
import { useTreeContext } from '../../State/Tree';
import classNames from 'classnames';

export interface TreeColumnViewProps {
    basePath?: number[];
};

export const TreeColumnView = ({ basePath = [] }: TreeColumnViewProps) => {
    // currently selected (absolute) path describes 0 or more selected items selected in each column, by removing
    // first basePath.length items in selectedPath, the next items (if they exist) in the path array are the column selections
    // so selectedPath[N] is the selected item index in column N
    const [selectedPath, setSelectedPath] = useState<number[]>([]);
    const [/*treeState*/, treeDispatch] = useTreeContext();
    const lastColumnDepth = selectedPath.length - basePath.length;
    const lastColumnDisplay = (treeDispatch?.getNode(selectedPath)?.nodes?.length ?? 0) > 0;
    const columnDisplayCount = lastColumnDepth + (lastColumnDisplay ? 1 : 0);

    const handleSelectedItem = (newRelativePath: number[]) => {
        setSelectedPath([...basePath, ...newRelativePath]);
    };

    return (
        <div style={{ position: "absolute", width: "100%", height: "100%" } }>
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
                    path={basePath.concat(selectedPath[0])}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <Column
                    path={basePath.concat(selectedPath[0], selectedPath[1])}
                    selectedPath={selectedPath}
                    onSelectItem={handleSelectedItem}
                />
                <div>&nbsp;</div>
            </div>
        </div>
    );
}
