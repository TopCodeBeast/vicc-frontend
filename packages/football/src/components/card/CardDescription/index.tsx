import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Text16, TypographyVariant } from '@sorare/core/src/atoms/typography';
import TokenDescriptionFromProps from '@sorare/core/src/components/token/TokenDescriptionFromProps';
import { FOOTBALL_PLAYER_SHOW } from '@sorare/core/src/constants/routes';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';
import { format } from '@sorare/core/src/lib/seasons';

import { CardDescription_card } from './__generated__/index.graphql';

export interface Props {
  card: CardDescription_card;
  Title?: TypographyVariant;
  Details?: TypographyVariant;
}

const DefaultDetails = styled(Text16)`
  color: var(--c-neutral-600);
`;

export const CardDescription = ({
  card,
  Title = Text16,
  Details = DefaultDetails,
}: Props) => {
  const separator = <> &ndash; </>;
  const { season, rarity, singleCivilYear, player } = card;
  const { slug, displayName } = player;

  return (
    <TokenDescriptionFromProps
      Details={Details}
      Title={Title}
      displayName={displayName}
      description={
        <>
          {format(season, { singleCivilYear })}
          {separator}
          {getHumanReadableSerialNumber(card)}
        </>
      }
      withoutLink={false}
      path={generatePath(FOOTBALL_PLAYER_SHOW, { slug })}
      scarcity={rarity as Rarity}
    />
  );
};

CardDescription.fragments = {
  card: gql`
    fragment CardDescription_card on Card {
      slug
      assetId
      player {
        slug
        displayName
      }
      singleCivilYear
      season {
        startYear
      }
      serialNumber
      rarity
    }
  `,
};

export default CardDescription;
