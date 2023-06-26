import { Rarity } from "../../__generated__/globalTypes"

export type Reward = {
  ids: string[];
  key?: string;
  backgroundText: Rarity | '';
  header: React.ReactElement;
  back: React.ReactElement;
  front: React.ReactElement;
  teasers: React.ReactElement[];
  claimed: boolean;
};
