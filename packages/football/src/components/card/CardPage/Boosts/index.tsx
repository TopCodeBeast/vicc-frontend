import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text20 } from '@sorare/core/src/atoms/typography';

import Boost from './Boost';
import { Boosts_card } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--triple-unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  margin-top: var(--double-unit);
`;

type Props = {
  card: Boosts_card;
  onMaxLevelUpAppliedCountReached: () => void;
  closeDropdown: () => void;
};
const Boosts = ({
  card,
  onMaxLevelUpAppliedCountReached,
  closeDropdown,
}: Props) => {
  return (
    <Root>
      <Text20 color="var(--c-neutral-1000)" bold>
        <FormattedMessage
          id="CardPage.Boosts.title"
          defaultMessage="Level Up your card"
        />
      </Text20>
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          id="CardPage.Boosts.subtitle"
          defaultMessage="Improve your player’s XP"
        />
      </Text14>
      <FlexContainer>
        {card.availableCardBoosts.map(cardBoost => (
          <Boost
            key={cardBoost.shopItem.id}
            cardId={card.id}
            cardBoost={cardBoost}
            maxLevelUpAppliedCountReached={
              card.levelUpAppliedCount === card.maxLevelUpAppliedCount
            }
            onMaxLevelUpAppliedCountReached={onMaxLevelUpAppliedCountReached}
            closeDropdown={closeDropdown}
          />
        ))}
      </FlexContainer>
    </Root>
  );
};

Boosts.fragments = {
  card: gql`
    fragment Boosts_card on Card {
      id
      slug
      assetId
      levelUpAppliedCount
      maxLevelUpAppliedCount
      availableCardBoosts {
        id
        ...Boost_cardBoost
      }
    }
    ${Boost.fragments.cardBoost}
  `,
};

export default Boosts;
