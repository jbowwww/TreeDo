import AppbarButton from './AppbarButton';
import { FaRegSquarePlus, FaDownload } from 'react-icons/fa6';
import { useTreeContext } from '../../State/Tree';
import { downloadFile } from '../../Utility/downloadFile';
import './App.css';

export const Appbar = () => {
    const [state, dispatch] = useTreeContext();
    const handleClickAdd = () => { dispatch?.add([], {}); };
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
