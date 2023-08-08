import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import {
  ElementType,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { animated, config, useSpringRef, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { StepProps } from '@core/components/carddrop/types';
import { Background } from '@core/components/rewards/Background';
import { glossary } from '@core/lib/glossary';

const FullScreenBackground = styled(Background).attrs({ black: false })`
  height: 100%;
  width: 100%;
  overflow: auto;
`;
const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const CardDropStep = styled(animated.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  & > * {
    flex: 1;
  }
`;

const Steps = styled.div`
  flex: 1;
  width: 100%;

  position: relative;
`;

const CloseDialog = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
`;

export type Props = {
  steps: ElementType<StepProps>[];
  onClose: StepProps['onClose'];
};

export const CardDropFlow = ({ steps, onClose }: Props) => {
  const ref = useSpringRef();
  const { formatMessage } = useIntl();
  const [step, setStep] = useState(0);
  const [claimedCard, setClaimedCard] = useState<ReactNode | null>(null);
  const transitions = useTransition(step, {
    ref,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
  });

  useEffect(() => {
    ref.start();
  }, [ref, step]);

  const nextStep = useCallback(() => {
    if (step >= steps.length - 1) {
      return;
    }
    setStep(previousStep => previousStep + 1);
  }, [step, steps.length]);

  if (!steps[step]) {
    return null;
  }

  return (
    <FullScreenBackground text="DROP">
      <ColumnLayout>
        <Steps>
          {transitions((styles, springStep) => {
            if (step !== springStep) return null;
            const Component = steps[springStep];
            return (
              <CardDropStep style={styles}>
                <Component
                  nextStep={nextStep}
                  setClaimedCard={(comp: ReactNode) => setClaimedCard(comp)}
                  claimedCard={claimedCard}
                  onClose={onClose}
                />
              </CardDropStep>
            );
          })}
        </Steps>
      </ColumnLayout>
      <CloseDialog>
        <IconButton
          onClick={onClose}
          color="white"
          icon={faTimes}
          aria-label={formatMessage(glossary.close)}
        />
      </CloseDialog>
    </FullScreenBackground>
  );
};
