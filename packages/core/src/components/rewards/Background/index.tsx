import classNames from 'classnames';
import { Fragment } from 'react';
import styled from 'styled-components';

import { range } from '@sorare/core/src/lib/arrays';

const Bg = styled.div<{ black?: boolean }>`
  background: ${({ black }) =>
    black ? 'var(--c-static-neutral-1000)' : 'var(--c-static-neutral-800)'};
  position: relative;
  overflow: hidden;
  color: var(--c-static-neutral-100);
  height: 100%;
  perspective: 500px;
  isolation: isolate;
`;

const Content = styled.div`
  height: 100%;
  z-index: 1;
  transform-style: preserve-3d;
`;

const Texts = styled.span`
  position: absolute;
  bottom: -0.5em;
  color: transparent;
  left: -10em;

  text-transform: uppercase;
  font-style: italic;
  font-size: 120px;
  line-height: 0.8;
  -webkit-text-stroke: 2px var(--c-static-neutral-600);
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) 3em
  );
  transition: 0.5s ease-in transform;
  transform-origin: center bottom;
  transform: none;
  &.tilt {
    transform: rotateX(55deg);
  }
`;

const Line = styled.div`
  white-space: nowrap;
  &:nth-child(2n) {
    transform: translateX(-1em);
  }
  &:nth-child(3n) {
    transform: translateX(-2.5em);
  }
  &:nth-child(5n) {
    transform: translateX(1.5em);
  }
`;

type Props = {
  text: string;
  className?: string;
  tiltText?: boolean;
  black?: boolean;
};

export const Background: React.FC<Props> = ({
  children,
  text,
  className,
  tiltText: tilt = false,
  black = true,
}) => (
  <Bg black={black}>
    <Texts className={classNames({ tilt })}>
      {range(4).map(i => (
        <Line key={i}>
          {range(10).map(j => (
            <Fragment key={j}>
              <span>{text}</span>{' '}
            </Fragment>
          ))}
        </Line>
      ))}
    </Texts>
    <Content className={className}>{children}</Content>
  </Bg>
);
