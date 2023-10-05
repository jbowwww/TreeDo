import Appbar from './Appbar';
import { TreeContextProvider } from '..//Tree/TreeContext';
import { useTree } from '../../State/TreeState';
import { TreeColumnView } from '../Tree/TreeColumnView';

export const App = () => {
    const [treeState, treeDispatch] = useTree(items);

    return (
        <div style={appStyle}>
            <TreeContextProvider state={treeState} dispatch={treeDispatch}>
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

export const appStyle = {
    height: "880px",
};