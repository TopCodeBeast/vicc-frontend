import { Rarity } from "../../__generated__/globalTypes"

export type Reward = {
  ids: string[];
  key?: string;
  backgroundText: Rarity | '';
  header: React.ReactElement;
  back: React.ReactElement;
  front: ((isClaimed?: boolean) => JSX.Element) | JSX.Element;
  teasers: React.ReactElement[];
  claimed: boolean;
  drawerContent?: any;
};
