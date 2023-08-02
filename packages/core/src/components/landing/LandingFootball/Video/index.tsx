import { faPlay } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import styled from 'styled-components';

import Container from '@core/atoms/layout/Container';
import BrandingVideo from '@core/components/content/BrandingVideo';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { MixedFontTitle, SubTitle } from '../ui';

const StyledContainer = styled(Container)`
  @media ${tabletAndAbove} {
    padding-top: calc(8 * var(--unit));
    padding-bottom: calc(8 * var(--unit));
  }
`;

const Play = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--c-static-neutral-100);
  color: var(--c-static-neutral-100);
  transition: all 0.3s ease-in-out;

  svg {
    margin-left: 4px;
  }

  @media ${tabletAndAbove} {
    width: 80px;
    height: 80px;
  }
`;

const VideoThumbnail = styled.div`
  position: absolute;
  inset: 0;
  border-radius: var(--double-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--double-unit);
  cursor: pointer;

  &:hover {
    ${Play} {
      background: var(--c-static-neutral-100);
      color: var(--c-static-neutral-1000);
    }
  }

  @media ${tabletAndAbove} {
    gap: var(--quadruple-unit);
  }
`;

const VideoContainer = styled.div`
  position: relative;
`;

const Video = styled(BrandingVideo)`
  border-radius: var(--triple-unit);
  max-width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const StyledSubTitle = styled(SubTitle)`
  margin-bottom: var(--triple-unit);
`;
interface Props {
  title?: string;
  subtitle?: string;
  className?: string;
  poster: string;
  src: string;
  mobileSrc: string;
}
const Videos = (props: Props) => {
  const { title, subtitle, src, poster, mobileSrc, className } = props;
  const [playing, setIsPlaying] = useState(false);
  const [controls, setControls] = useState(false);
  const { up: isTablet } = useScreenSize('tablet');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      setControls(true);
      videoRef.current.play();
    }
  };
  return (
    <StyledContainer className={className}>
      <Content>
        {title && <MixedFontTitle>{title}</MixedFontTitle>}
        {subtitle && <StyledSubTitle>{subtitle}</StyledSubTitle>}
        <VideoContainer>
          <Video
            mobileSrc={mobileSrc}
            src={src}
            poster={poster}
            ref={videoRef}
            controls={controls}
          />
          {!playing && (
            <VideoThumbnail onClick={handlePlayVideo} role="button">
              <Play>
                <FontAwesomeIcon icon={faPlay} size={isTablet ? '2x' : '1x'} />
              </Play>
            </VideoThumbnail>
          )}
        </VideoContainer>
      </Content>
    </StyledContainer>
  );
};
export default Videos;
