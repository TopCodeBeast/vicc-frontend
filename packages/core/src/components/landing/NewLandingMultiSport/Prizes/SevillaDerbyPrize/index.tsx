import { useIntl } from 'react-intl';

import { PrizeDumb } from '@core/components/landing/PrizesBlock/PrizeDumb';
import { messages } from '@core/components/landing/PrizesBlock/messages';

import sevillaImage from './assets/sevillaImage.jpg';

type Props = {
  isHovered?: boolean;
};

export const SevillaDerbyPrize = ({ isHovered }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <PrizeDumb
      title={formatMessage({
        id: 'Landing.Prizes.sevilla',
        defaultMessage: 'Sevilla Derby VIP Experience',
      })}
      subtitle={formatMessage(messages.lifetime)}
      cta={formatMessage(messages.watchCTA)}
      bgImage={sevillaImage}
      isHovered={isHovered}
      link="https://www.youtube.com/watch?v=_HSLtDIP3BU"
    />
  );
};
