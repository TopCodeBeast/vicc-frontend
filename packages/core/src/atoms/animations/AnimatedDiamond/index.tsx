import classNames from 'classnames';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import diamondGif from '@core/assets/animations/diamond.gif';
import diamond from '@core/assets/animations/diamond.png';

const RootWrapper = styled.div`
  transform: translateY(50%);
`;
const Wrapper = styled.div`
  position: relative;
  transform: translateY(-50%);
  transform-origin: 0 0;
  display: flex;
  &::before {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    transform: scale(0) translate(-50%, -50%);
    transform-origin: 0 0;
    filter: blur(5px);
    background: #20deff;
    content: '';
  }
  &.turnAnimation::before {
    animation: scale 1s ease;
    @keyframes scale {
      0% {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
      }
      50% {
        transform: scale(3) translate(-50%, -50%);
        opacity: 1;
      }
      100% {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
      }
    }
  }
  &.shakeAnimation::before {
    background: var(--c-red-600);
    animation: scale 1s ease;
    @keyframes scale {
      0% {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
      }
      50% {
        transform: scale(3) translate(-50%, -50%);
        opacity: 1;
      }
      100% {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
      }
    }
  }
  &.shakeAnimation {
    animation: shakeAnimation 0.3s ease-in-out;
    @keyframes shakeAnimation {
      10%,
      90% {
        transform: translate3d(-1px, -50%, 0);
      }
      20%,
      80% {
        transform: translate3d(2px, -50%, 0);
      }
      30%,
      50%,
      70% {
        transform: translate3d(-4px, -50%, 0);
      }

      40%,
      60% {
        transform: translate3d(4px, -50%, 0);
      }
    }
  }
`;

type Props = {
  size?: number;
};

export type AnimatedDiamond = {
  shake: () => void;
  turn: () => void;
};

export const AnimatedDiamond = forwardRef<AnimatedDiamond, Props>(
  ({ size = 35 }, ref) => {
    const [runningAnimation, setRunningAnimation] = useState<
      'none' | 'shake' | 'turn'
    >('none');

    const isMounted = useRef(false);
    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const clearAnimationTimeout = () => {
      if (isMounted.current) {
        setRunningAnimation('none');
      }
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };

    useImperativeHandle(
      ref,
      () => {
        const runAnimation = (animation: typeof runningAnimation) => {
          clearAnimationTimeout();
          setTimeout(() => {
            if (isMounted.current) {
              setRunningAnimation(animation);
            }
          });
          timeout.current = setTimeout(() => {
            if (isMounted.current) {
              setRunningAnimation('none');
            }
          }, 1000);
        };
        return {
          turn() {
            runAnimation('turn');
          },
          shake() {
            runAnimation('shake');
          },
        };
      },
      []
    );

    useEffect(() => {
      return () => clearAnimationTimeout();
    }, []);
    return (
      <RootWrapper>
        <Wrapper
          className={classNames({
            turnAnimation: runningAnimation === 'turn',
            shakeAnimation: runningAnimation === 'shake',
          })}
        >
          {/* {runningAnimation === 'turn' ? (
            <img width={size} height={size} src={diamondGif} alt="" />
          ) : (
            <img width={size} height={size} src={diamond} alt="" />
          )} */}
          <img width={size} height={size} src={diamond} alt="" />
        </Wrapper>
      </RootWrapper>
    );
  }
);

AnimatedDiamond.displayName = 'AnimatedDiamond';
