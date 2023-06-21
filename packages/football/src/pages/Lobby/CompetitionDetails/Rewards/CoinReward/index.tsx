import { useIntl } from 'react-intl';

import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Text16 } from '@sorare/core/src/atoms/typography';

import { RewardRow } from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

type Props = { coins: number };
const CoinReward = ({ coins }: Props) => {
  const { formatNumber } = useIntl();
  return (
    <RewardRow>
      <Coin />
      <Text16 bold>{formatNumber(coins)}</Text16>
    </RewardRow>
  );
};

export default CoinReward;
