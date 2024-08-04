import { FaDownload, FaSquarePlus/* , FaThumbtack */ } from 'react-icons/fa6';
import { BsPinFill, BsPinAngleFill } from 'react-icons/bs';
import { useTreeContext } from "../../Context/Tree";
import { useAppbarContext } from '../../Context/Appbar';
import AppbarButton from './AppbarButton';
import classNames from 'classnames';
import { downloadFile } from '../../Utility/File';
import './App.css';

export const Appbar = () => {
    const [appbarState, appbarActions] = useAppbarContext();
    const [treeState, treeActions] = useTreeContext();

    const handleClickAdd = () => { treeActions.add([], { title: "New Node", description: "From appbar" }); };
    const handleClickDownload = () => { downloadFile({ data: JSON.stringify(treeState), fileName: 'treedo.json', fileType: 'text/json', }); };
    const handleClickTogglePin = () => {
        appbarActions.togglePin();
    };

    return (
        <div className={classNames("appbar", { "hover": appbarState.pinned })}>
            <AppbarButton text="Pin" icon={appbarState.pinned ? BsPinFill : BsPinAngleFill} onClick={handleClickTogglePin} />
            <AppbarButton text="Add" icon={FaSquarePlus} onClick={handleClickAdd} />
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
