import { CSSProperties, Dispatch, MouseEventHandler, ReactNode, SetStateAction, useEffect } from 'react';
import { HoverConfig, useHover } from '../../Hooks/useHover';
import classNames from 'classnames';

//type ClickHandlerWithValue<T = Element, E = MouseEvent> = (value: React.MouseEvent<T, E>) => any;

export interface HoverButtonProps {
    children: ReactNode;
    className?: string;
    text?: string;
    hoverConfig?: HoverConfig;
    style?: CSSProperties;
    role?: string;
    onHoverChange?: Dispatch<SetStateAction<boolean>>;
    onClick?: MouseEventHandler<HTMLButtonElement>;//() => void; //ClickHandlerWithValue<HTMLButtonElement>;
} { };

const defaultProps = {
    hoverConfig: {
        delayShow: 250,
        delayHide: 1550,
    }
};

export const HoverButton = (props: HoverButtonProps) => {
    const propsWithDefaults = {
        ...defaultProps,
        ...props,
    };
    const [buttonRef, isHovering] = useHover<HTMLButtonElement>(propsWithDefaults.hoverConfig);
    useEffect(() => {
        propsWithDefaults.onHoverChange?.(isHovering);
    }, [isHovering]);

    return (
        <span>
            {/* <span style={propsWithDefaults.style} className={classNames({ hover: isHovering })}></span> */}
            <div style={{
                display: (!!propsWithDefaults.text && isHovering) ? "block" : "none",
                position: "absolute",
                marginTop: "-12px",
                marginLeft: "+30px",
                border: "1px solid yellow",
                background: "rgb(8, 8, 8)",
            }}>
                {propsWithDefaults.text}
            </div>
            <button
                style={propsWithDefaults.style}
                role={propsWithDefaults.role}
                className={classNames({ ...(propsWithDefaults.className ? { [propsWithDefaults.className]: true } : {}), hover: isHovering })}
                ref={buttonRef}
                onClick={propsWithDefaults.onClick}
            >
                {propsWithDefaults.children}
            </button>
        </span>
    );
}

export default HoverButton;
