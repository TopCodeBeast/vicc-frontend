import { ReactElement, useLayoutEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import CloseButton from '@core/atoms/buttons/CloseButton';
import Dots from '@core/atoms/layout/Dots';
import Dialog from '@core/components/dialog';
import useTransitionApi from '@core/hooks/useTransitionApi';
import { glossary } from '@core/lib/glossary';
import { theme } from '@core/style/theme';

import Footer from './Footer';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  view-transition-name: onboarding-dialog-content;
  /* For mobile, ensures buttons are at bottom of screen */
  height: 100%;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 480px;
  }
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: var(--double-unit);
  right: var(--double-unit);
`;
const BackButton = styled(Button)`
  &.transparent {
    color: var(--c-neutral-600);
  }
`;

type Props = {
  open: boolean;
  steps: (ReactElement | ((args: { onNext: () => void }) => ReactElement))[];
  onClose: () => void;
  onDone?: () => void;
  darkTheme?: boolean;
};
export const DialogOnboarding = ({
  open,
  steps,
  onClose,
  onDone,
  darkTheme,
}: Props) => {
  const [step, setStep] = useState(0);
  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;
  const { updateDOM } = useTransitionApi();

  useLayoutEffect(() => {
    // When opening, set to first slide
    if (open) {
      setStep(0);
    }
  }, [open]);

  const onNext = () =>
    updateDOM(() =>
      isLastStep
        ? onDone?.() || onClose?.()
        : setStep(n => (n + 1) % steps.length)
    );

  const currentStep = steps[step];
  const currentStepElement =
    typeof currentStep === 'function' ? currentStep({ onNext }) : currentStep;

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={onClose}
      darkTheme={darkTheme}
    >
      <DialogContent>
        {onClose && (
          <CloseButtonWrapper>
            <CloseButton onClose={onClose} />
          </CloseButtonWrapper>
        )}
        {currentStepElement}
        <Footer
          key={step}
          left={
            !isFirstStep ? (
              <BackButton
                medium
                color="transparent"
                onClick={() => updateDOM(() => setStep(n => n - 1))}
              >
                <FormattedMessage {...glossary.back} />
              </BackButton>
            ) : null
          }
          middle={
            steps.length > 1 ? (
              <Dots
                count={steps.length}
                current={step}
                onChange={n => updateDOM(() => setStep(n))}
              />
            ) : null
          }
          right={
            <Button medium color="blue" onClick={onNext}>
              {isLastStep ? (
                <FormattedMessage
                  id="DialogOnboarding.Start"
                  defaultMessage="Start"
                />
              ) : (
                <FormattedMessage {...glossary.next} />
              )}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogOnboarding;
