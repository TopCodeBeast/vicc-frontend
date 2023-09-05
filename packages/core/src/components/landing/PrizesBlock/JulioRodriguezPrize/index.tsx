import { useIntl } from 'react-intl';

import { PrizeDumb } from '@core/components/landing/PrizesBlock/PrizeDumb';
import { messages } from '@core/components/landing/PrizesBlock/messages';

import julioRodriguez from './assets/julioRodriguez.jpg';

type Props = {
  isHovered?: boolean;
};

export const JulioRodriguezPrize = ({ isHovered }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <PrizeDumb
      title={formatMessage({
        id: 'Landing.Prizes.julio',
        defaultMessage: 'Julio Rodríguez personalized video',
      })}
      isHovered={isHovered}
      subtitle={formatMessage(messages.access)}
      cta={formatMessage(messages.watchCTA)}
      bgImage={julioRodriguez}
      link="https://twitter.com/ViccMLB/status/1682027993521328132"
    />
  );
};
