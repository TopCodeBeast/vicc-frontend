import { VideoHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';

import { breakpoints } from '@core/style/mediaQuery';

import videoBg from './assets/videoBg.jpg';

const Video = styled.video`
  inset: 0;
  height: auto;
  width: 100%;
  object-fit: cover;
`;

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  mobileSrc: string;
}

const BrandingVideo = forwardRef<HTMLVideoElement, Props>((props, ref) => {
  const { mobileSrc, src } = props;
  return (
    <Video
      poster={videoBg}
      width="1180px"
      playsInline
      controls
      ref={ref}
      {...props}
    >
      <source
        src={mobileSrc || src}
        media={`all and (max-width: ${breakpoints.tablet}px)`}
      />
      <source src={src} />
    </Video>
  );
});

BrandingVideo.displayName = 'BrandingVideo';

export default BrandingVideo;
