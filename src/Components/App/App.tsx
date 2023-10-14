import Appbar from './Appbar';
import { TreeColumnView } from '../Tree/TreeColumnView';
import { useTree, TreeContextProvider } from '../../State/Tree';
import { useWindowEvent } from '../../Hooks/useEvent.js';
import './App.css';

export const App = () => {
    const [treeState, treeActions] = useTree(items);
    console.log('treeStore', treeState);

    const readJsonStateFile = (file?: File | null) => {
        if (!file) throw new Error(`Error loading file: item.getAsFile() failed`);
        if (file.type.indexOf('json') < 0) throw new Error(`Only accept text/json files! file '${file.name}' has type '${file.type}'`);
        const reader = new FileReader();
        reader.onload = e => {
            if (!e.target) throw new Error(`Error loading file '${file.name}'`);
            const newState = JSON.parse(e.target!.result! as string);
            console.log(`Loaded file '${file.name}': setting newState`, newState);
            treeActions.setState(newState);
        };
        reader.readAsText(file);
    };
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        if (!e.dataTransfer?.items[0]) throw new Error(`Error loading file: items[0] empty`);
        e.dataTransfer.dropEffect = "copy";
    };
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        if (!e.dataTransfer) throw new Error(`Error getting event.dataTransfer}`);
        if (!e.dataTransfer.files[0]) throw new Error(`Error loading file: files[0] empty`);
        readJsonStateFile(e.dataTransfer.files[0]);
    };

    useWindowEvent('drop', handleDrop);
    useWindowEvent('dragenter', handleDragEnter);
    useWindowEvent('dragover', handleDragOver);

    return (
        <div className="app">
            <TreeContextProvider value={[treeState, treeActions]}>
                <Appbar />
                <TreeColumnView />
            </TreeContextProvider>
        </div>
    );
};

const items: any = [{
    title: "Item 1", description: "Description 1", nodes: [{
        title: "Item 1.1", description: "Description 1.1",
    }, {
        title: "Item 1.2", description: "Description 1.2",
    }]
}, {
    title: "Item 2", description: "Description 2", nodes: [{
        title: "Item 2.1", description: "Description 2.1",
    }, {
        title: "Item 2.2", description: "Description 2.2",
    }]
}, {
    title: "Item 3", description: "Description 3",
}, {
    title: "Item 4", description: "Description 4",
}];
