import { useIntl } from 'react-intl';
import { UseSpringProps, animated, useSpring } from '@react-spring/web';

type Props = {
  value: number;
  animationProps?: UseSpringProps;
};

export const AnimatedNumber = ({ value }: Props) => {
  const { formatNumber } = useIntl();
  const animatedValue = useSpring({
    value,
  });

  return (
    <animated.span>
      {animatedValue.value.to(x =>
        formatNumber(x, {
          maximumFractionDigits: 0,
        })
      )}
    </animated.span>
  );
};
