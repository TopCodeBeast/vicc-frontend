import { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Rarity } from '__generated__/globalTypes';
import Shine from '@core/atoms/ui/Shine';
import { CARD_BORDER_RADIUS } from '@core/lib/cards';

import commonBack from './assets/common.png';
import limitedBack from './assets/limited.png';
import rareBack from './assets/rare.png';
import superRareBack from './assets/super_rare.png';
import uniqueBack from './assets/unique.png';

type Props = {
  rarity: Rarity;
  shine?: boolean;
} & HTMLAttributes<HTMLElement>;

const Image = styled.img`
  aspect-ratio: var(--card-aspect-ratio);
  width: 235px;
  max-width: 100%;
`;

export const CardBack = ({ rarity, shine, ...divAttributes }: Props) => {
  if (rarity === Rarity.custom_series) {
    return null;
  }

  const path = {
    [Rarity.common]: commonBack,
    [Rarity.limited]: limitedBack,
    [Rarity.rare]: rareBack,
    [Rarity.super_rare]: superRareBack,
    [Rarity.unique]: uniqueBack,
  }[rarity];

  return (
    <Shine
      disabled={!shine}
      borderRadius={CARD_BORDER_RADIUS}
      {...divAttributes}
    >
      <Image src={path} alt={rarity} />
    </Shine>
  );
};
