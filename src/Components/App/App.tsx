import Appbar from './Appbar';
import { ColumnView } from '../Tree/ColumnView';
import { useTreeState } from '../../State/Tree/index';
import { TreeContext } from '../../State/Tree/Context';
import './App.css';
import { readJsonFile } from '../../Utility/File';

import initialItems from '../../Data/debugItems.json';
//import { TreeNode } from "../../State/Tree/State";

export type ItemNode = { title?: string, description?: string };

export const App = () => {
    const [treeState, treeActions] = useTreeState<ItemNode>(initialItems);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        if (!e.dataTransfer) throw new Error(`Error getting event.dataTransfer}`);
        if (!e.dataTransfer.files[0]) throw new Error(`Error loading file: files[0] empty`);
        treeActions.setState(await readJsonFile(e.dataTransfer.files[0]));
        console.log('treeStore', treeState);
    };

    return (
        <div className="app" onDragOver={handleDragOver} onDrop={handleDrop}>
            <TreeContext.Provider value={[treeState, treeActions]}>
                <Appbar />
                <ColumnView />
            </TreeContext.Provider>
        </div>
    );
};
