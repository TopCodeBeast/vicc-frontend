import { useIntl } from 'react-intl';

import { PrizeDumb } from '@core/components/landing/PrizesBlock/PrizeDumb';
import { messages } from '@core/components/landing/PrizesBlock/messages';

import ethImage from './assets/ethImage.jpg';

type Props = {
  isHovered?: boolean;
};

export const GlobalEthPrize = ({ isHovered }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <PrizeDumb
      title={formatMessage({
        id: 'Landing.Prizes.eth',
        defaultMessage: 'ETH rewards available on sorare',
      })}
      subtitle={formatMessage({
        id: 'Landing.Prizes.ethSub',
        defaultMessage: 'ETH',
      })}
      isHovered={isHovered}
      cta={formatMessage(messages.learnCTA)}
      bgImage={ethImage}
      link="https://medium.com/vicc/eth-rewards-are-coming-to-sorare-mlb-55602872190d"
    />
  );
};
