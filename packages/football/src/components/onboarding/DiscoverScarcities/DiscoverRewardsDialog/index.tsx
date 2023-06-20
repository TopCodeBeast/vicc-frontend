import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';

import { ScarceCardsSpinner } from '@sorare/football/src/components/onboarding/DiscoverScarcities/ScarceCardsSpinner';
import cashPrizes from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/cashPrizes.png';
import earnCoins from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/earnCoins.png';
import gameTickets from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/gameTickets.png';
import jerseys from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/jerseys.png';
import realLifeExperiences from '@sorare/football/src/components/onboarding/DiscoverScarcities/assets/realLifeExperiences.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--quadruple-unit);
  padding: var(--double-unit);
`;

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  grid-template-areas: 'empty title close';
  align-self: stretch;
  text-align: center;
`;

const Title = styled(Title2)`
  grid-area: title;
  margin-top: var(--double-unit);
`;

const StyledCloseButton = styled(CloseButton)`
  grid-area: close;
  justify-self: flex-end;
`;

const RewardsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  width: 100%;
  max-width: 440px;
`;

const Reward = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--intermediate-unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
  padding: var(--intermediate-unit);
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
`;

const SpinnerWrapper = styled.div`
  width: 48px;
`;

type Props = { isOpen: boolean; onClose: () => void };

export const DiscoverRewardsDialog = ({ isOpen, onClose }: Props) => {
  const { formatMessage } = useIntl();

  const rewards = [
    {
      id: 'Cash',
      message: formatMessage({
        id: 'DiscoverRewardsDialog.cash',
        defaultMessage: 'Cash prizes',
      }),
      icon: cashPrizes,
    },
    {
      id: 'Jerseys',
      message: formatMessage({
        id: 'DiscoverRewardsDialog.jerseys',
        defaultMessage: 'Jerseys',
      }),
      icon: jerseys,
    },
    {
      id: 'Experiences',
      message: formatMessage({
        id: 'DiscoverRewardsDialog.experiences',
        defaultMessage: 'Real-life experiences with football players',
      }),
      icon: realLifeExperiences,
    },
    {
      id: 'Coins',
      message: formatMessage({
        id: 'DiscoverRewardsDialog.coins',
        defaultMessage: 'Coins to customise your club',
      }),
      icon: earnCoins,
    },
    {
      id: 'Tickets',
      message: formatMessage({
        id: 'DiscoverRewardsDialog.tickets',
        defaultMessage: 'Game tickets',
      }),
      icon: gameTickets,
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Wrapper>
        <TitleWrapper>
          <Title>
            <FormattedMessage
              id="DiscoverRewardsDialog.title"
              defaultMessage="Digital and physical rewards"
            />
          </Title>
          <StyledCloseButton onClose={onClose} />
        </TitleWrapper>
        <RewardsList>
          <Reward>
            <SpinnerWrapper>
              <ScarceCardsSpinner
                imageWidth={48}
                withScarcityText={false}
                nbCards={4}
              />
            </SpinnerWrapper>
            <Text16 bold>
              <FormattedMessage
                id="DiscoverRewardsDialog.cards"
                defaultMessage="Cards to expand your club"
              />
            </Text16>
          </Reward>
          {rewards.map(({ id, message, icon }) => (
            <Reward key={id}>
              <Icon src={icon} />
              <Text16 bold>{message}</Text16>
            </Reward>
          ))}
        </RewardsList>
      </Wrapper>
    </Dialog>
  );
};
