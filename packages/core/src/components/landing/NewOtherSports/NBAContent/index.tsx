import { defineMessage, useIntl } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { DumbContent } from '@core/components/landing/NewOtherSports/DumbContent';
import { sportsLabelsMessages } from '@core/lib/glossary';

import towns from './assets/towns.jpg';

const message = defineMessage({
  id: 'Landing.NewOtherSports.nba',
  defaultMessage: 'Featuring all 30 NBA officially licensed teams',
});

export const nbaCards = [
  'https://assets.sorare.com/card/859a7866-0739-40b1-95f2-57d40e2f7908/picture/tinified-799281b115f7fd43e3163d02356b3f22.png',
  'https://assets.sorare.com/card/72214ef6-c187-4e4d-a95e-f5048a820196/picture/tinified-d2a10c9272a4614b173f6100aa50dbf0.png',
  'https://assets.sorare.com/card/bed4dc14-9966-4c97-8c5b-5eb71908fead/picture/tinified-cda6d7df77d5eee5bd4d1bb1f4b1bcd3.png',
  'https://assets.sorare.com/card/90497564-0fc7-408b-872a-8580e78df98a/picture/tinified-818f8f06da47268e470d8763a206a2c3.png',
  'https://assets.sorare.com/cardsamplepicture/6b23dd4c-4bca-408d-bbea-427e9b5bc0ef/picture/tinified-1ab02ccc886c3d32d1e67c02fda7ab0e.png',
];

export const NBAContent = () => {
  const { formatMessage } = useIntl();

  return (
    <DumbContent
      bgImage={towns}
      sport={Sport.NBA}
      cardsUrls={nbaCards}
      text={formatMessage(message)}
      title={formatMessage(sportsLabelsMessages[Sport.NBA])}
    />
  );
};
