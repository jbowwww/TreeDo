import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconType } from 'react-icons';

export interface AppbarButtonProps extends PropsWithChildren<{
    text?: string;
    icon: IconType;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}> { };

const AppbarButton = (props: AppbarButtonProps) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = event => { props.onClick?.(event); };
    return (
        <button role="menuitem" className="appbarButton" onClick={handleClick}>
            {props.icon ? <props.icon className="icon" textDecoration={props.text} /> : props.text ?? props.children}
        </button>
    );
};

export default AppbarButton;
