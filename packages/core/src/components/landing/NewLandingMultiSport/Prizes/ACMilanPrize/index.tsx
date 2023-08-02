import { useIntl } from 'react-intl';

import { PrizeDumb } from '@core/components/landing/PrizesBlock/PrizeDumb';
import { messages } from '@core/components/landing/PrizesBlock/messages';

import travelImage from './assets/travelImage.jpg';

type Props = {
  isHovered?: boolean;
};

export const ACMilanPrize = ({ isHovered }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <PrizeDumb
      title={formatMessage({
        id: 'Landing.Prizes.fly',
        defaultMessage: 'Fly with AC MILAN',
      })}
      subtitle={formatMessage(messages.lifetime)}
      cta={formatMessage(messages.watchCTA)}
      bgImage={travelImage}
      isHovered={isHovered}
      link="https://www.youtube.com/watch?v=mBIS0sfXMIw"
    />
  );
};
