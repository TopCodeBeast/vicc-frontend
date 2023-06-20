import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Collection, Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Tabs } from '@sorare/core/src/atoms/navigation/Tabs';
import { Title6 } from '@sorare/core/src/atoms/typography';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { tokenPageMessages } from '@sorare/marketplace/src/components/token/TokenPage/tokenPageMessages';

import PriceHistoryFromProps from '../PriceHistoryFromProps';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const StyledTabs = styled(Tabs)`
  padding-left: 0;
  > button {
    background: var(--c-neutral-300);
    font-weight: var(--t-bold);
    flex: 0;
  }
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
  const { formatMessage } = useIntl();
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
      <StyledTabs
        items={filters.map(value => {
          return {
            key: value,
            active: rarity === value,
            onClick: () => setRarity(value),
            label: formatMessage(scarcityMessages[value]),
          };
        })}
      />
      <PriceHistoryFromProps
        variables={variables}
        count={4}
        onClick={onClick}
      />
    </Container>
  );
};

export default PlayerPriceHistory;
