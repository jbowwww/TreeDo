import AppbarButton from './AppbarButton';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { useTreeContext } from './Tree/TreeContext';
import { CSSProperties } from 'react';

const Appbar = () => {
    const [/*state*/, dispatch] = useTreeContext();

    return (
        <div style={appbarStyle}>
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

const appbarStyle: CSSProperties = {
    position: "absolute",
    left: "-14px",
    marginTop: "14em",
    marginRight: "1.4em",
};

const appbarButtonStyle: CSSProperties = {
    width: "2.6em",
    height: "2.6em",
};

const iconStyle: CSSProperties = {
    width: "2.6em",
    height: "2.6em",
};
