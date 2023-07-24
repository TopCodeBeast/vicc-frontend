import styled from 'styled-components';

import useSlider from '@core/hooks/useSlider';
import useEvents from '@core/lib/events/useEvents';
import { tabletAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

import { Props } from '../types';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { ComposeTeamSlide } from './ComposeTeamSlide';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Slide } from './Slide';

const Container = styled.div`
  position: relative;
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  gap: var(--double-unit);
  scroll-snap-type: x mandatory;
  overflow-x: auto;

  @media ${tabletAndAbove} {
    ${hideScrollbar};
  }
`;

const Scroller = styled.div<{ $dark?: boolean }>`
  position: absolute;
  bottom: calc(3 * var(--unit));
  right: calc(3 * var(--unit));
  gap: var(--double-unit);
  display: flex;
  flex-direction: row;
  color: ${({ $dark }) => ($dark ? 'white' : 'inherit')};
  transition: color 0.5s ease;
`;

const Dot = styled.button<{ $active: boolean }>`
  appearance: none;
  width: var(--unit);
  height: var(--unit);
  border-radius: var(--double-unit);

  /* Make target 4x larger than it appears (16x16 instead of 8x8) */
  margin: calc(var(--unit) * -1);
  padding: var(--unit);
  box-sizing: content-box;
  background-clip: content-box;
  background-color: currentColor;
  color: inherit;
  opacity: ${({ $active }) => ($active ? 1 : 0.25)};
  transition: opacity 0.5s ease;
`;

export const InnerBanner = ({
  slides,
  analyticsParams,
  isComposeTeam,
}: Props) => {
  const { scrollerRef, active, handleDotClick } = useSlider({
    autoScroll: true,
  });

  const track = useEvents();
  const trackClickOnBanner = (
    { title, id }: { title: string; id: string },
    index: number
  ) => {
    track('[Client] Click On Banner', {
      ...analyticsParams,
      tileIndex: index,
      bannerId: id,
      bannerTitle: title,
      bannerType: 'ResponsiveBanner',
    });
  };

  const displayDots = slides.length > 1;

  const SlideComponent = isComposeTeam ? ComposeTeamSlide : Slide;

  return (
    <Container>
      <SlideContainer ref={scrollerRef}>
        {slides.map((props, index) => (
          <SlideComponent
            key={props.id}
            track={() =>
              trackClickOnBanner({ title: props.title, id: props.id }, index)
            }
            {...props}
          />
        ))}
        {displayDots && (
          <Scroller $dark={Boolean(slides[active]?.dark)}>
            {slides.map(({ id }, index) => (
              <Dot
                key={id}
                onClick={handleDotClick}
                $active={index === active}
              />
            ))}
          </Scroller>
        )}
      </SlideContainer>
    </Container>
  );
};
