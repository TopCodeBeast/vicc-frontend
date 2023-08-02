import { CSSProperties, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import styled, { css } from 'styled-components';

import ResponsiveImg from '@core/atoms/ui/ResponsiveImg';
import { laptopAndAbove } from '@core/style/mediaQuery';

const Root = styled(animated.div)`
  position: relative;
`;
const AnimatedBlock = styled.div`
  @media ${laptopAndAbove} {
    transform-style: preserve-3d;
    transform: perspective(600px) rotateX(var(--x)) rotateY(var(--y))
      scale(var(--s));
  }
`;
const Glare = styled.div`
  display: none;
  @media ${laptopAndAbove} {
    display: block;
    position: absolute;
    z-index: 1;
    inset: 0;
    pointer-events: none;
    transform-style: preserve-3d;
    mix-blend-mode: overlay;
    opacity: var(--o);
    mask-image: var(--picture-url);
    mask-size: contain;
  }
`;
const imgStyle = css`
  width: 100%;
  @media ${laptopAndAbove} {
    transform-style: preserve-3d;
    will-change: transform;
  }
`;
const ResponsiveCardImage = styled(ResponsiveImg)`
  ${imgStyle}
`;
const CardImage = styled.img`
  ${imgStyle}
`;

type Props = {
  pictureUrl: string | null;
  width?: number;
  wigglePower?: number;
  alt?: string;
};
const GlareEffect = ({
  pictureUrl,
  width,
  wigglePower = 0.07,
  alt = '',
}: Props) => {
  const cardRef = useRef<HTMLImageElement>(null);
  const [styles, api] = useSpring(() => ({
    '--mx': 0,
    '--my': 0,
    '--x': 0,
    '--y': 0,
    '--o': 0,
    '--s': 1,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  if (!pictureUrl) {
    return null;
  }

  return (
    <Root
      onMouseMove={({ clientX: mx, clientY: my }) => {
        const cardRect = cardRef?.current?.getBoundingClientRect();
        if (cardRect) {
          const mouseXPercent = ((mx - cardRect.left) * 100) / cardRect.width;
          const mouseYPercent = ((my - cardRect.top) * 100) / cardRect.height;
          api.start({
            '--mx': mouseXPercent,
            '--my': mouseYPercent,
            '--x': (mouseYPercent - 50) * wigglePower,
            '--y': (mouseXPercent - 50) * wigglePower,
            '--o': 0.4,
            '--s': 1,
          });
        }
      }}
      onMouseLeave={() => api.start({ '--x': 0, '--y': 0, '--s': 1, '--o': 0 })}
      style={
        {
          '--mx': styles['--mx'].to(mx => `${mx}%`),
          '--my': styles['--my'].to(my => `${my}%`),
          '--x': styles['--x'].to(x => `${x}deg`),
          '--y': styles['--y'].to(y => `${y}deg`),
          '--o': styles['--o'].to(o => o),
          '--s': styles['--s'].to(s => s),
          '--picture-url': `url(${pictureUrl})`,
        } as CSSProperties
      }
      ref={cardRef}
    >
      <AnimatedBlock>
        {width ? (
          <ResponsiveCardImage src={pictureUrl} alt={alt} width={width} />
        ) : (
          <CardImage src={pictureUrl} alt={alt} />
        )}
        <Glare
          style={{
            background: `radial-gradient(
              farthest-corner circle at var(--mx) var(--my),
              rgba(255, 255, 255, 1) 10%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(0, 0, 0, 0) 100%
            ), var(--picture-url) center / cover`,
          }}
        />
      </AnimatedBlock>
    </Root>
  );
};

export default GlareEffect;
