import { MouseEventHandler, PropsWithChildren } from 'react';

export interface AppbarButtonProps extends PropsWithChildren<{
    onClick?: MouseEventHandler;
}> { };

const AppbarButton = (props: AppbarButtonProps) => {
    const handleClick = event => {
        props.onClick?.(event);
    };
    return (
        <button role="menuitem" className="appbarButton" onClick={handleClick}>
            {props.children}
        </button>
    );
};

export default AppbarButton;
