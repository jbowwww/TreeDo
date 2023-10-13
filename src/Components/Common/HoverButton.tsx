import { CSSProperties, Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { useHover } from '../../Hooks/useHover';
import classNames from 'classnames';

//type ClickHandlerWithValue<T = Element, E = MouseEvent> = (value: React.MouseEvent<T, E>) => any;

export interface HoverButtonProps {
    children: ReactNode;
    className?: string
    style?: CSSProperties;
    onHoverChange?: Dispatch<SetStateAction<boolean>>;
    onClick?: () => void; //ClickHandlerWithValue<HTMLButtonElement>;
} {};

export const HoverButton = (props: HoverButtonProps) => {
    const [buttonRef, isHovering] = useHover<HTMLButtonElement>();
    useEffect(() => {
        props.onHoverChange?.(isHovering);
    }, [isHovering]);

    return (
        //<span style={props.style} className={classNames({ hover: isHovering })}>
        <button
            style={props.style}
            className={classNames({ ...(props.className ? { [props.className]: true } : {}), hover: isHovering })}
            ref={buttonRef}
            onClick={() => props.onClick?.()}
        >
            {props.children}
        </button>
        //</span>
    );
}

export default HoverButton;
