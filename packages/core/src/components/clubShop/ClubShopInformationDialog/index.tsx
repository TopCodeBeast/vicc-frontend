import { ReactElement } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import DialogOnboarding from '@core/components/onboarding/Dialog';
import { mobileAndAbove } from '@core/style/mediaQuery';

import badges from './assets/badges.png';
import coins from './assets/coins.png';

// These messages are used in both Football and MLB
// If you edit them, be cautious that it applies to both.

export const howToGetCoinsMessages = defineMessages({
  content2: {
    id: 'ClubShop.OnboardingDialog.Step1.Content2',
    defaultMessage:
      'The more teams you compete with – and the better they perform – the more Coins you’ll earn.',
  },
});

export const howToUseCoinsMessages = defineMessages({
  title: {
    id: 'ClubShop.OnboardingDialog.Step2.Title',
    defaultMessage: 'Redeem Coins for Rewards',
  },
  content1: {
    id: 'ClubShop.OnboardingDialog.Step2.Content1',
    defaultMessage:
      'Spend your Coins on a variety of in-game and real-life rewards:',
  },
  content3: {
    id: 'ClubShop.OnboardingDialog.Step2.Content3',
    defaultMessage:
      '<Bold>Boosts</Bold> – Improve the Experience Points (XP) of your cards.',
  },
  content4: {
    id: 'ClubShop.OnboardingDialog.Step2.Content4',
    defaultMessage:
      '<Bold>Tickets + Merch</Bold> (Coming Soon) – Pick from a range of match tickets, jerseys, and signed merch.',
  },
});

export const StepWrapper = styled.div`
  margin-top: var(--triple-unit);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--triple-unit);
`;

const StepImage = styled.img`
  width: 100px;
  @media ${mobileAndAbove} {
    width: 200px;
  }
`;

export const CoinsStepImage = () => <StepImage src={coins} alt="" />;
export const BadgesStepImage = () => <StepImage src={badges} alt="" />;

type Props = {
  steps: (ReactElement | ((args: { onNext: () => void }) => ReactElement))[];
  open: boolean;
  onClose: () => void;
};
export const ClubShopInformationDialog = ({ steps, open, onClose }: Props) => {
  return (
    <DialogOnboarding darkTheme open={open} steps={steps} onClose={onClose} />
  );
};
