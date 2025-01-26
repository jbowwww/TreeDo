import { FaDownload, FaSquarePlus/* , FaThumbtack */, FaListCheck, FaRegWindowRestore, FaQuestion } from 'react-icons/fa6';
import { BsPinFill, BsPinAngleFill } from 'react-icons/bs';
import { useTreeContext } from "../../Context/Tree";
import { useAppbarContext } from '../../Context/Appbar';
import AppbarButton from './AppbarButton';
import classNames from 'classnames';
import { downloadFile } from '../../Utility/File';
import './App.css';
import { View } from '../../State/Appbar';

export const Appbar = () => {
    const [appbarState, appbarActions] = useAppbarContext();
    const [treeState, treeActions] = useTreeContext();

    const handleClickTogglePin = () => { appbarActions.togglePin(); };
    const handleClickAdd = () => { treeActions.add([], { title: "New Node", description: "From appbar" }); };
    const handleClickView = () => { appbarActions.cycleView(); };
    const handleClickDownload = () => { downloadFile({ data: JSON.stringify(treeState), fileName: 'treedo.json', fileType: 'text/json', }); };

    return (
        <div className={classNames("appbar", { "hover": appbarState.pinned })}>
            <AppbarButton text="Pin" icon={appbarState.pinned ? BsPinFill : BsPinAngleFill} onClick={handleClickTogglePin} />
            <AppbarButton text="Add" icon={FaSquarePlus} onClick={handleClickAdd} />
            <AppbarButton text="View" icon={appbarState.view === View.Columns ? FaListCheck : appbarState.view === View.TopDown ? /* FaCircleCheck :  */FaRegWindowRestore : FaQuestion} onClick={handleClickView} />
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
