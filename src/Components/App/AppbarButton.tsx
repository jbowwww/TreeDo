import React, { CSSProperties, PropsWithChildren } from 'react';
import './App.css';

export interface AppbarButtonProps extends PropsWithChildren<{
    style?: CSSProperties
}> {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const AppbarButton = (props: AppbarButtonProps) => (
    <button role="menuitem" className="appbarButton" onClick={props.onClick} {...props}>
        {props.children}
    </button>
);

export default AppbarButton;
