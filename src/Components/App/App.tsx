import Appbar from './Appbar';
import { TreeColumnView } from '../Tree/TreeColumnView';
import { useTree, TreeContextProvider } from '../../State/Tree';
import './App.css';
import { readJsonFile } from '../../Utility/File';

import initialItems from '../../Data/debugItems.json';

export const App = () => {
    const [treeState, treeActions] = useTree(initialItems);

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
            <TreeContextProvider value={[treeState, treeActions]}>
                <Appbar />
                <TreeColumnView />
            </TreeContextProvider>
        </div>
    );
};
