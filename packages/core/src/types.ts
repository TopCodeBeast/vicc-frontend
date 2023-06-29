import { ReactElement, ReactNode } from "react";

export interface ReactProps {
  children: ReactNode;
}

export interface Dict<T> {
  [key: string]: T;
}

export interface StartCase<T> {
  //TODO
}

type AuctionNFT = {
  assetId: string
}

type TokenComponentTypeProps = {
  assetId: string;
  auction?: {
    nfts: AuctionNFT[];
  }
}

export type TokenComponentType = (params: TokenComponentTypeProps) => JSX.Element;

