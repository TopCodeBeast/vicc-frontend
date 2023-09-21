import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useKey } from 'react-use';
import styled, { keyframes } from 'styled-components';

import { laptopAndAbove } from '@core/style/mediaQuery';

// Don't slow down tests
const VIDEO_TIMEOUT = import.meta.env.NODE_ENV === 'test' ? 10 : 3000;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-3%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const Root = styled.div`
  height: var(--100vh);
  display: flex;
  flex-direction: column;
  background-color: var(--c-neutral-100);
`;
const Wrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background: var(--c-neutral-1000);
  isolation: isolate;
  flex-direction: column;
  @media ${laptopAndAbove} {
    flex-direction: row;
  }
`;
const LineupPicker = styled.aside`
  z-index: 1;
  @media ${laptopAndAbove} {
    border-right: 1px solid var(--c-neutral-200);
    background: var(--c-neutral-100);
  }
`;
const LineupPickerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  background: var(--c-neutral-100);
  @media ${laptopAndAbove} {
    opacity: 0;
    animation: ${slideIn} 1s ease-in-out forwards var(--delay, 0.4s);
  }
`;
const MainWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-static-neutral-1000);
`;
const LineupHeader = styled.header`
  display: none;
  @media ${laptopAndAbove} {
    display: block;
    width: 100%;
    opacity: 0;
    animation: ${fadeIn} 1s ease-in-out forwards var(--delay, 1s);
    color: var(--c-static-neutral-100);
  }
`;
const LineupWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: var(--c-static-neutral-900);
`;

const Lineup = styled.div`
  position: relative;
  isolation: isolate;
  flex: 1;
  background: var(--c-static-neutral-1000);
  > * {
    z-index: 2;
  }
  @media ${laptopAndAbove} {
    &:before {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(
          to left,
          rgba(var(--c-static-rgb-neutral-1000), 0.8) 0%,
          rgba(var(--c-static-rgb-neutral-1000), 0) 20%
        ),
        linear-gradient(
          to right,
          rgba(var(--c-static-rgb-neutral-1000), 0.8) 0%,
          rgba(var(--c-static-rgb-neutral-1000), 0) 20%
        );
    }
  }
`;
const Video = styled.video`
  position: absolute;
  z-index: -1;
  inset: 0;
  object-fit: cover;
  object-position: center bottom;
  height: 100%;
  width: 100%;
`;
const DrawerWrapper = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: stretch;
  & > * {
    flex: 1;
  }
`;
type Props = {
  video: string;
  poster: string;
  lineupHeader?: ReactNode;
  bench: ReactNode;
  lineup: ReactNode;
  drawer: ReactNode;
  onConfirm?: () => void;
  stall?: boolean;
  disableAnimation?: boolean;
  videoDuration?: string;
};

export const ComposeTeamLayout = ({
  video,
  poster,
  lineupHeader,
  bench,
  lineup,
  drawer,
  stall,
  disableAnimation = false,
  videoDuration = '3s',
}: Props) => {
  const [searchParams] = useSearchParams();
  const isComingFromWebview = !!searchParams.get('deeplink');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(disableAnimation || isComingFromWebview);
  const [fallback, setFallback] = useState(
    disableAnimation || isComingFromWebview
  );
  const [removeDelay, setRemoveDelay] = useState(
    disableAnimation || isComingFromWebview
  );

  useKey('Escape', () => {
    setRemoveDelay(true);
    setFallback(true);
    setReady(true);
  });

  useEffect(() => {
    if (stall) {
      return undefined;
    }
    const currentRef = videoRef.current;
    const to = setTimeout(() => {
      // make sure the field load if the video takes too much time to appear
      setReady(true);
      setFallback(true);
    }, VIDEO_TIMEOUT);
    const handler = () => {
      setFallback(false);
      setReady(true);
      clearTimeout(to);
    };
    if (currentRef) {
      currentRef.addEventListener('canplaythrough', handler);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('canplaythrough', handler);
      }
      clearTimeout(to);
    };
  }, [stall]);

  return (
    <Root className="dark-theme">
      {!stall && (
        <Wrapper>
          <LineupPicker>
            <LineupPickerContent
              style={{ '--delay': removeDelay ? '0s' : '0.5s' } as any}
            >
              {bench}
            </LineupPickerContent>
          </LineupPicker>
          <MainWrapper>
            <LineupHeader
              style={{ '--delay': removeDelay ? '0s' : '0.5s' } as any}
            >
              {lineupHeader}
            </LineupHeader>
            <LineupWrapper>
              <Lineup
                style={
                  {
                    '--delay': removeDelay
                      ? '0s'
                      : `calc(${videoDuration} - 0.5s)`,
                  } as any
                }
              >
                {fallback ? (
                  <Video as="img" src={poster} alt="" />
                ) : (
                  <Video
                    ref={videoRef}
                    muted
                    autoPlay
                    playsInline
                    // Safari sometime hides the video, having a poster provide a nice fallback
                    // it's not set at the beginning to prevent flickering
                    poster={ready ? poster : undefined}
                  >
                    <source src={video} />
                  </Video>
                )}
                {ready && lineup}
              </Lineup>
              {drawer && <DrawerWrapper>{drawer}</DrawerWrapper>}
            </LineupWrapper>
          </MainWrapper>
        </Wrapper>
      )}
    </Root>
  );
};
