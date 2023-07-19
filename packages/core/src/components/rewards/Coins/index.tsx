import classNames from 'classnames';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { keyframes } from 'styled-components';

import { FRONTEND_ASSET_HOST } from '@core/constants/assets';

const amountAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(0);
  }
  to {
    opacity: 1;
    transform: translateY(-10%);
  }
`;
const Root = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--intermediate-unit);
  aspect-ratio: var(--card-aspect-ratio);
  background: center / cover no-repeat
    url(${FRONTEND_ASSET_HOST}/animations/coin_reveal_placeholder.png);
  overflow: hidden;
`;
const Video = styled.video`
  position: absolute;
  inset: 0;
  /* This prevents Safari from resizing the video after its start */
  height: 100%;
`;
const AmountSVG = styled.svg`
  opacity: 0;
  &.animate {
    animation: 0.2s ease-out 2.4s forwards ${amountAnimation};
  }
`;
const Amount = styled.text`
  font-style: italic;
  fill: var(--c-static-neutral-100);
`;

type Props = { video?: boolean; amount: number };
const Coins = ({ video, amount }: Props) => {
  const [videoStarted, setVideoStarted] = useState<boolean>(false);
  const { formatNumber } = useIntl();

  const onCanPlayThrough = () => {
    setVideoStarted(true);
  };

  return (
    <Root>
      {video && (
        <Video playsInline muted autoPlay onCanPlayThrough={onCanPlayThrough}>
          <source src={`${FRONTEND_ASSET_HOST}/animations/coin_reveal.mp4`} />
        </Video>
      )}
      <AmountSVG
        viewBox="0 0 150 20"
        className={classNames({ animate: videoStarted })}
      >
        <Amount x={75} y={20} textAnchor="middle">
          <FormattedMessage
            id="Rewards.Coins.Title"
            defaultMessage="+{coins} COINS"
            values={{ coins: formatNumber(amount) }}
          />
        </Amount>
      </AmountSVG>
    </Root>
  );
};

export default Coins;
