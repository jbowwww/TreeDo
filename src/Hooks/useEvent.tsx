import { useEffect } from 'react';

export const useWindowEvent = (event: keyof GlobalEventHandlersEventMap, listener: (this: Window, event: any) => any, options?: AddEventListenerOptions) =>
    useEffect(() => {
        window.addEventListener(event, listener, options);
        return () => window.removeEventListener(event, listener);
    });
