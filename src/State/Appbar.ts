import { Dispatch, useMemo, useState } from "react";

export type AppbarState = {
    pinned: boolean;
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

    public setPinned = (pinned: boolean) => this.state.pinned = pinned;
    public togglePin = () => this.state.pinned = !this.state.pinned;

};
