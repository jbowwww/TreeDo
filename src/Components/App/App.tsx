import { useEffect } from "react";
import { TreeContext } from "../../Context/Tree";
import initialItems from '../../Data/debugItems.json';
import { useTreeState } from '../../State/Tree';
import { readJsonFile } from '../../Utility/File';
import { ColumnView } from '../Tree/ColumnView';
import './App.css';
import Appbar from './Appbar';
import { AppbarState, useAppbarState } from "../../State/Appbar";
import { AppbarContext } from "../../Context/Appbar";

export type ItemNode = { title?: string, description?: string };
const resetStorage = false;

const appBarInitialState: AppbarState = {
    pinned: false
};

export const App = () => {
    const [treeState, treeActions] = useTreeState<ItemNode>(
        (resetStorage ? JSON.parse(localStorage.getItem("init")!) : null) ?? { nodes: initialItems }
    );
    const [appbarState, appbarActions] = useAppbarState(appBarInitialState);

    useEffect(() => {
        localStorage.setItem("init", JSON.stringify(treeState));
    }, [ treeState ]);

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
                <AppbarContext.Provider value={[appbarState, appbarActions]}>
                    <Appbar />
                    <ColumnView />
                </AppbarContext.Provider>
            </TreeContext.Provider>
        </div>
    );
};
