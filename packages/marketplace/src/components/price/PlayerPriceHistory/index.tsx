import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Collection, Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Title6 } from '@sorare/core/src/atoms/typography';
import { Tab, TabBar } from '@sorare/core/src/components/TabBar';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { tokenPageMessages } from '@marketplace/components/token/TokenPage/tokenPageMessages';

import PriceHistoryFromProps from '../PriceHistoryFromProps';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const StyledTabBar = styled(TabBar)`
  align-self: flex-start;
  margin-bottom: var(--half-unit);
`;

const filters = [Rarity.limited, Rarity.rare, Rarity.super_rare];

const PlayerPriceHistory = ({
  playerSlug,
  collection,
}: {
  playerSlug: string;
  collection: Collection;
}) => {
  const track = useEvents();
  const [rarity, setRarity] = useState<Rarity>(Rarity.limited);

  const variables = {
    rarity,
    collection,
    playerSlug,
  };
  const onClick = useCallback(
    (clickedToken: { slug: string }) => {
      if (clickedToken) {
        track('Click Price History', {
          clickedCardSlug: clickedToken.slug,
          cardSlug: '',
        });
      }
    },
    [track]
  );
  return (
    <Container>
      <Title6 as="h2">
        <FormattedMessage
          {...tokenPageMessages.last5Sales}
          values={{ rarity: '' }}
        />
      </Title6>
      <StyledTabBar value={rarity} compact>
        {filters.map(value => (
          <Tab key={value} value={value} onClick={() => setRarity(value)}>
            <FormattedMessage {...scarcityMessages[value]} />
          </Tab>
        ))}
      </StyledTabBar>
      <PriceHistoryFromProps
        variables={variables}
        count={4}
        onClick={onClick}
      />
    </Container>
  );
};

export default PlayerPriceHistory;
