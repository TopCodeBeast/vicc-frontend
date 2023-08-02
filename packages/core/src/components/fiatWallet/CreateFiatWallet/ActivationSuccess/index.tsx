import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Text14, Text16, Title2, Title5 } from '@core/atoms/typography';
import { fiatWallet, glossary } from '@core/lib/glossary';

import StepWrapper from '../StepWrapper';
import { CreateFiatWalletSteps } from '../type';

const messages = defineMessages({
  ownerDescription: {
    id: 'CreateFiatWallet.ActivationSuccess.ownerDescription',
    defaultMessage:
      'You can now accept cash for Sorare cards you list for sale.',
  },
  validatedOwnerDescription: {
    id: 'CreateFiatWallet.ActivationSuccess.validatedOwnerDescription',
    defaultMessage:
      'Last step: Add your government-issued ID to help us verify your identity, enabling you to make cash deposits, withdrawals, and receive competition cash rewards.',
  },
});

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const Root = styled(Column)`
  gap: var(--triple-unit);
  min-height: 200px;
`;

const Content = styled(Column)`
  width: 100%;
  gap: var(--double-unit);
`;

const Block = styled(Column)`
  width: 100%;
  gap: var(--unit);
`;

const Helper = styled(Column)`
  background-color: var(--c-neutral-300);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  gap: var(--double-unit);
`;

type Props = {
  statusTarget: FiatWalletAccountState;
  setStep: (step: CreateFiatWalletSteps) => void;
  onDismiss?: () => void;
  onAddIdDocument: () => void;
  canDismissAfterActivation?: boolean;
  cta?: ReactNode;
};
export const ActivationSuccess = ({
  statusTarget,
  setStep,
  onAddIdDocument,
  onDismiss = () => {},
  cta,
  canDismissAfterActivation,
}: Props) => {
  const fromOnBoarding =
    statusTarget === FiatWalletAccountState.VALIDATED_OWNER &&
    canDismissAfterActivation;
  const fromListing = statusTarget === FiatWalletAccountState.OWNER;

  const fromDepositRewardsWithdraw =
    statusTarget === FiatWalletAccountState.VALIDATED_OWNER &&
    !canDismissAfterActivation;

  return (
    <StepWrapper
      setStep={setStep}
      step={CreateFiatWalletSteps.ACTIVATION_SUCCESS}
      submitButton={
        (fromListing || fromDepositRewardsWithdraw) && (
          <Block>
            {fromListing && (
              <Button fullWidth onClick={onDismiss} medium color="blue">
                {cta || <FormattedMessage {...glossary.done} />}
              </Button>
            )}
            {fromDepositRewardsWithdraw && (
              <Button fullWidth onClick={onAddIdDocument} medium color="blue">
                <FormattedMessage
                  id="walletSetup.success.addId"
                  defaultMessage="Add my ID"
                />
              </Button>
            )}
          </Block>
        )
      }
    >
      <Root>
        <Content>
          <div>
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="var(--c-green-600)"
              size="3x"
            />
          </div>
          <Title2>
            <FormattedMessage
              id="walletSetup.success.title"
              defaultMessage="Your Cash Wallet is activated"
            />
          </Title2>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              {...(fromDepositRewardsWithdraw
                ? messages.validatedOwnerDescription
                : messages.ownerDescription)}
            />
          </Text16>
          {fromOnBoarding && (
            <Helper>
              <Content>
                <Block>
                  <Text14 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="walletSetup.success.onBoarding.headline"
                      defaultMessage="One final item!"
                    />
                  </Text14>
                  <Title5>
                    <FormattedMessage
                      id="walletSetup.success.onBoarding.title"
                      defaultMessage="Enable cash deposits, withdrawals, and competition rewards in your Cash Wallet."
                    />
                  </Title5>
                  <Text16 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="walletSetup.success.onBoarding.description"
                      defaultMessage="To do so, please upload a government-issued ID. You can also do this later via your account settings."
                    />
                  </Text16>
                </Block>
                <Block>
                  <Button
                    fullWidth
                    onClick={onAddIdDocument}
                    medium
                    color="blue"
                  >
                    <FormattedMessage {...fiatWallet.addMyId} />
                  </Button>
                  <Button fullWidth onClick={onDismiss} medium color="white">
                    <FormattedMessage
                      id="walletSetup.success.addIdLater"
                      defaultMessage="I’ll add my ID later"
                    />
                  </Button>
                </Block>
              </Content>
            </Helper>
          )}
        </Content>
      </Root>
    </StepWrapper>
  );
};
