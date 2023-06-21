import { HTMLAttributes } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@core/__generated__/globalTypes';
import { CardRarity } from '@core/__generated__/usSportsGlobalTypes';
import { proxyUrl } from '@core/atoms/ui/ResponsiveImg';
import Shine from '@core/atoms/ui/Shine';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { getScarcityName } from '@core/lib/baseball';
import { CARD_BORDER_RADIUS, CARD_SIZE } from '@core/lib/cards';

const CardShine = styled(Shine)`
  aspect-ratio: var(--card-aspect-ratio);
`;

const IMG = styled.img`
  width: 240px;
  aspect-ratio: var(--card-aspect-ratio);
  max-width: 100%;
  max-height: 100%;
  vertical-align: bottom;
  /* embed don't accept onclick, so we bypass the element */
  pointer-events: none;
`;

const pathBySport = {
  [Sport.BASEBALL]: 'mlb',
  [Sport.NBA]: 'nba',
};

// To add sport: make sure to create .svg component in the designated sport package
export type Props = {
  sport: Sport.BASEBALL | Sport.NBA;
  scarcity: CardRarity;
  tier?: number;
  shine?: boolean;
  season?: string;
} & HTMLAttributes<HTMLElement>;

export const USSportCardBack = ({
  sport,
  scarcity,
  tier,
  season = '2022',
  shine,
  className,
  ...divAttributes
}: Props) => {
  const { formatMessage } = useIntl();
  const urlParts = [FRONTEND_ASSET_HOST, 'cards/back', pathBySport[sport]];
  if (season !== '2022' && sport === Sport.BASEBALL) {
    urlParts.push(season);
  }
  urlParts.push(`${scarcity}_tier_${tier === undefined ? 'none' : tier}.png`);
  const url = urlParts.join('/');
  return (
    <CardShine
      className={className}
      borderRadius={CARD_BORDER_RADIUS}
      disabled={!shine}
      title={
        tier !== undefined
          ? formatMessage(
              {
                id: 'CardBack.titleWithTier',
                defaultMessage: '{scarcity} Card, tier {tier}',
              },
              { scarcity: getScarcityName(scarcity), tier }
            )
          : formatMessage(
              {
                id: 'CardBack.title',
                defaultMessage: '{scarcity} Card',
              },
              { scarcity }
            )
      }
      {...divAttributes}
    >
      <IMG src={proxyUrl(url, { cropWidth: CARD_SIZE })} />
    </CardShine>
  );
};
