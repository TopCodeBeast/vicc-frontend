import { useState } from 'react';
import { animated, easings, useTransition } from '@react-spring/web';
import styled from 'styled-components';

const Wrapper = styled(animated.div)`
  display: inline-block;
  transform-style: preserve-3d;
  transform: translateZ(0);
`;

const Badge = styled.div`
  height: calc(8 * var(--unit));
  width: calc(8 * var(--unit));
  border-radius: 50%;
  background-color: white;
  line-height: calc(5 * var(--unit));
  box-shadow: 0 0 calc(3 * var(--unit)) var(--unit) var(--c-static-neutral-100);
  color: var(--c-static-neutral-1000);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
  font-style: italic;
  transform-style: preserve-3d;
  transform: translateZ(0);
  > * {
    max-height: 40px;
    transform-style: preserve-3d;
    transform: translateZ(20px);
  }
`;

type Props = {
  onFinish: () => void;
  children: JSX.Element;
};

export const Teaser: React.FC<Props> = ({ children, onFinish }) => {
  const [show, setShow] = useState<boolean | undefined>(true);

  const transitions = useTransition(show, {
    from: { scale: 0, rotateY: '120deg', opacity: 0 },
    enter: {
      scale: 1,
      rotateY: '0deg',
      opacity: 1,
      onRest: () => setShow(false),
      config: {
        duration: 700,
        easing: easings.linear,
      },
    },
    leave: {
      scale: 1.75,
      rotateY: '-70deg',
      opacity: 0,
      onRest: onFinish,
      config: {
        duration: 700,
        easing: easings.linear,
      },
    },
  });

  return transitions(
    (styles, showElt) =>
      showElt && (
        <Wrapper style={styles}>
          <Badge>{children}</Badge>
        </Wrapper>
      )
  );
};
