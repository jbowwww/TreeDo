import Appbar from './Appbar';
import { useTree, TreeContextProvider } from '../../State/Tree';
import { TreeColumnView } from '../Tree/TreeColumnView';

export const App = () => {
    const [treeState, treeActions] = useTree(items);
    console.log('treeStore', treeState);
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
