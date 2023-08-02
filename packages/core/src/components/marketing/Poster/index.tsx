import { faPlay } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ReactNode, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary } from '@core/lib/glossary';
import { breakpoints, laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

import Gap from '../Gap';
import { DrukWide64 } from '../typography';

type Props = {
  title: ReactNode;
  desc?: ReactNode;
  pictureUrl: string;
  rounded?: boolean;
  videoUrl?: {
    src: string;
    mobileSrc: string;
    preview?: string;
  };
};

const Wrapper = styled.div<{ rounded?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  border-radius: ${({ rounded }) => (rounded ? 'var(--unit)' : '0')};
  position: relative;
`;

const BackgroundImage = styled.div<{ pictureUrl: string; playing: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-image: url(${({ pictureUrl }) => pictureUrl});
  background-size: cover;
  background-position: center;
  /* background-repeat: no-repeat; */
  background-clip: border-box;
  padding: 120px var(--double-unit);
  @media ${tabletAndAbove} {
    padding: 0 var(--double-unit);
    aspect-ratio: 1.78;
  }
  transition: transform 0.3s ease-in-out;

  ${({ playing }) =>
    playing
      ? css`
          z-index: -1;
        `
      : css`
          position: relative;
          &:hover {
            transform: scale(1.02);
          }
        `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: var(--double-unit);
  z-index: 1;
  .playing & {
    z-index: -1;
  }
`;

const PosterTitle = styled(DrukWide64)`
  transition: 0.3s ease-in-out;
  .showPreview & {
    opacity: 0;
  }
`;
const PosterDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: 0.3s ease-in-out;
  .showPreview & {
    opacity: 0;
  }
`;

const PlayButton = styled.button`
  display: flex;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--unit);
  height: 120px;
  width: 120px;
  background-color: var(--c-neutral-100);
  border: 2px solid var(--c-neutral-100);
  font-family: Druk Wide, sans-serif;
  text-transform: uppercase;
  &:hover {
    transition: 0.3s ease-in-out;
    background-color: rgba(var(--c-rgba-neutral-1000), 0.5);
    color: var(--c-neutral-100);
    border: 2px solid var(--c-neutral-100);
  }
`;

const Video = styled.video`
  max-width: 100%;
  inset: 0;
  height: auto;
  width: 100%;
  object-fit: cover;
  position: absolute;
  @media ${tabletAndAbove} {
    aspect-ratio: 1.78;
  }
`;

const PreviewVideo = styled(Video)<{ showPreview: boolean }>`
  display: none;
  @media ${laptopAndAbove} {
    display: block;
    opacity: ${({ showPreview }) => (showPreview ? 1 : 0)};
  }
`;

export const Poster = ({
  title,
  desc,
  pictureUrl,
  rounded,
  videoUrl,
}: Props) => {
  const [playing, setIsPlaying] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [controls, setControls] = useState<boolean>(false);

  const { up: isLaptop } = useScreenSize('laptop');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      setControls(true);
      videoRef.current.play();
    }
  };

  const handlePlayPreview = () => {
    if (isLaptop) setShowPreview(true);
    if (previewRef.current) {
      previewRef.current.play();
    }
  };
  const handlePausePreview = () => {
    if (isLaptop) setShowPreview(false);
    if (previewRef.current) {
      previewRef.current.pause();
    }
  };

  const { mobileSrc, src, preview } = videoUrl || {};

  const videoUrlToUse = isLaptop ? src : mobileSrc || src;
  return (
    <Wrapper rounded={rounded}>
      <Video
        playsInline
        controls={controls}
        ref={videoRef}
        onPause={() => {
          setIsPlaying(false);
        }}
      >
        <source
          src={videoUrlToUse}
          media={`all and (max-width: ${breakpoints.tablet}px)`}
        />
        <source src={src} />
      </Video>
      <BackgroundImage pictureUrl={pictureUrl} playing={playing}>
        <PreviewVideo
          playsInline
          controls={false}
          ref={previewRef}
          showPreview={showPreview}
          loop
          muted
        >
          <source
            src={preview}
            media={`all and (max-width: ${breakpoints.tablet}px)`}
          />
        </PreviewVideo>
        {(title || desc) && (
          <Content className={classNames({ showPreview, playing })}>
            {title && (
              <PosterTitle as="h3" color="var(--c-static-neutral-100)">
                {title}
              </PosterTitle>
            )}
            {desc && <PosterDesc>{desc}</PosterDesc>}
            {videoUrl && (
              <>
                <Gap size="xs" />
                <PlayButton
                  onClick={handlePlayVideo}
                  onMouseEnter={handlePlayPreview}
                  onMouseLeave={handlePausePreview}
                >
                  <FontAwesomeIcon icon={faPlay} />
                  <FormattedMessage {...glossary.play} />
                </PlayButton>
              </>
            )}
          </Content>
        )}
      </BackgroundImage>
    </Wrapper>
  );
};
export default Poster;
