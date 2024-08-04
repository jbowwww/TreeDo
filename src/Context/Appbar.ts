import { Context, createContext, useContext } from "react";
import { AppbarActions, AppbarState } from "../State/Appbar";

export type AppbarContextType = [AppbarState, AppbarActions];
export const AppBarContext = createContext<AppbarContextType | null>(null);
export const useAppBarContext = () => useContext<AppbarContextType>(AppBarContext as Context<AppbarContextType>);
