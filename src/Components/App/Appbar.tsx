import AppbarButton from './AppbarButton';
import { useTreeContext } from "../../Context/Tree";
import { downloadFile } from '../../Utility/File';
import { FaRegSquarePlus, FaDownload } from 'react-icons/fa6';
import './App.css';

export const Appbar = () => {
    const [treeState, treeActions] = useTreeContext();
    const handleClickAdd = () => { treeActions.add([], { title: "New Node", description: "From appbar" }); };
    const handleClickDownload = () => { downloadFile({ data: JSON.stringify(treeState), fileName: 'treedo.json', fileType: 'text/json', }); };
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
