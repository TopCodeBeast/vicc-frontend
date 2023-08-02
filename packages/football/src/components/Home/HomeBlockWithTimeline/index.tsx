import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import GameWeekLabel, { Props as GameWeekLabelProps } from './GameWeekLabel';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    'gameweek title'
    'content content';
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content min-content;
  column-gap: var(--double-unit);
  @media ${laptopAndAbove} {
    grid-template-areas:
      'gameweek title'
      'line content';
  }
`;

const GameWeek = styled.div`
  grid-area: gameweek;
  height: fit-content;
`;

const TitleRow = styled.div`
  grid-area: title;
  display: flex;
  align-items: flex-end;
  gap: var(--unit);
`;

const TitleBlock = styled.div`
  flex: 1;
`;

const Delayable = styled.div`
  width: fit-content;
  &.loading {
    transform: opacity 2000ms ease-in;
    position: relative;
    & > * {
      opacity: 0;
    }
    &:after {
      opacity: 1;
      position: absolute;
      content: '';
      background: rgba(var(--c-rgb-neutral-200), 0.23);
      border-radius: var(--half-unit);
    }
  }
`;

const LineWrapper = styled.div`
  grid-area: line;
  display: none;
  @media ${laptopAndAbove} {
    display: block;
    position: relative;
  }
`;
const Line = styled.div`
  width: var(--half-unit);
  height: 100%;
  margin: auto;
  background: var(--c-neutral-400);
  &.isLast:after {
    position: absolute;
    bottom: 0;
    content: '';
    height: calc(12 * var(--unit));
    width: var(--half-unit);
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--c-neutral-100) 100%
    );
  }
`;

const Content = styled.div`
  grid-area: content;
  padding: var(--double-unit) 0 var(--quadruple-unit);
`;

type Props = {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  gameWeek: Nullable<number>;
  fixtureShortDisplayName?: string;
  type: GameWeekLabelProps['type'];
  isLast?: boolean;
};

const HomeBlockWithTimeline = ({
  title,
  action,
  children,
  loading,
  gameWeek,
  type,
  isLast,
  fixtureShortDisplayName,
}: Props) => {
  return (
    <Wrapper>
      {!loading && typeof gameWeek === 'number' && (
        <>
          {gameWeek && (
            <GameWeek>
              <GameWeekLabel
                type={type}
                gameWeek={gameWeek}
                fixtureShortDisplayName={fixtureShortDisplayName}
              />
            </GameWeek>
          )}
          <LineWrapper>
            <Line className={classNames({ isLast })} />
          </LineWrapper>
        </>
      )}
      {title && (
        <TitleRow>
          <TitleBlock>
            <Delayable className={classNames({ loading })}>{title}</Delayable>
          </TitleBlock>
          {!loading && action}
        </TitleRow>
      )}
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default HomeBlockWithTimeline;
