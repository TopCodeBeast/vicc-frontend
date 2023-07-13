import { RefObject } from 'react';
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface PropsWithRef extends Props {
  sliderRef?: RefObject<Slider>;
}

export interface Props {
  children: (JSX.Element | null)[];
  settings?: Settings;
  className?: string;
}

const Carousel = ({ children, settings, sliderRef, ...rest }: PropsWithRef) => {
  return (
    <Slider {...settings} ref={sliderRef} {...rest}>
      {children}
    </Slider>
  );
};

export default Carousel;
