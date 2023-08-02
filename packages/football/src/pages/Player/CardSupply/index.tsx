import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Select from '@sorare/core/src/atoms/inputs/Select';
import Block from '@sorare/core/src/atoms/layout/Block';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { format as formatSeason } from '@sorare/core/src/lib/seasons';

import { CardSupply_player } from './__generated__/index.graphql';

type CardSupply_player_cardSupply = CardSupply_player['cardSupply'][number];

export interface Props {
  player: CardSupply_player & {
    cardSupply: CardSupply_player_cardSupply[];
  };
}

const messages = defineMessages({
  title: {
    id: 'CardSupply.title',
    defaultMessage: 'Supply',
  },
  allSeasons: {
    id: 'CardSupply.allSeasons',
    defaultMessage: 'All seasons',
  },
});

const Supply = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Container = styled(Block)`
  display: flex;
  flex-direction: column;
  padding: var(--unit) var(--double-unit);
  gap: var(--unit);
`;

const ScarcitySupplyRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: var(--unit) 0;
`;

const ScarcitySupplyStatName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScarcityText = styled(Text14)`
  color: var(--c-neutral-600);
`;
const ScarcityValue = styled(Text14)`
  font-weight: var(--t-bold);
`;

const ScarcitySupplyDisplay = ({
  scarcity,
  supply,
}: {
  scarcity: 'limited' | 'rare' | 'super_rare' | 'unique';
  supply: number;
}) => {
  return (
    <ScarcitySupplyRoot>
      <ScarcitySupplyStatName>
        <ScarcityText>
          <ScarcityBall scarcity={scarcity} />
        </ScarcityText>
      </ScarcitySupplyStatName>
      <ScarcityValue>{supply}</ScarcityValue>
    </ScarcitySupplyRoot>
  );
};

type internalSupply = {
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
};

const SupplyDisplay = ({ supply }: { supply: internalSupply | undefined }) => {
  if (!supply) return null;

  return (
    <Container>
      <ScarcitySupplyDisplay scarcity="limited" supply={supply.limited} />
      <ScarcitySupplyDisplay scarcity="rare" supply={supply.rare} />
      <ScarcitySupplyDisplay scarcity="super_rare" supply={supply.superRare} />
      <ScarcitySupplyDisplay scarcity="unique" supply={supply.unique} />
    </Container>
  );
};

export const CardSupply = ({ player }: Props) => {
  const { formatMessage } = useIntl();
  const { cardSupply } = player;
  const [season, setSeason] = useState('all');

  const selectedSupply = useMemo(() => {
    return [...cardSupply].find(a => formatSeason(a.season) === season);
  }, [cardSupply, season]);

  if (cardSupply.length === 0) {
    return null;
  }

  const total: internalSupply = [...cardSupply].reduce(
    (p: internalSupply, c) => {
      p.limited += c.limited;
      p.rare += c.rare;
      p.superRare += c.superRare;
      p.unique += c.unique;
      return p;
    },
    { limited: 0, rare: 0, superRare: 0, unique: 0 }
  );

  const options = [
    { label: formatMessage(messages.allSeasons), value: 'all' },
  ].concat(
    cardSupply.map((c: CardSupply_player_cardSupply) => ({
      label: formatSeason(c.season),
      value: formatSeason(c.season),
    }))
  );

  const selectedOption = options.find(o => o.value === season)!;

  return (
    <Supply>
      <Header>
        <Title6 as="h2">
          <FormattedMessage {...messages.title} />
        </Title6>
        <Select
          value={selectedOption}
          onChange={o => setSeason(o!.value)}
          options={options}
          menuLateralAlignment="right"
        />
      </Header>
      {season === 'all' ? (
        <SupplyDisplay supply={total} />
      ) : (
        <SupplyDisplay supply={selectedSupply} />
      )}
    </Supply>
  );
};

CardSupply.fragments = {
  player: gql`
    fragment CardSupply_player on Player {
      slug
      cardSupply {
        season {
          startYear
        }
        limited
        rare
        superRare
        unique
      }
    }
  ` as TypedDocumentNode<CardSupply_player>,
};

export default CardSupply;
