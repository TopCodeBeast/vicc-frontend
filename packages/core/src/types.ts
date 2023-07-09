import { ReactElement, ReactNode } from 'react';

export interface ReactProps {
  children: ReactNode;
}

export interface Dict<T> {
  [key: string]: T;
}

export interface StartCase<T> {
  //TODO
}

export interface StringKeysOf<T> {
  
}

type AuctionNFT = {
  assetId: string;
};

type TokenComponentTypeProps = {
  assetId: string;
  auction?: {
    nfts: AuctionNFT[];
  };
};

export type CamelCase<T extends string> = T;

export type SnakeCase<T extends string> = T;

// export type TokenComponentType = (
//   params: TokenComponentTypeProps
// ) => JSX.Element;

export type TokenComponentType = any;
