import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_PLAYER_SHOW_CARDS } from '@sorare/core/src/constants/routes';
import { glossary } from '@sorare/core/src/lib/glossary';
import { positionNames } from '@sorare/core/src/lib/players';
import { Link } from '@sorare/core/src/routing/Link';

import addPlayer from '@football/components/collections/assets/add-player.svg';

import { EmptySlot_cardCollectionSlot } from './__generated__/index.graphql';

const StyledLink = styled(Link)`
  aspect-ratio: var(--card-aspect-ratio);
  border: 1px dashed var(--c-neutral-400);
  border-radius: var(--double-unit);
  display: grid;
  grid-template-rows: var(--quadruple-unit) 1fr var(--quadruple-unit);
  grid-template-areas:
    'empty'
    'icon'
    'cta';
  justify-content: stretch;
  align-items: center;
  padding: var(--triple-unit);
`;

const NameWrapper = styled.div`
  grid-area: icon;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.img`
  margin-bottom: var(--unit);
  width: var(--double-and-a-half-unit);
`;

const StyledButton = styled(Button)`
  grid-area: cta;
  justify-self: center;
`;

type Props = { slot: EmptySlot_cardCollectionSlot };

export const EmptySlot = ({ slot }: Props) => {
  const { player, transferMarketFilters } = slot;

  const cardLink = `${generatePath(FOOTBALL_PLAYER_SHOW_CARDS, {
    slug: player.slug,
  })}?${transferMarketFilters}`;

  return (
    <StyledLink to={cardLink}>
      <NameWrapper>
        <Icon src={addPlayer} alt="" />
        <Text14>{player.displayName}</Text14>
        <Caption color="var(--c-neutral-600)">
          <FormattedMessage {...positionNames[player.position]} />
        </Caption>
      </NameWrapper>
      <StyledButton color="white" medium component="div">
        <FormattedMessage {...glossary.find} />
      </StyledButton>
    </StyledLink>
  );
};

EmptySlot.fragments = {
  cardCollectionSlot: gql`
    fragment EmptySlot_cardCollectionSlot on CardCollectionSlot {
      id
      transferMarketFilters
      player {
        slug
        displayName
        position
      }
    }
  `,
};
