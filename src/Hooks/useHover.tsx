import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export const useHover = <T extends HTMLElement>(): [RefObject<T>, boolean] => {
    const [isHovering, setHovering] = useState(false);
    const ref = useRef<T>(null);
    useEffect(useCallback(() => {
        const element = ref.current;
        if (!element) return;
        const handleMouseOver = () => setHovering(true);
        const handleMouseOut = () => setHovering(false);
        element.onmouseover = handleMouseOver;
        element.onmouseout = handleMouseOut;
        return () => {
            element.onmouseover = null;// removeEventListener("onmouseover", handleMouseOver);
            element.onmouseout = null; //.removeEventListener("onmouseout", handleMouseOut);
        };
    }, []));
    return [ref, isHovering];
};
