import { HTMLAttributes } from 'react';

import { CardRarity, Rarity, Sport } from '__generated__/globalTypes';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';

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
    return <BaseballCardBack scarcity={rarity as any} tier={tier} {...props} />;
  }

  if (!sport) {
    return <GenericCardBack rarity={rarity as any} {...props} />;
  }

  if (sport === Sport.FOOTBALL) {
    const tokens: string[] = [Rarity[rarity]];
    if (tier !== undefined) {
      tokens.push(`tier_${tier}`);
    }
    const path = `${FRONTEND_ASSET_HOST}/cards/back/${tokens.join('-')}.svg`;
    return <FootballCardBack path={path} {...props} />;
  }

  //TODO Remove any
  return <NbaCardBack scarcity={rarity as any} tier={tier} {...props} />;
};

export default CardBack;
