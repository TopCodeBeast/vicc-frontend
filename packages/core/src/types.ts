import { ReactElement, ReactNode } from "react";

export interface ReactProps {
  children: ReactNode;
}

export interface Dict<T> {
  [key: string]: T;
}

export type Nullable<T> = T | null;

export type TokenComponentType = any;
