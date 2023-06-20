import classnames from 'classnames';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import StarBall from '@sorare/core/src/atoms/icons/StarBall';

const StarBallContainer = styled.div`
  position: relative;

  svg {
    width: var(--starballSize);
    height: var(--starballSize);
  }

  &:before,
  &:after {
    content: '';
    height: 1px;
    background-color: var(--c-static-neutral-500);
    position: absolute;
    top: calc(var(--starballSize) / 2);
    z-index: 0;
    transition: all 1s ease-in-out;
  }
  &:before {
    left: 0px;
    right: 100%;
  }
  &:after {
    left: 100%;
    right: 0px;
  }

  &.visible:before {
    left: -50vw;
  }

  &.visible:after {
    right: -50vw;
  }
`;

const MidfieldLine = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Waypoint
      onEnter={() => setVisible(true)}
      onLeave={() => setVisible(false)}
    >
      <StarBallContainer className={classnames({ visible })}>
        <StarBall />
      </StarBallContainer>
    </Waypoint>
  );
};

export default MidfieldLine;
