import { Dispatch, useMemo, useState } from "react";

export const enum View {
    MIN = 0,
    Columns = 0,
    TopDown = 1,
    MAX = 1,
};

export type AppbarState = {
    pinned: boolean;
    view: View;
};

export const useAppbarState = (initialState: AppbarState): [AppbarState, AppbarActions] => {
    const [state, setState] = useState<AppbarState>(initialState);
    const actions = useMemo(() => new AppbarActions(state, setState), [state, setState]);
    return [state, actions];
};

export class AppbarActions {
    
    constructor(
        public readonly state: AppbarState,
        public readonly setState: Dispatch<React.SetStateAction<AppbarState>>
    ) { }

    public setPinned = (pinned: boolean) => this.setState((state: AppbarState) => ({ ...state, pinned }));
    public togglePin = () => this.setState((state: AppbarState) => ({ ...state, pinned: !state.pinned }));
    public cycleView = () => this.setState((state: AppbarState) => ({ ...state, view: ++state.view > View.MAX ? View.MIN : state.view }));
};
