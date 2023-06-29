import { useState } from 'react';
import { animated, useSprings } from '@react-spring/web';
import styled from 'styled-components';

import Waypoint from '@core/atoms/animations/Waypoint';
import Carousel from '@core/atoms/layout/Carousel';
import { desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';
import { theme } from '@core/style/theme';

interface Img {
  src: string;
  alt: string;
}

const CarouselContainer = styled.div`
  --factor1: 1.5;
  --factor2: 1.2;
  --cardWidth: 140px;

  @media ${tabletAndAbove} {
    --cardWidth: 200px;
  }

  padding: calc(
      var(--cardWidth) * (var(--factor1) - 1) * var(--card-aspect-ratio)
    )
    0px;
`;

const Img = styled(animated.img)`
  aspect-ratio: var(--card-aspect-ratio);
  min-width: 0;
  width: 140px;
  @media ${tabletAndAbove} {
    width: 200px;
  }
`;

const SlideContainer = styled(animated.div)`
  padding: 0 var(--unit);
`;

const StyledCarousel = styled(Carousel)`
  .slick-list {
    overflow: visible;
  }
  .slide > * {
    transition: all 0.3s linear;
  }

  .slick-track {
    @media ${desktopAndAbove} {
      display: flex;
      justify-content: center;
    }
  }

  & *[data-active='true'] > * {
    transform: scale(var(--factor1));
  }

  & *[data-prev='true'] > * {
    transform: scale(var(--factor2)) translateX(-30%);
  }
  & *[data-next='true'] > * {
    transform: scale(var(--factor2)) translateX(30%);
  }

  & *[data-before='true'] > * {
    transform: translateX(-45%);
  }

  & *[data-after='true'] > * {
    transform: translateX(calc(45%));
  }
`;

const ImgContainer = styled.div`
  position: relative;
  &:after {
    content: '';
    width: 100%;
    left: 0;
    position: absolute;
    top: 107%;
    box-shadow: 0px 0px 27px 4px rgba(0, 0, 0, 0.67);
  }
`;

type Props = {
  cards: Img[];
  defaultActiveCard?: number;
};

export const CardsCarousel = ({ cards, defaultActiveCard = 2 }: Props) => {
  const [index, setIndex] = useState(defaultActiveCard);
  const [isVisible, setIsVisible] = useState(false);

  const handleBeforeChange = (prev: number, next: number) => {
    setIndex(next);
  };

  const base = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-100px)',
  };

  const springs = useSprings(
    cards.length,
    cards.map((t, i) => ({ ...base, delay: 200 * (Math.abs(index - i) + 1) }))
  );

  return (
    <CarouselContainer>
      <StyledCarousel
        settings={{
          arrows: false,
          centerMode: true,
          variableWidth: true,
          autoplay: false,
          initialSlide: defaultActiveCard,
          slidesToShow: cards.length,
          infinite: false,
          touchThreshold: 10,
          responsive: [
            {
              breakpoint: theme.breakpoints.values.desktop,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
          beforeChange: handleBeforeChange,
        }}
      >
        {cards.map((card, i) => {
          const active = index === i;
          const isPrev = i === index - 1;
          const isNext = i === index + 1;
          const isBefore = i < index - 1;
          const isAfter = i > index + 1;
          return (
            <SlideContainer
              className="slide"
              key={card.alt}
              data-before={isBefore}
              data-prev={isPrev}
              data-active={active}
              data-next={isNext}
              data-after={isAfter}
            >
              <ImgContainer>
                <Img
                  loading="lazy"
                  src={card.src}
                  alt={card.alt}
                  style={springs[i]}
                />
              </ImgContainer>
            </SlideContainer>
          );
        })}
      </StyledCarousel>
      <Waypoint onEnter={() => setIsVisible(true)} />
    </CarouselContainer>
  );
};
