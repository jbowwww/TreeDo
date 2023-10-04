import AppbarButton from './AppbarButton';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { useTreeContext } from '../Tree/TreeContext';
import { CSSProperties } from 'react';
import './App.css';

const Appbar = () => {
    const [/*state*/, dispatch] = useTreeContext();

    return (
        <div className="appbar">
            <section role="menubar">
                <AppbarButton style={appbarButtonStyle} onClick={() => dispatch?.add([], {})}>
                    <FaRegSquarePlus style={iconStyle} />
                </AppbarButton>
            </section>
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

export default Appbar;

const appbarButtonStyle: CSSProperties = {
    width: "2.6em",
    height: "2.6em",
};

const iconStyle: CSSProperties = {
    width: "2.6em",
    height: "2.6em",
};
