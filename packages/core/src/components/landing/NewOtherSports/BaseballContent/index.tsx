import { defineMessage, useIntl } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { DumbContent } from '@core/components/landing/NewOtherSports/DumbContent';
import { sportsLabelsMessages } from '@core/lib/glossary';

import soto from './assets/soto.jpg';

const message = defineMessage({
  id: 'Landing.NewOtherSports.mlb',
  defaultMessage: 'Featuring all 30 MLB officially licensed clubs',
});

export const baseballCards = [
  'https://assets.sorare.com/card/599e4fb9-3f68-47bc-b0b4-60b6eac4b030/picture/tinified-03317a63fc0865f42ae2c64247928e04.png',
  'https://assets.sorare.com/card/e9886937-f925-4dde-b4d6-186802bdfd3f/picture/tinified-64658a0ac6589af783ee94d9b60505af.png',
  'https://assets.sorare.com/card/bacee0f7-69c6-4d9b-a7d5-bcbf2e07364b/picture/tinified-858b64196f5978044344b0e5002edf69.png',
  'https://assets.sorare.com/cardsamplepicture/5044d71b-279e-4fb2-8164-8a2904d08951/picture/tinified-d7479c01488df798912a45f85704c8f0.png',
  'https://assets.sorare.com/card/f054329c-f357-4c1d-a598-904b3d7e22d3/picture/tinified-dd1ac65e07f9fd1ca7a46f1cc0d91f78.png',
];

export const BaseballContent = () => {
  const { formatMessage } = useIntl();

  return (
    <DumbContent
      bgImage={soto}
      sport={Sport.BASEBALL}
      cardsUrls={baseballCards}
      text={formatMessage(message)}
      title={formatMessage(sportsLabelsMessages[Sport.BASEBALL])}
    />
  );
};
