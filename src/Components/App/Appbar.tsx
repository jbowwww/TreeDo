import AppbarButton from './AppbarButton';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { useTreeContext } from '../../State/Tree';
import './App.css';

const Appbar = () => {
    const [/*state*/, dispatch] = useTreeContext();
    const handleClickAdd = () => {
        dispatch?.add([], {});
    }
    return (
        <div className="appbar">
            <AppbarButton onClick={handleClickAdd}>
                <FaRegSquarePlus className="icon" />
            </AppbarButton>
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
