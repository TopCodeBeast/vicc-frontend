import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';

import { ScarceCardsSpinner } from '@football/components/onboarding/DiscoverScarcities/ScarceCardsSpinner';
import cashPrizes from '@football/components/onboarding/DiscoverScarcities/assets/cashPrizes.png';
import earnCoins from '@football/components/onboarding/DiscoverScarcities/assets/earnCoins.png';
import gameTickets from '@football/components/onboarding/DiscoverScarcities/assets/gameTickets.png';
import jerseys from '@football/components/onboarding/DiscoverScarcities/assets/jerseys.png';
import realLifeExperiences from '@football/components/onboarding/DiscoverScarcities/assets/realLifeExperiences.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--quadruple-unit);
  padding: var(--double-unit);
`;
const CenteredTitle4 = styled(Title4)`
  text-align: center;
`;
const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  width: 100%;
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
const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
`;
const Icon = styled.img`
  width: 48px;
  height: 48px;
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
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      onClose={onClose}
      title={
        <CenteredTitle4>
          <FormattedMessage
            id="DiscoverRewardsDialog.title"
            defaultMessage="Digital and physical rewards"
          />
        </CenteredTitle4>
      }
      body={
        <Wrapper>
          <RewardsList>
            <Reward>
              <IconWrapper>
                <ScarceCardsSpinner
                  imageWidth={48}
                  withScarcityText={false}
                  nbCards={4}
                />
              </IconWrapper>
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
      }
    />
  );
};
