import { FC, useEffect, useRef, useState } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { animated, useTransition } from 'react-spring';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { theme } from '@sorare/core/src/style/theme';

const Root = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
  &:after {
    position: absolute;
    content: '';
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent,
      var(--c-static-neutral-1000)
    );
  }
`;
const Content = styled(Container)`
  position: absolute;
  bottom: var(--quadruple-unit);
  z-index: 1;
  gap: var(--intermediate-unit);
  width: 100%;
`;
const Titles = styled.div`
  position: relative;
  width: 100%;
`;
const Title = styled(animated.h1)`
  --minFont: 32;
  --maxFont: 48;
  --minWidth: 320;
  --maxWidth: 1200;
  line-height: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  color: var(--c-static-neutral-100);
  font-size: clamp(2rem, 2vw + 1.5rem, 3rem);
  font-weight: normal;
  text-transform: uppercase;
  font-family: Romie-Regular, serif;
  strong {
    display: block;
    ${theme.styledFonts.drukWideSuper};
  }
`;
const Picture = styled(animated.picture)`
  height: 360px;
  object-fit: cover;
`;

type Props = {
  speed?: number;
  slides: {
    title: MessageDescriptor;
    sources?: { media?: string; srcSet: string }[];
    src: string;
  }[];
};
const Slider: FC<Props> = ({ speed = 4000, slides, children }) => {
  const [index, setIndex] = useState(0);
  const to = useRef<ReturnType<typeof setTimeout>>();
  const backgroundTransition = useTransition(index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: { duration: 300 },
    onRest: (result, controller, item) => {
      if (index === item) {
        clearTimeout(to.current);
        to.current = setTimeout(() => {
          setIndex(state => (state + 1) % slides.length);
        }, speed);
      }
    },
  });
  const textTransition = useTransition(index, {
    from: { x: '-20%', opacity: 0 },
    enter: { x: '0', opacity: 1 },
    leave: { x: '-20%', opacity: 0 },
    config: { duration: 200 },
  });

  useEffect(() => () => clearTimeout(to.current), []);

  return (
    <Root>
      {backgroundTransition((style, i) => {
        return (
          <Picture style={style}>
            {slides[i].sources?.map(({ media, srcSet }) => (
              <source key={srcSet} media={media} srcSet={srcSet} />
            ))}
            <img src={slides[i].src} alt="" />
          </Picture>
        );
      })}
      <Content>
        <Titles>
          {textTransition((style, i) => {
            return (
              <Title style={style}>
                <FormattedMessage {...slides[i].title} />
              </Title>
            );
          })}
        </Titles>
        <div>{children}</div>
      </Content>
    </Root>
  );
};

export default Slider;
