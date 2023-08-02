import { useIntl } from 'react-intl';

import CardBack from '@core/components/card/Back/Football';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';

export const BackCoinReward = () => {
  const { formatMessage } = useIntl();

  return (
    <CardBack
      aria-label={formatMessage({
        id: 'Rewards.CoinReward',
        defaultMessage: 'Coin reward',
      })}
      path={`${FRONTEND_ASSET_HOST}/cards/back/coin.png`}
      radius="10px"
    />
  );
};
