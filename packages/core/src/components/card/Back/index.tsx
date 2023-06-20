import { HTMLAttributes } from 'react';

import { Rarity, Sport } from '__generated__/globalTypes';
import { CardRarity } from '__generated__/usSportsGlobalTypes';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';

import { CardBack as BaseballCardBack } from './Baseball';
import { CardBack as FootballCardBack } from './Football';
import { CardBack as GenericCardBack } from './Generic';
import { CardBack as NbaCardBack } from './Nba';

type USSportProps = {
  sport: Sport.BASEBALL | Sport.NBA;
  rarity: CardRarity;
};

type FootballProps = {
  sport: Sport.FOOTBALL;
  rarity: Rarity;
};

type GenericProps = {
  sport?: null;
  rarity: Rarity;
};

type Props = {
  tier?: number;
  shine?: boolean;
  radius?: string;
} & (USSportProps | FootballProps | GenericProps) &
  HTMLAttributes<HTMLElement>;

export const CardBack = ({ sport, rarity, tier, ...props }: Props) => {
  if (sport === Sport.BASEBALL) {
    return <BaseballCardBack scarcity={rarity} tier={tier} {...props} />;
  }

  if (!sport) {
    return <GenericCardBack rarity={rarity} {...props} />;
  }

  if (sport === Sport.FOOTBALL) {
    const tokens: string[] = [Rarity[rarity]];
    if (tier !== undefined) {
      tokens.push(`tier_${tier}`);
    }
    const path = `${FRONTEND_ASSET_HOST}/cards/back/${tokens.join('-')}.svg`;
    return <FootballCardBack path={path} {...props} />;
  }

  return <NbaCardBack scarcity={rarity} tier={tier} {...props} />;
};

export default CardBack;
