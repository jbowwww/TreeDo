import classNames from 'classnames';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconType } from 'react-icons';
import HoverButton from '../Common/HoverButton';

export interface AppbarButtonProps extends PropsWithChildren<{
    text?: string;
    icon: IconType;
    checked?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}> { };

const AppbarButton = (props: AppbarButtonProps & { rotate?: string }) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = event => { props.onClick?.(event); };
    return (
        <HoverButton role="menuitem" text={props.text} className={classNames("appbarButton", { checked: props.checked })} onClick={handleClick}>
            {props.icon ? <props.icon className="icon" textDecoration={props.text} rotate={props.rotate} /> : props.text ?? props.children}
        </HoverButton>
    );
};

export default AppbarButton;
