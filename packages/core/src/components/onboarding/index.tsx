import { ElementType, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { animated, config, useSpringRef, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { CloseButton } from '@core/atoms/buttons/CloseButton';
import { ScarcityBackground } from '@core/atoms/layout/ScarcityBackground';
import { Progress } from '@core/atoms/loader/Progress';
import { StepProps } from '@core/components/onboarding/types';
import { useOnboardingContext } from '@core/components/onboarding/useOnboardingContext';
import useEvents from '@core/lib/events/useEvents';

const OnboardingBackground = styled(ScarcityBackground)`
  position: fixed;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  overflow: auto;
`;
const OnboardingLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const OnboardingStep = styled(animated.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  & > * {
    flex: 1;
  }
`;

const ProgressStyled = styled(Progress)`
  --progress-color: var(--c-neutral-100);
  --progress-background-color: var(--c-neutral-300);
  max-width: 1fr;
  grid-area: status;
  align-self: center;
`;

const Steps = styled.div`
  flex: 1;
  width: 100%;

  position: relative;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-areas: 'empty status close';
  align-self: stretch;
`;

const StyledCloseButton = styled(CloseButton)`
  grid-area: close;
  justify-self: flex-end;
  margin: var(--intermediate-unit);
`;

export type Props = {
  steps: ElementType<StepProps>[];
  sport: Sport;
  closeRoute: string;
  hideProgressBar?: boolean;
  BackgroundContainer?: React.ComponentType<React.PropsWithChildren<any>>;
};

export const Onboarding = ({
  steps,
  sport,
  closeRoute,
  hideProgressBar,
  BackgroundContainer = OnboardingBackground,
}: Props) => {
  const ref = useSpringRef();
  const { step, clearOnboardingState, nextStep } = useOnboardingContext();
  const transitions = useTransition(step, {
    ref,
    reset: false,
    from: { opacity: 0, x: 1000 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -1000 },
    config: { ...config.stiff, clamp: true },
  });

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const isWebviewFromNativeApp = !!searchParams.get('deeplink');

  const track = useEvents();
  useEffect(() => {
    track('Start Onboarding', { sport, onboardingStatus: 'started' });
  }, [sport, track]);

  useEffect(() => {
    ref.start();
  }, [ref, step]);

  if (!steps[step]) {
    clearOnboardingState();
    return null;
  }

  return (
    <BackgroundContainer>
      <OnboardingLayout>
        <Header>
          {!hideProgressBar && (
            <ProgressStyled value={step} max={steps.length - 1} />
          )}
          {(sport !== Sport.BASEBALL || !isWebviewFromNativeApp) && (
            <StyledCloseButton small onClose={() => navigate(closeRoute)} />
          )}
        </Header>
        <Steps>
          {transitions((styles, springStep) => {
            if (step === springStep) {
              const Component = steps[springStep];
              return (
                <OnboardingStep style={styles}>
                  <Component nextStep={nextStep} />
                </OnboardingStep>
              );
            }
            return null;
          })}
        </Steps>
      </OnboardingLayout>
    </BackgroundContainer>
  );
};
