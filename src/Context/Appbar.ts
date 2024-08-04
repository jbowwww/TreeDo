import { Context, createContext, useContext } from "react";
import { AppbarActions, AppbarState } from "../State/Appbar";

export type AppbarContextType = [AppbarState, AppbarActions];
export const AppbarContext = createContext<AppbarContextType | null>(null);
export const useAppbarContext = () => useContext<AppbarContextType>(AppbarContext as Context<AppbarContextType>);
