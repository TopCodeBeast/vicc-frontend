import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { FRONTEND_ASSET_HOST } from '@core/constants/assets';

const shuffle = keyframes`
  0% {
    transform: rotateY(0) scale(1);
  }
  50% {
    transform: rotateY(180deg) scale(1.2);
  }
  100% {
    transform: rotateY(360deg) scale(1);
  }
`;

const DURATION_MS = 700;
const Wrapper = styled.div`
  perspective: 1000px;
`;
const Img = styled.img`
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
  &.animating {
    animation: ${shuffle} ${DURATION_MS}ms linear;
  }
`;
type Props = {
  imgUrl?: string;
};

type Timeout = ReturnType<typeof setTimeout>;

export const AnimatedCardSwap = ({ imgUrl }: Props) => {
  const isFirstRender = useRef(true);
  const [animating, setAnimating] = useState(false);
  const [currentImg, setCurrentImg] = useState(imgUrl);

  const timeoutsRef = useRef<Timeout[]>(new Array(3));

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if (!imgUrl) {
      return undefined;
    }
    const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
    clearTimeouts();
    setAnimating(true);
    timeoutsRef.current[0] = setTimeout(() => {
      setCurrentImg(`${FRONTEND_ASSET_HOST}/cards/back/limited.svg`);
    }, (DURATION_MS * 1) / 4);
    timeoutsRef.current[1] = setTimeout(() => {
      setCurrentImg(imgUrl);
    }, (DURATION_MS * 3) / 4);
    timeoutsRef.current[2] = setTimeout(() => {
      setAnimating(false);
    }, DURATION_MS);

    return clearTimeouts;
  }, [imgUrl]);

  return (
    <Wrapper>
      <Img src={currentImg} className={classNames({ animating })} />
    </Wrapper>
  );
};
