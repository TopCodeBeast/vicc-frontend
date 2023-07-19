import classnames from 'classnames';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  active: boolean;
  onClick?: () => void;
  disablePositioning?: boolean;
  disableAnimation?: boolean;
}

const zIndexes = {
  outerContext: {
    aboveCard: 10, // make sure it goes above stats
  },
  innerContext: {
    belowLetter1: 1,
    belowLetter2: 2,
    letter: 3,
    aboveLetter: 4,
  },
};

const bounce = keyframes`
  from {
    transform: scale(1);
  }
  33% {
    transform: scale(1.15);
  }
  66% {
    transform: scale(1);
  }
  to {
    transform: scale(1);
  }
`;

const bounceIn = keyframes`
  from {
    transform: scale(0);
  }
  20% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1.05);
  }
  to {
    transform: scale(1);
  }
`;

const bounceOut = keyframes`
  from {
    transform: scale(1);
  }
  15% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.15);
  }
  to {
    transform: scale(0);
  }
`;

const shine = keyframes`
  from {
    transform: rotate(45deg) translateX(-100%);
  }
  30% {
    transform: rotate(45deg) translateX(120%);
  }
  to {
    transform: rotate(45deg) translateX(120%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Root = styled.button`
  z-index: ${zIndexes.outerContext.aboveCard};
  cursor: pointer;
  border: none;
  background: transparent;
  border-radius: 50%;
  box-shadow: -6px 12px 20px rgba(0, 0, 0, 0.3);
  --click-animation-duration: 1s;
  --bounce-duration: 2s;
  animation: ${fadeIn} var(--click-animation-duration);
  &:not(.disablePositioning) {
    isolation: isolate;
    position: absolute;
    top: -2px;
    left: -3px;
  }
`;
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--c-static-neutral-300);
  top: 0;
  left: 0;
  &::before,
  &::after {
    position: absolute;
    inset: 0;
    content: '';
    border-radius: 50%;
  }
  &::before {
    z-index: ${zIndexes.innerContext.belowLetter1};
    background-color: var(--c-static-neutral-300);
  }
  &::after {
    z-index: ${zIndexes.innerContext.belowLetter2};
    background-color: var(--c-yellow-600);
    transform: scale(0);
  }
  &.bounce {
    animation: ${bounce} var(--bounce-duration) ease infinite;
  }
  &.active {
    background-color: transparent;
    animation: none;
    &::before {
      animation: ${bounceOut} var(--click-animation-duration) ease forwards;
    }
    &::after {
      animation: ${bounceIn} var(--click-animation-duration) ease forwards;
    }
  }
  &.deselected {
    &::before {
      z-index: ${zIndexes.innerContext.belowLetter2};
      transform: scale(0);
      animation: ${bounceIn} var(--click-animation-duration) ease forwards;
    }
    &::after {
      z-index: ${zIndexes.innerContext.belowLetter1};
      animation: ${bounceOut} var(--click-animation-duration) ease forwards;
    }
  }
`;
const Captain = styled.div`
  position: relative;
  z-index: ${zIndexes.innerContext.letter};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: calc(var(--size, 32px) * 3 / 4);
  font-family: apercu-pro, system-ui, sans-serif;
  font-weight: 900;
  font-style: normal;
  line-height: 1;
  color: var(--c-static-neutral-1000);
`;
const ShineWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: ${zIndexes.innerContext.aboveLetter};
  background: transparent;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.9),
      transparent
    );
    border-radius: 50%;
    transform: rotate(45deg) translateX(-100%);
  }
  &.shine::after {
    animation: ${shine} var(--bounce-duration) infinite;
  }
  &.shineDeselected::after {
    animation: ${shine} var(--bounce-duration) var(--bounce-duration) infinite;
  }
`;

export const CaptainToggle = ({
  active,
  onClick = () => {},
  disablePositioning,
  disableAnimation,
}: Props) => {
  const [clicked, setClicked] = useState(false);
  const onCaptainClick = () => {
    setClicked(true);
    onClick();
  };

  return (
    <Root
      type="button"
      onClick={onCaptainClick}
      className={classnames({ disablePositioning })}
    >
      <Background
        className={classnames(
          { bounce: !disableAnimation },
          { active },
          { deselected: !active && clicked }
        )}
      />
      <Captain>C</Captain>
      <ShineWrapper
        className={classnames({
          shine: !active && !clicked && !disableAnimation,
          shineDeselected: !active && clicked && !disableAnimation,
        })}
      />
    </Root>
  );
};

export default CaptainToggle;
