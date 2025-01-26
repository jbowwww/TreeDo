import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type HoverConfig = {
    delayShow: number;
    delayHide: number;
};

const defaultHoverConfig: HoverConfig = {
    delayShow: 250,
    delayHide: 550,
};

export const useHover = <T extends HTMLElement>(hoverConfig: Partial<HoverConfig> = {}): [RefObject<T>, boolean] => {
    const [isHovering, setHovering] = useState(false);
    const [hoverTimeout, setInternalHoverTimeout] = useState<number>();
    const ref = useRef<T>(null);
    const hoverConfigWithDefaults = {
        ...defaultHoverConfig,
        ...hoverConfig,
    };

    const resetHoverTimeout = (setAfterClear = true) => {
        // if (isHovering) {
            setHovering(false);
        // }
        if (!!hoverTimeout) {
            clearTimeout(hoverTimeout);
            setInternalHoverTimeout(undefined);
        }
        if (setAfterClear) {
            setInternalHoverTimeout(setTimeout(() => {
                setHovering(true);
                setInternalHoverTimeout(undefined);
                setTimeout(() => {
                    setHovering(false);
                }, hoverConfigWithDefaults.delayHide)
            }, hoverConfigWithDefaults.delayShow));
        }
    };

    // const handleMouseOver = () => ;/./
    const handleMouseMove = () => {
        console.log(`useHover.handleMouseMove(): isHovering=${isHovering}`);
        resetHoverTimeout(false);
    };
    const handleMouseOver = () => {
        console.log(`useHover.handleMouseOver(): isHovering=${isHovering}`);
        resetHoverTimeout();
    };
    const handleMouseOut = () => {
        console.log(`useHover.handleMouseOut(): isHovering=${isHovering}`);
        resetHoverTimeout(false);
        setHovering(false);
    };

    useEffect(/* useCallback( */() => {
        console.log(`useHover.useEffect(): isHovering=${isHovering}`);
        const element = ref.current;
        if (!element) return;
        element.onmousemove = handleMouseMove;
        element.onmouseover = handleMouseOver;
        element.onmouseout = handleMouseOut;
        return () => {
            element.onmousemove = null;
            element.onmouseover = null;// removeEventListener("onmouseover", handleMouseOver);
            element.onmouseout = null; //.removeEventListener("onmouseout", handleMouseOut);
        };
    });
    return [ref, isHovering];
};
