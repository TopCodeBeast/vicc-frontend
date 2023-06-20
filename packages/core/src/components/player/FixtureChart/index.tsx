import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import { fantasy, playerGameStatusLabels } from '@sorare/core/src/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  --border-width: 1px;
  --figure-height: 24px;
  --max-bar-height: var(--override-max-bar-height, 260px);
  gap: var(--border-width);
`;
const Fixture = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* unfortunate hack to add appropriate padding on the edge when
   * chart is in a scrolling container
   */
  &:last-child {
    padding-right: var(--intermediate-unit);
  }
`;
const FixtureName = styled.div`
  font: var(--t-12);
  color: var(--c-neutral-500);
  text-align: left;
  white-space: nowrap;
  align-self: flex-start;
  font-weight: var(--t-bold);
  margin-left: var(--half-unit);
`;

const Games = styled.div`
  display: flex;
  flex: 1;
  direction: initial;
  position: relative;
  padding: 0 var(--unit);
  gap: var(--unit);
  :before {
    content: '';
    position: absolute;
    right: 100%;
    top: 0;
    bottom: 0;
    width: var(--border-width);
    background: var(--border-color, var(--c-neutral-300));
  }
`;
const Bar = styled.div`
  height: calc(
    max(
      var(--max-bar-height) * (var(--score) / var(--max-score)),
      calc(var(--figure-height) / 2)
    )
  );
  background: linear-gradient(
    180deg,
    var(--background-color, var(--c-neutral-500)) 0%,
    var(--c-neutral-100) 100%
  );
  width: 100%;
  border-radius: var(--half-unit) var(--half-unit) 0 0;
  position: relative;
  mask: linear-gradient(rgba(0, 0, 0, 0.8) 40px, transparent);
`;

const Game = styled.div`
  --game-width: 28px;
  width: var(--game-width);

  --team-size: var(--quadruple-unit);
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: var(--triple-unit);
  &[role='button'] {
    cursor: pointer;
    :hover {
      ${Bar} {
        mask: linear-gradient(rgba(0, 0, 0, 0.9) 40px, transparent);
      }
    }
  }
`;
const Box = styled.div`
  height: var(--max-bar-height);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const BarContainer = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: var(--unit);
`;

const NegativeBar = styled.div`
  height: calc(
    max(
      var(--max-bar-height) * (-1 * var(--score) / var(--max-score)),
      calc(var(--figure-height) / 2)
    )
  );
  background: linear-gradient(
    180deg,
    var(--c-neutral-100),
    var(--background-color, var(--c-neutral-500))
  );
  width: 100%;
  border-radius: var(--half-unit);
  position: relative;
`;

const Score = styled.div`
  text-align: center;
  position: absolute;
  color: var(--c-static-neutral-1000);
  left: 0;
  right: 0;
  font: var(--t-bold) var(--t-16);
  border-radius: var(--half-unit);
  height: var(--figure-height);
`;

const PositiveScore = styled(Score)`
  top: calc(-0.5 * var(--figure-height));
  background-color: var(--background-color, var(--c-neutral-500));
`;

const NegativeScore = styled(Score)`
  bottom: calc(-0.5 * var(--figure-height));
  background-color: var(--background-color, var(--c-neutral-500));
`;

const LogoWrapper = styled.div`
  height: var(--team-size);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--unit);
  margin-bottom: var(--unit);
`;

const DNPLabelWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  margin-bottom: var(--half-unit);
  align-items: center;
`;

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  if (element == null) {
    return null;
  }

  const { overflowY, overflowX } = window.getComputedStyle(element);
  const isScrollable =
    (overflowY !== 'visible' && overflowY !== 'hidden') ||
    (overflowX !== 'visible' && overflowX !== 'hidden');

  if (
    isScrollable &&
    (element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth)
  ) {
    return element;
  }
  return getScrollParent(element.parentElement);
}

type Props = {
  InfiniteScrollLoader?: ReactNode;
  yMaxValue?: number;
  fixturesStats: {
    key?: string;
    label: string;
    games: {
      id: string;
      playerScore?: number;
      upcoming?: boolean;
      gameLabel?: ReactNode;
      startDate: string;
      color?: string;
      barLabel?: MessageDescriptor;
      dnpLabel?: ReactNode;
      onClick?: () => void;
    }[];
  }[];
};

export const FixtureChart = ({
  fixturesStats,
  InfiniteScrollLoader,
  yMaxValue,
}: Props) => {
  const { formatMessage } = useIntl();
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // ensure the rightmost part is visible
    const scrollableContainer = getScrollParent(elementRef.current);
    if (scrollableContainer) {
      scrollableContainer.scrollTo(scrollableContainer.scrollWidth, 0);
    }
  }, []);

  const maxScore = useMemo(
    () =>
      yMaxValue ||
      Math.max(
        ...fixturesStats.map(fixtureStats =>
          Math.max(
            ...fixtureStats.games.map(game =>
              game.playerScore ? Math.abs(game.playerScore) : 0
            )
          )
        ),
        1 // if we receive all zeros from the score, keeping 1 here to make zeros stick to the x-axis.
      ),
    [fixturesStats, yMaxValue]
  );

  return (
    <Wrapper
      ref={elementRef}
      style={
        {
          '--max-score': maxScore,
        } as React.CSSProperties
      }
    >
      {InfiniteScrollLoader}
      {fixturesStats.map(fixtureStats => {
        return (
          <Fixture key={fixtureStats.key || fixtureStats.label}>
            <FixtureName>{fixtureStats.label}</FixtureName>
            <Games>
              {!fixtureStats.games.length && (
                <Game>
                  <Box>
                    <Caption bold color="var(--c-neutral-600)">
                      <FormattedMessage
                        {...playerGameStatusLabels.did_not_play_short}
                      />
                    </Caption>
                  </Box>
                </Game>
              )}
              {fixtureStats.games
                .sort((g1, g2) => g1.startDate.localeCompare(g2.startDate))
                .map(game => {
                  return (
                    <Game
                      key={game.id}
                      onClick={game.onClick}
                      {...(game.onClick ? { role: 'button' } : {})}
                    >
                      {game.playerScore === undefined && (
                        <>
                          <Box>
                            <Caption bold color="var(--c-neutral-600)">
                              {game.upcoming ? (
                                <FontAwesomeIcon
                                  icon={faClock}
                                  aria-label={formatMessage(fantasy.upcoming)}
                                />
                              ) : (
                                <DNPLabelWrapper>
                                  {game.dnpLabel || (
                                    <FormattedMessage
                                      {...playerGameStatusLabels.did_not_play_short}
                                    />
                                  )}
                                </DNPLabelWrapper>
                              )}
                            </Caption>
                          </Box>
                          <LogoWrapper>{game.gameLabel}</LogoWrapper>
                        </>
                      )}
                      {game.playerScore !== undefined &&
                        (game.playerScore >= 0 ? (
                          <>
                            <Box>
                              <BarContainer
                                aria-label={
                                  game.barLabel
                                    ? formatMessage(game.barLabel)
                                    : ''
                                }
                                style={
                                  {
                                    '--score': game.playerScore,
                                    '--background-color': game.color,
                                  } as React.CSSProperties
                                }
                              >
                                <Bar />
                                <PositiveScore>
                                  {Math.round(game.playerScore)}
                                </PositiveScore>
                              </BarContainer>
                            </Box>
                            <LogoWrapper>{game.gameLabel}</LogoWrapper>
                          </>
                        ) : (
                          <>
                            <Box />
                            <LogoWrapper>{game.gameLabel}</LogoWrapper>
                            <BarContainer
                              aria-label={
                                game.barLabel
                                  ? formatMessage(game.barLabel)
                                  : ''
                              }
                              style={
                                {
                                  '--score': game.playerScore,
                                  '--background-color': game.color,
                                  marginBottom:
                                    'calc(0.5 * var(--figure-height))',
                                } as React.CSSProperties
                              }
                            >
                              <NegativeBar />
                              <NegativeScore>
                                {Math.round(game.playerScore)}
                              </NegativeScore>
                            </BarContainer>
                          </>
                        ))}
                    </Game>
                  );
                })}
            </Games>
          </Fixture>
        );
      })}
    </Wrapper>
  );
};
