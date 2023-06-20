import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { Text16 } from '@sorare/core/src/atoms/typography';

import cannotBeSold from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/cannotBeSold.png';
import earnCoins from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/earnCoins.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;

const CardWrapper = styled.div`
  height: 160px;
  aspect-ratio: var(--card-aspect-ratio);
  margin-top: var(--quadruple-unit);
  margin-bottom: var(--double-unit);
`;

const Pill = styled.div`
  background-color: var(--c-neutral-400);
  padding: 0 0.5em;
  border-radius: 1em;
  font: var(--t-bold) var(--t-12);
`;

const CommonCardsTitle = styled.h2`
  font: 500 28px/32px Romie-Regular;
`;

const UnorderedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  align-self: stretch;
`;

const ListItem = styled.li`
  padding: var(--intermediate-unit) 0;
  border-top: 1px solid rgba(var(--c-rgb-neutral-1000), 0.1);
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;

const IconWrapper = styled.div`
  background-color: rgba(var(--c-rgb-neutral-1000), 0.2);
  border-radius: var(--unit);
  padding: var(--unit);
  width: 48px;
  height: 48px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

type Props = {
  cardPictureUrl: string;
};

export const CommonCards = ({ cardPictureUrl }: Props) => {
  return (
    <Wrapper>
      <CardWrapper>
        <GlareEffect
          pictureUrl={cardPictureUrl}
          width={160}
          wigglePower={0.15}
        />
      </CardWrapper>
      <Pill>
        <FormattedMessage
          id="DiscoverScarcities.youOwn"
          defaultMessage="You drafted this"
        />
      </Pill>
      <CommonCardsTitle>
        <FormattedMessage
          id="DiscoverScarcities.CommonCards.title"
          defaultMessage="Common Cards"
        />
      </CommonCardsTitle>
      <UnorderedList>
        <ListItem>
          <IconWrapper>
            <Icon src={earnCoins} alt="" />
          </IconWrapper>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              id="DiscoverScarcities.CommonCards.earnCoins"
              defaultMessage="Earn Coins to customise your club"
            />
          </Text16>
        </ListItem>
        <ListItem>
          <IconWrapper>
            <Icon src={cannotBeSold} alt="" />
          </IconWrapper>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              id="DiscoverScarcities.CommonCards.cannotTrade"
              defaultMessage="Cannot be sold"
            />
          </Text16>
        </ListItem>
      </UnorderedList>
    </Wrapper>
  );
};
