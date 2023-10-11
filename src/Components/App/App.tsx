import Appbar from './Appbar';
import { useTree, TreeContextProvider } from '../../State/Tree';
import { TreeColumnView } from '../Tree/TreeColumnView';
import { DragEventHandler,/*, useEffect*/ 
useEffect} from 'react';

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
    const handleDragEnter = (e: DragEvent) => { // DragEventHandler<HTMLDivElement> = e => {
        //e.stopPropagation();
        e.preventDefault();
        if (!e.dataTransfer?.items[0]) throw new Error(`Error loading file: items[0] empty`);
        e.dataTransfer.dropEffect = "copy";
        //readJsonStateFile(e.dataTransfer.items[0].getAsFile());
    };
    const handleDragOver = (e: DragEvent) => { //  DragEventHandler<HTMLDivElement> = e => {
        //e.stopPropagation();
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => { //  DragEventHandler<HTMLDivElement> = e => {
        e.stopPropagation();
        e.preventDefault();
        if (!e.dataTransfer) throw new Error(`Error getting event.dataTransfer}`);
        if (!e.dataTransfer.files[0]) throw new Error(`Error loading file: files[0] empty`);
        readJsonStateFile(e.dataTransfer.files[0]);
    };

    useEffect(() => {
        window.addEventListener('drop', handleDrop);
        return () => window.removeEventListener('drop', handleDrop);
    }, []);
    useEffect(() => {
        window.addEventListener('dragenter', handleDragEnter);
        return () => window.removeEventListener('dragenter', handleDragEnter);
    }, []);
    useEffect(() => {
        window.addEventListener('dragover', handleDragOver);
        return () => window.removeEventListener('dragover', handleDragOver);
    }, []);

    //  onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop} >
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
