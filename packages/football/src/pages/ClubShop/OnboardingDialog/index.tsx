import { FormattedMessage } from 'react-intl';

import { Text14, Title3 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import {
  BadgesStepImage,
  ClubShopInformationDialog,
  CoinsStepImage,
  StepWrapper,
  howToGetCoinsMessages,
  howToUseCoinsMessages,
} from '@sorare/core/src/components/clubShop/ClubShopInformationDialog';

type Props = { open: boolean; onClose: () => void };
const OnboardingDialog = ({ open, onClose }: Props) => {
  return (
    <ClubShopInformationDialog
      open={open}
      steps={[
        <StepWrapper key="step1">
          <CoinsStepImage />
          <Title3>
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step1.Title"
              defaultMessage="Earn Coins Via Competitions & Challenges"
            />
          </Title3>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.OnboardingDialog.Step1.Content1"
              defaultMessage="At the end of every Game Week – Tuesdays and Fridays – you earn Coins based on your Vicc: Cricket teams’ scores (total of the individual competition scores)."
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage {...howToGetCoinsMessages.content2} />
          </Text14>
        </StepWrapper>,
        <StepWrapper key="step2">
          <BadgesStepImage />
          <Title3>
            <FormattedMessage {...howToUseCoinsMessages.title} />
          </Title3>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage {...howToUseCoinsMessages.content1} />
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
              {...howToUseCoinsMessages.content3}
              values={{
                Bold,
              }}
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              {...howToUseCoinsMessages.content4}
              values={{ Bold }}
            />
          </Text14>
        </StepWrapper>,
      ]}
      onClose={onClose}
    />
  );
};

export default OnboardingDialog;
