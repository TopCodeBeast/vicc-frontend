import { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';

import {
  FiatWalletAccountState,
  FiatWalletKycState,
} from '__generated__/globalTypes';
import Dialog from '@core/components/dialog';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';

import { ActivationSuccess } from './ActivationSuccess';
import { DeclarativeForm } from './DeclarativeForm';
import DocumentCheck from './DocumentCheck';
import { HandleIdReviewError } from './HandleIdReviewError';
import { Intro } from './Intro';
import { ReviewInfoBeforeAddingId } from './ReviewInfoBeforeAddingId';
import { WhatsNew } from './WhatsNew';
import { CreateFiatWalletSteps } from './type';
import { useBackButtonTargets } from './useBackButtonTargets';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  justify-content: flex-start;
`;
const Body = styled(Content)`
  padding: var(--double-unit);
  height: 100%;
`;

export type Props = {
  onClose: () => void;
  statusTarget: FiatWalletAccountState;
  canDismissAfterActivation: boolean;
  activationSuccessCta?: ReactNode;
  unsupportedCountryCta?: ReactNode;
  onDismissActivationSuccess?: () => void;
  onDeclarativeFormSuccess?: () => void;
  initialStep?: CreateFiatWalletSteps;
  onDismissBeforeActivation?: () => void;
};

export const CreateFiatWallet = ({
  initialStep: initialStepProp,
  onDismissActivationSuccess,
  onDeclarativeFormSuccess,
  onClose,
  activationSuccessCta,
  unsupportedCountryCta,
  statusTarget,
  canDismissAfterActivation,
  onDismissBeforeActivation,
}: Props) => {
  const { canListAndTrade, kycStatus } = useFiatBalance();

  const initialStep = useMemo(() => {
    if (initialStepProp) return initialStepProp;
    if (
      kycStatus &&
      [FiatWalletKycState.OUT_OF_DATE, FiatWalletKycState.REFUSED].includes(
        kycStatus
      )
    )
      return CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR;
    if (
      kycStatus &&
      [
        FiatWalletKycState.VALIDATION_ASKED,
        FiatWalletKycState.CREATED,
      ].includes(kycStatus)
    )
      return CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW;

    return CreateFiatWalletSteps.INTRO;
  }, [initialStepProp, kycStatus]);

  const backTargets = useBackButtonTargets({ initialStep });
  const { up: isTablet } = useScreenSize('tablet');

  const [step, setStep] = useState<CreateFiatWalletSteps>(initialStep);

  const onModalClose = () => {
    if (
      initialStep === CreateFiatWalletSteps.INTRO &&
      step === CreateFiatWalletSteps.INTRO
    )
      return onClose;
    if (
      [
        CreateFiatWalletSteps.WHATS_NEW,
        CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR,
        CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW,
      ].includes(step)
    )
      return onClose;
    if (
      CreateFiatWalletSteps.ACTIVATION_SUCCESS === step &&
      canDismissAfterActivation
    ) {
      return onClose;
    }
    return undefined;
  };

  const onBack = () => {
    if (step && backTargets[step])
      return () => {
        if (step && backTargets[step]) {
          setStep(backTargets[step]!);
        } else onClose();
      };
    return undefined;
  };
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onBack={onBack()}
      open
      onClose={onModalClose()}
      fullScreen={!isTablet}
      body={
        <Body>
          {step === CreateFiatWalletSteps.WHATS_NEW && (
            <WhatsNew setStep={setStep} onDismiss={onDismissBeforeActivation} />
          )}
          {step === CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR && (
            <HandleIdReviewError setStep={setStep} />
          )}
          {step === CreateFiatWalletSteps.INTRO && (
            <Intro
              canDismissAfterActivation={canDismissAfterActivation}
              statusTarget={statusTarget}
              onGetStarted={() => {
                if (!canListAndTrade) {
                  setStep(CreateFiatWalletSteps.TELL_US_ABOUT_YOU);
                  return;
                }
                setStep(CreateFiatWalletSteps.REVIEW_INFO_BEFORE_ADDING_ID);
              }}
            />
          )}
          {[
            CreateFiatWalletSteps.TELL_US_ABOUT_YOU,
            CreateFiatWalletSteps.CHOOSE_CURRENCY,
          ].includes(step) && (
            <DeclarativeForm
              step={step}
              unsupportedCountryCta={unsupportedCountryCta}
              setStep={setStep}
              onClose={onClose}
              onSuccess={onDeclarativeFormSuccess}
            />
          )}

          {step === CreateFiatWalletSteps.ACTIVATION_SUCCESS && (
            <ActivationSuccess
              statusTarget={statusTarget}
              setStep={setStep}
              canDismissAfterActivation={canDismissAfterActivation}
              onAddIdDocument={() => {
                setStep(CreateFiatWalletSteps.CHOOSE_DOCUMENT);
              }}
              cta={activationSuccessCta}
              onDismiss={onDismissActivationSuccess}
            />
          )}
          {step === CreateFiatWalletSteps.REVIEW_INFO_BEFORE_ADDING_ID && (
            <ReviewInfoBeforeAddingId setStep={setStep} />
          )}
          {[
            CreateFiatWalletSteps.CHOOSE_DOCUMENT,
            CreateFiatWalletSteps.UPLOAD,
            CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW,
          ].includes(step as CreateFiatWalletSteps) && (
            <DocumentCheck
              setStep={setStep}
              currentStep={step as CreateFiatWalletSteps}
              onDone={onClose}
            />
          )}
        </Body>
      }
    />
  );
};

export default CreateFiatWallet;
