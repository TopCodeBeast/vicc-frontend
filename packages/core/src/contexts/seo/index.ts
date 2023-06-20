import { createContext, useContext } from 'react';

export interface Options {
  description?: string;
  img?: string | null;
  twitter?: string;
  replaceFullTitle?: boolean;
}

export interface SeoContext {
  setPageMetadata: (seoTitle: string, options?: Options) => () => void;
  setIOSDownloadMetadata: () => () => void;
}

export const seoContext = createContext<SeoContext | null>(null);

export const useSeoContext = () => useContext(seoContext)!;

export default seoContext.Provider;
