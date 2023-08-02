import classNames from 'classnames';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import styled, { keyframes } from 'styled-components';

import { MonetaryAmount } from '__generated__/globalTypes';
import discountVideo from '@core/assets/rewards/discount-animation.mp4';
import discountCardFrontWithToken from '@core/assets/rewards/discount-card-front-with-token.png';
import Shine from '@core/atoms/ui/Shine';
import useDelayedValue from '@core/hooks/state/useDelayedValue';
import useAmountWithConversion from '@core/hooks/useAmountWithConversion';

const animationDelays = {
  // wait for video to start first frames
  percent: 800,
  limit: 2400,
  shine: 2800,
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--intermediate-unit);
  aspect-ratio: var(--card-aspect-ratio);
  background: center / cover no-repeat url(${discountCardFrontWithToken});
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  /* This prevents Safari from resizing the video after its start */
  height: 100%;
`;

const Percent = styled(animated.text)`
  fill: #fecd11;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: Druk Wide;
  font-size: 64px;
`;

const StyledShine = styled(Shine)`
  width: 100%;
`;

const limitAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(30%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
`;

const Limit = styled.text`
  fill: var(--c-static-neutral-100);
  font-family: Druk Wide;
  font-size: 20px;
  opacity: 0;
  text-transform: uppercase;
  &.animate {
    animation: 300ms cubic-bezier(0, 0.7, 0.3, 1) ${animationDelays.limit}ms
      forwards ${limitAnimation};
  }
`;

type Props = {
  readyToShow: boolean;
  percentage: number;
  maxDiscount: MonetaryAmount;
};

export const Discount = ({ readyToShow, percentage, maxDiscount }: Props) => {
  const [videoStarted, setVideoStarted] = useState<boolean>(false);
  const delayedVideoStarted = useDelayedValue(
    videoStarted,
    animationDelays.shine
  );

  const { formatNumber } = useIntl();
  const [percentageValue, setPercentageValue] = useState<number>(0);

  const { main } = useAmountWithConversion({
    monetaryAmount: maxDiscount,
  });

  const animatedValue = useSpring({
    value: percentageValue,
    delay: animationDelays.percent,
    config: config.molasses,
  });

  const onCanPlayThrough = () => {
    setVideoStarted(true);
    setPercentageValue((percentage || 0) * 100);
  };

  return (
    <Wrapper>
      {readyToShow && (
        <Video playsInline muted autoPlay onCanPlayThrough={onCanPlayThrough}>
          <source src={discountVideo} />
        </Video>
      )}
      <StyledShine
        infinite={false}
        disabled={!delayedVideoStarted}
        fraction={1}
      >
        <svg viewBox="0 0 257 416">
          <Percent x={128} y={208} textAnchor="middle">
            {animatedValue.value.to(x =>
              x === 0
                ? ''
                : `${formatNumber(x, {
                    maximumFractionDigits: 0,
                  })}%`
            )}
          </Percent>
          <Limit
            x={128}
            y={240}
            textAnchor="middle"
            className={classNames({ animate: videoStarted })}
          >
            <FormattedMessage
              id="Discount.limit"
              defaultMessage="Up to {limit}"
              values={{
                limit: maxDiscount ? main : 0,
              }}
            />
          </Limit>
        </svg>
      </StyledShine>
    </Wrapper>
  );
};
