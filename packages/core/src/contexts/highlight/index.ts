import { ReactNode, createContext, useContext } from 'react';

export interface Options {
  callback?: () => void;
  message?: ReactNode;
  position?: 'top' | 'bottom';
}

export interface HighlightContext {
  highlighted: string | null;
  prevHighlighted: string | null;
  highlight: (name: string, options?: Options) => void;
  unhighlight: () => void;
}

export const highlightContext = createContext<HighlightContext | null>(null);

export const useHighLightContext = () => useContext(highlightContext)!;

export default highlightContext.Provider;
