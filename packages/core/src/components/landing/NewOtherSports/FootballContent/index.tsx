import { defineMessage, useIntl } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { DumbContent } from '@core/components/landing/NewOtherSports/DumbContent';
import { sportsLabelsMessages } from '@core/lib/glossary';

import messi from './assets/messi.jpg';

const message = defineMessage({
  id: 'Landing.NewOtherSports.football',
  defaultMessage: 'Featuring over 300 officially licensed soccer clubs',
});

export const footballCards = [
  'https://assets.sorare.com/cardsamplepicture/b1949da6-92de-4b9e-b332-6248b35a1993/picture/tinified-4c0146ed255e47f1c48001b91aaac8ac.png',
  'https://assets.sorare.com/card/84076883-23fb-47f5-ad7d-367a6be78334/picture/tinified-0245fdc9be440231ad6b5419fd8ab174.png',
  'https://assets.sorare.com/card/40a8cda0-2faa-4bbf-b18c-b2e77f192a5a/picture/tinified-193ca1a32231410a05f61c9aed20f467.png',
  'https://assets.sorare.com/card/3795405a-cdac-4ced-8a71-28ef79f9a97b/picture/tinified-e1d12f10ffc65728a3a2f07684265897.png',
  'https://assets.sorare.com/card/ec61f6d8-f92d-4a68-b7e5-81601c067be1/picture/tinified-bdbb9829abfde19f63b5e8f55ff844f7.png',
];

export const FootballContent = () => {
  const { formatMessage } = useIntl();

  return (
    <DumbContent
      bgImage={messi}
      sport={Sport.FOOTBALL}
      cardsUrls={footballCards}
      text={formatMessage(message)}
      title={formatMessage(sportsLabelsMessages[Sport.FOOTBALL])}
    />
  );
};
