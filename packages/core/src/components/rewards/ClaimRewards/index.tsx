import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import {
  ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import { useKey } from 'react-use';
import styled from 'styled-components';

import { Revealer } from '@core/atoms/animations/Revealer';
import Button from '@core/atoms/buttons/Button';
import IconButton from '@core/atoms/buttons/IconButton';
import { Drawer } from '@core/atoms/layout/Drawer';
import { Carousel } from '@core/components/Carousel';
import { Reward } from '@core/components/rewards/types';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import { useToggleArray } from '@core/hooks/useToggleArray';
import { range } from '@core/lib/arrays';
import { glossary } from '@core/lib/glossary';
import { desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

import { Background } from '../Background';
import { RevealWithTease } from '../reveal/WithTease';

const addProps = (elt: ReactElement, props: { [key: string]: any }) => {
  const { className, ...rest } = props;
  return cloneElement(elt, {
    className: [elt.props.className, className].join(' '),
    ...rest,
  });
};

const RewardSelector = styled.div`
  grid-area: selector;
  align-self: flex-start;

  display: inline-flex;
  text-align: center;
  align-items: flex-end;
  justify-content: center;
  transition: 0.5s ease-in opacity;
  width: min(380px, calc(100vw - 2 * var(--unit)));
  &.revealing {
    opacity: 0;
  }
`;
const VisibleWindow = styled(animated.div)`
  overflow: auto;
  pointer-events: none;
  position: relative;
  display: flex;
  flex: 1;
`;

const Header = styled.div`
  width: 100%;
  flex: none;
  scroll-snap-align: start;
`;

const Content = styled.div`
  display: grid;
  grid-template-areas:
    'selector'
    'carousel'
    'tapToReveal';
  grid-template-rows: 1fr min-content 1fr;
  gap: var(--quadruple-unit);
  height: 100%;
  justify-content: center;
  transform-style: preserve-3d;
`;
const Actions = styled.div`
  display: none;
  @media ${tabletAndAbove} {
    display: block;
    position: absolute;
    top: var(--unit);
    left: var(--unit);
  }
`;

const CarouselWrapper = styled.div`
  transform-style: preserve-3d;
  grid-area: carousel;
  display: flex;
  justify-content: center;
`;

const BottomActions = styled.div`
  grid-area: tapToReveal;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
const TapToReveal = styled.div`
  background: var(--c-static-neutral-800);
  border-radius: 40px;
  padding: 4px 12px;
  margin-bottom: calc(var(--unit) * 9);
  font-family: apercu-pro;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: var(--c-static-neutral-100);
  bottom: 0;
`;
const RevealerFullHeight = styled(Revealer)`
  height: 100%;
  & > * {
    height: 100%;
    text-align: center;
  }
`;
const DrawerStyled = styled(Drawer)`
  border-radius: var(--double-unit) var(--double-unit) 0 0;
  background: white;
  @media ${tabletAndAbove} {
    margin: var(--double-unit) 0;
    border-radius: var(--double-unit) 0 0 var(--double-unit);
    width: 340px;
  }
  @media ${desktopAndAbove} {
    width: 440px;
  }
`;
type Props = {
  rewards: Reward[];
  onClaim: (id: string[]) => void;
};

export const ClaimRewards = ({ rewards, onClaim }: Props) => {
  const isDesktop = useIsDesktop();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerCardIndex, setDrawerCardIndex] = useState<number>(0);

  const [claimingAll, setClaimingAll] = useState(false);
  const [alreadyClaimed] = useState(() =>
    rewards.map(({ claimed }) => claimed)
  );
  const defaultIndex = alreadyClaimed.findIndex(claimed => !claimed);
  const [manuallyRevealed, setManuallyRevealed] = useState(() =>
    range(rewards.length).map(() => false)
  );
  const [automaticallyRevealed, setAutomaticallyRevealed] = useState(() =>
    range(rewards.length).map(() => false)
  );
  useEffect(() => {
    setAutomaticallyRevealed(manuallyRevealed);
  }, [manuallyRevealed, setAutomaticallyRevealed]);
  const setAllCardsRevealed = useToggleArray(setAutomaticallyRevealed);

  const { formatMessage } = useIntl();
  const scrollableArea = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, dangerousSetSelectedIndex] = useState(
    defaultIndex >= 0 ? defaultIndex : 0
  );
  const [revealingRewardIndex, setRevealingRewardIndex] = useState<
    undefined | number
  >(undefined);
  const clearRevealingRewardIndex = useCallback(
    () => setRevealingRewardIndex(undefined),
    []
  );

  const isRewardClaimed = useMemo(
    () =>
      rewards.map(
        (reward, index) =>
          reward.claimed ||
          manuallyRevealed[index] ||
          automaticallyRevealed[index]
      ),
    [rewards, manuallyRevealed, automaticallyRevealed]
  );

  const revealing = revealingRewardIndex !== undefined;

  useEffect(() => {
    // ensure not spoiling unclaimed reward
    if (isRewardClaimed[selectedIndex]) {
      setDrawerCardIndex(selectedIndex);
    }
  }, [isRewardClaimed, selectedIndex]);

  useEffect(() => {
    // Claiming reward
    if (revealingRewardIndex !== undefined) {
      const timeoutId = setTimeout(() => {
        setManuallyRevealed(x => {
          x[revealingRewardIndex] = true;
          return [...x];
        });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [revealingRewardIndex, setManuallyRevealed]);

  const safeSetSelectedIndex = useCallback(
    (...args: Parameters<typeof dangerousSetSelectedIndex>) => {
      if (revealingRewardIndex === undefined) {
        dangerousSetSelectedIndex(...args);
      }
    },
    [revealingRewardIndex, dangerousSetSelectedIndex]
  );

  const clickHandler = useCallback(
    index => {
      if (index === selectedIndex) {
        // startAnimation
        setRevealingRewardIndex(index);
        const alreadyClaimedId = rewards.find(
          ({ ids, claimed }) =>
            rewards[index].ids.some(id => ids.includes(id)) && claimed
        );
        if (!alreadyClaimedId) {
          onClaim(rewards[index].ids);
        }
      }
    },
    [selectedIndex, onClaim, rewards, setRevealingRewardIndex]
  );

  const value = useSpring({
    config: config.stiff,
    to: { springNumber: selectedIndex, fadeNumber: revealing ? 1 : 0 },
  });

  useKey(
    'ArrowLeft',
    () => safeSetSelectedIndex(i => Math.max(0, i - 1)),
    undefined,
    [safeSetSelectedIndex]
  );
  useKey(
    'ArrowRight',
    () => safeSetSelectedIndex(i => Math.min(rewards.length - 1, i + 1)),
    undefined,
    [safeSetSelectedIndex]
  );

  return (
    <>
      <Background
        text={rewards[selectedIndex]?.backgroundText}
        tiltText={revealing}
      >
        <Content>
          <RewardSelector className={classnames({ revealing })}>
            <IconButton
              disableDebounce
              color="white"
              disabled={selectedIndex === 0 || rewards.length < 2}
              onClick={() => safeSetSelectedIndex(i => i - 1)}
              title={formatMessage({
                id: 'ClaimRewards.nav.previous',
                defaultMessage: 'Previous',
              })}
              icon={faAngleLeft}
            />
            <VisibleWindow
              ref={scrollableArea}
              className="hiddenScrollbars"
              scrollLeft={value.springNumber.to(
                v =>
                  ((
                    scrollableArea.current?.childNodes[0] as
                      | HTMLDivElement
                      | undefined
                  )?.offsetWidth || 0) * v
              )}
            >
              {rewards.map(reward => (
                <Header key={reward.key || reward.ids[0]}>
                  {reward.header}
                </Header>
              ))}
            </VisibleWindow>
            <IconButton
              disableDebounce
              color="white"
              disabled={
                selectedIndex === rewards.length - 1 || rewards.length < 2
              }
              onClick={() => safeSetSelectedIndex(i => i + 1)}
              title={formatMessage(glossary.next)}
              icon={faAngleRight}
            />
          </RewardSelector>

          <CarouselWrapper>
            <Carousel
              elements={rewards}
              selectedIndex={selectedIndex}
              setSelectedIndex={number =>
                safeSetSelectedIndex(
                  Math.max(0, Math.min(rewards.length - 1, number))
                )
              }
              onClick={(element, index) => {
                safeSetSelectedIndex(index);
              }}
              style={
                {
                  perspective: 'unset',
                  '--slotSize':
                    'min(40vw, calc(50vh * var(--card-aspect-ratio)), 250px)',
                } as React.CSSProperties
              }
              renderElement={(reward, index) => {
                return (
                  <animated.div
                    key={reward.ids[0]}
                    style={{
                      width: '100%',
                      height: '100%',
                      perspective: '500px',
                      // fade when revealing
                      opacity: value.fadeNumber.to(v =>
                        index === selectedIndex ? 1 : 1 - v
                      ),
                      // Force visibility hidden to prevent safari bug from showing cards
                      visibility: value.fadeNumber.to(v =>
                        index === selectedIndex || v !== 1
                          ? 'visible'
                          : 'hidden'
                      ),
                    }}
                  >
                    <RevealerFullHeight
                      front={
                        typeof reward.front === 'function'
                          ? reward.front()
                          : reward.front
                      }
                      back={
                        <RevealWithTease
                          front={reward.front}
                          back={addProps(reward.back, {
                            className: selectedIndex === index ? 'shine' : '',
                            shine: selectedIndex === index,
                          })}
                          teasers={reward.teasers}
                          onClickBack={() => {
                            clickHandler(index);
                          }}
                          reveal={manuallyRevealed[index]}
                          onFinish={clearRevealingRewardIndex}
                        />
                      }
                      revealed={
                        alreadyClaimed[index] ||
                        (claimingAll &&
                          automaticallyRevealed[index] &&
                          !manuallyRevealed[index])
                      }
                    />
                  </animated.div>
                );
              }}
            />
          </CarouselWrapper>
          <BottomActions>
            {!isRewardClaimed[selectedIndex] ? (
              <TapToReveal>
                <FormattedMessage
                  id="Rewards.tapToReveal"
                  defaultMessage="Tap the Card to reveal"
                />
              </TapToReveal>
            ) : (
              rewards[selectedIndex]?.drawerContent &&
              revealingRewardIndex === undefined && (
                <Button
                  color="blue"
                  medium
                  onClick={() => setIsDrawerOpen(true)}
                  disabled={isDrawerOpen}
                >
                  <FormattedMessage
                    id="Rewards.stats"
                    defaultMessage="Show stats"
                  />
                </Button>
              )
            )}
          </BottomActions>
        </Content>
        <Actions>
          <Button
            color="white"
            medium
            disabled={
              revealingRewardIndex !== undefined ||
              automaticallyRevealed.every(r => r === true)
            }
            onClick={() => {
              setClaimingAll(true);
              // claim the cards not yet revealed
              const cardsIdToReveal = rewards
                .map(r => r.ids)
                .filter(
                  (id, index) =>
                    !manuallyRevealed[index] && !alreadyClaimed[index]
                );
              if (cardsIdToReveal.length) {
                onClaim(cardsIdToReveal.flatMap(ids => ids));
              }
              // mark all as revealed
              setAllCardsRevealed(true);
            }}
          >
            <FormattedMessage
              id="RewardsBanner.claimAll"
              defaultMessage="Claim all"
            />
          </Button>
        </Actions>
      </Background>
      {rewards[selectedIndex]?.drawerContent && (
        <DrawerStyled
          open={
            isDrawerOpen &&
            revealingRewardIndex === undefined &&
            isRewardClaimed[selectedIndex]
          }
          side={isDesktop ? 'right' : 'bottom'}
        >
          {rewards[drawerCardIndex].drawerContent?.(() =>
            setIsDrawerOpen(false)
          )}
        </DrawerStyled>
      )}
    </>
  );
};
