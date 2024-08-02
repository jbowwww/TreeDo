import classNames from 'classnames';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconType } from 'react-icons';

export interface AppbarButtonProps extends PropsWithChildren<{
    text?: string;
    icon: IconType;
    checked?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}> { };

const AppbarButton = (props: AppbarButtonProps) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = event => { props.onClick?.(event); };
    return (
        <button role="menuitem" className="appbarButton" onClick={handleClick}>
            {props.icon ? <props.icon className={classNames("icon", { checked: props.checked })} textDecoration={props.text} /> : props.text ?? props.children}
        </button>
    );
};

export default AppbarButton;
