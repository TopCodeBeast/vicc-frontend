import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Title3 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import DialogOnboarding from '@sorare/core/src/components/onboarding/Dialog';
import { mobileAndAbove } from '@sorare/core/src/style/mediaQuery';

import step1 from './assets/step1.png';
import step2 from './assets/step2.png';

const Root = styled.div`
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

type Props = { open: boolean; onClose: () => void };
const OnboardingDialog = ({ open, onClose }: Props) => {
  return (
    <DialogOnboarding
      darkTheme
      open={open}
      steps={[
        <Root key="step1">
          <StepImage src={step1} alt="" />
          <Title3>
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step1.Title"
              defaultMessage="Earn Coins Via Competitions & Challenges"
            />
          </Title3>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step1.Content1"
              defaultMessage="At the end of every Game Week – Tuesdays and Fridays – you earn Coins based on your Sorare: Football teams’ scores (total of the individual competition scores)."
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step1.Content2"
              defaultMessage="The more teams you compete with – and the better they perform – the more Coins you’ll earn."
            />
          </Text14>
        </Root>,
        <Root key="step2">
          <StepImage src={step2} alt="" />
          <Title3>
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step2.Title"
              defaultMessage="Redeem Coins for Rewards"
            />
          </Title3>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step2.Content1"
              defaultMessage="Spend your Coins on a variety of in-game and real-life rewards:"
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step2.Content2"
              defaultMessage="<Bold>Skins</Bold> – Customize your profile with badges and banners to stand out from the competition."
              values={{ Bold }}
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step2.Content3"
              defaultMessage="<Bold>Boosts</Bold> – Improve the Experience Points (XP) of your cards."
              values={{
                Bold,
              }}
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step2.Content4"
              defaultMessage="<Bold>Tickets + Merch</Bold> (Coming Soon) – Pick from a range of match tickets, jerseys, and signed merch."
              values={{ Bold }}
            />
          </Text14>
        </Root>,
      ]}
      onClose={onClose}
    />
  );
};

export default OnboardingDialog;
