import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { DiscoverRewardsDialog } from '@sorare/football/src/components/onboarding/DiscoverScarcities/DiscoverRewardsDialog';
import { ScarceCardsSpinner } from '@sorare/football/src/components/onboarding/DiscoverScarcities/ScarceCardsSpinner';
import canBeSold from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/canBeSold.png';
import earnRewards from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/earnRewards.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
`;

const ScarceCardsTitle = styled.h2`
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

const ListItemWithButton = styled(ListItem)`
  position: relative;
  isolation: isolate;
`;

const StyledIconButton = styled(IconButton)`
  margin-left: auto;
`;

const IconWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--unit);
  padding: var(--unit);
  width: 48px;
  height: 48px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ScarceCards = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { fiatCurrency } = useCurrentUserContext();

  return (
    <>
      <DiscoverRewardsDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      <Wrapper>
        <SpinnerWrapper>
          <ScarceCardsSpinner />
        </SpinnerWrapper>
        <ScarceCardsTitle>
          <FormattedMessage
            id="DiscoverScarcities.ScarceCards.title"
            defaultMessage="Scarce Cards"
          />
        </ScarceCardsTitle>
        <UnorderedList>
          <ListItemWithButton>
            <IconWrapper>
              <Icon src={earnRewards} alt="" />
            </IconWrapper>
            <Text16 color="var(--c-reward-700)" bold>
              <FormattedMessage
                id="DiscoverScarcities.ScarceCards.earnRewards"
                defaultMessage="Earn incredible rewards"
              />
            </Text16>
            <LinkOverlay
              as={StyledIconButton}
              icon={faChevronRight}
              color="transparent"
              disableRipple
              onClick={() => setOpenDialog(true)}
            />
          </ListItemWithButton>
          <ListItem>
            <IconWrapper>
              <Icon src={canBeSold} alt="" />
            </IconWrapper>
            <Column>
              <Text16 color="var(--c-reward-700)" bold>
                <FormattedMessage
                  id="DiscoverScarcities.ScarceCards.trulyOwn"
                  defaultMessage="Can be sold for {currency}"
                  values={{
                    currency: fiatCurrency.symbol,
                  }}
                />
              </Text16>
            </Column>
          </ListItem>
        </UnorderedList>
      </Wrapper>
    </>
  );
};
