import AppbarButton from './AppbarButton';
import { useTreeContext } from "../../Context/Tree";
import { downloadFile } from '../../Utility/File';
import { FaRegSquarePlus, FaDownload, FaThumbtack } from 'react-icons/fa6';
import { MouseEvent } from 'react';
import './App.css';
import { AppbarState, useAppbarState } from '../../State/Appbar';

const appBarInitialState: AppbarState = {
    pinned: false
};

export const Appbar = () => {
    
    const [appbarState, appbarActions] = useAppbarState(appBarInitialState);
    const [treeState, treeActions] = useTreeContext();

    const handleClickAdd = () => { treeActions.add([], { title: "New Node", description: "From appbar" }); };
    const handleClickDownload = () => { downloadFile({ data: JSON.stringify(treeState), fileName: 'treedo.json', fileType: 'text/json', }); };
    const handleClickTogglePin = (event: MouseEvent<HTMLButtonElement>) => { appbarActions.togglePin(); };

    return (
        <div className="appbar">
            <AppbarButton text="Pin" icon={FaThumbtack} onClick={handleClickTogglePin} checked={true} />
            <AppbarButton text="Add" icon={FaRegSquarePlus} onClick={handleClickAdd} />
            <AppbarButton text="Download" icon={FaDownload} onClick={handleClickDownload} />
        </div>
    );
}

//FaCirclePlus
//FaFileCirclePlus
//FaRegSquarePlus
//FaFolderPlus
//FaPlus
//FaSquarePlus
//FaRegSquarePlus
//
export default Appbar;
