import AppbarButton from './AppbarButton';
import { FaRegSquarePlus, FaDownload } from 'react-icons/fa6';
import { useTreeContext } from '../../State/Tree/Context';
import { downloadFile } from '../../Utility/File';
import './App.css';
import { ItemNode } from "./App";

export const Appbar = () => {
    const [state, dispatch] = useTreeContext<ItemNode>();
    const handleClickAdd = () => { dispatch.add([], { value: {} }); };
    const handleClickDownload = () => { downloadFile({ data: JSON.stringify(state), fileName: 'treedo.json', fileType: 'text/json', }); };
    return (
        <div className="appbar">
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
