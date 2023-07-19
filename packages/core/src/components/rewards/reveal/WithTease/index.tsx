import classnames from 'classnames';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { LaserReveal } from '../Laser';
import { Teaser } from '../Teaser';

const FadeOutElement = styled.button`
  cursor: pointer;
  transform-style: preserve-3d;
  max-width: 100%;
  &.fadeOut {
    animation: fadeOut 1s;
    animation-timing-function: cubic-bezier(0.9, 0.24, 0.83, 0.83);

    @keyframes fadeOut {
      0% {
        transform: rotateY(0deg) scale(1);
        opacity: 1;
      }
      70% {
        transform: rotateY(70deg) scale(0.5);
        opacity: 0;
      }
      to {
        transform: rotateY(70deg) scale(0.5);
        opacity: 0;
      }
    }
  }
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Front = styled.div`
  img {
    max-width: 100%;
  }
`;

type Props = {
  back: JSX.Element;
  front: ((isClaimed: boolean) => JSX.Element) | JSX.Element;
  teasers: JSX.Element[];
  reveal: boolean;
  onClickBack?: () => void;
  onFinish?: () => void;
};

export const RevealWithTease = ({
  front,
  back,
  teasers,
  reveal,
  onClickBack = () => {},
  onFinish = () => {},
}: Props) => {
  const [phase, setPhase] = useState<
    'unclaimed' | 'claiming' | 'teasing' | 'reveal' | 'claimed'
  >('unclaimed');
  const [teasingStep, setTeasingStep] = useState(0);

  const nextTeasingStep = useCallback(
    () => setTeasingStep(i => i + 1),
    [setTeasingStep]
  );

  if (reveal && phase === 'unclaimed') {
    setPhase('claiming');
  }

  if (phase === 'teasing' && teasingStep === teasers.length) {
    setPhase('reveal');
  }

  if (['unclaimed', 'claiming'].includes(phase)) {
    return (
      <FadeOutElement
        disabled={phase !== 'unclaimed'}
        onClick={onClickBack}
        className={classnames({ fadeOut: phase === 'claiming' })}
        onAnimationEnd={() => setPhase('teasing')}
      >
        {back}
      </FadeOutElement>
    );
  }
  if (phase === 'teasing') {
    return (
      <Center>
        <Teaser key={teasingStep} onFinish={nextTeasingStep}>
          {teasers[teasingStep]}
        </Teaser>
      </Center>
    );
  }

  const frontToRender =
    typeof front === 'function' ? front(phase === 'claimed') : front;

  if (phase === 'reveal') {
    return (
      <LaserReveal
        onAnimationEnd={() => {
          onFinish();
          setPhase('claimed');
        }}
      >
        {frontToRender}
      </LaserReveal>
    );
  }
  return <Front>{frontToRender}</Front>;
};
