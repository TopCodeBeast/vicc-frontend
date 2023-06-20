import { gql } from '@apollo/client';
import { defineMessage, defineMessages } from 'react-intl';

import { CardCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import createLink from '@sorare/core/src/atoms/typography/Link';
import { FAQ } from '@sorare/core/src/constants/routes';
import Warning from '@sorare/core/src/contexts/intl/Warning';

import { messages } from 'lib/cardCoverage';

import { CardPage_ItemEligibility_card } from './__generated__/index.graphql';

type Props = {
  card: CardPage_ItemEligibility_card;
};

export const title = defineMessage({
  id: 'CardPage.ItemEligibility.WarningTitle',
  defaultMessage: 'Note about the scoring',
});

export const descriptionMessages = defineMessages({
  legend: {
    id: 'CardPage.ItemEligibility.legend',
    defaultMessage:
      'In a given Game Week, Legends take the score of the best scoring player in the team and position on their Card. For more info, <link>read our FAQ.</link>',
  },
  partial: {
    id: 'CardPage.ItemEligibility.partial',
    defaultMessage:
      'This player is only eligible for the following {competitionsCount, plural, one {competition} other {competitions}}: <b>{competitions}</b>',
  },
});

export const ItemEligibility = ({ card }: Props) => {
  const { coverageStatus } = card;

  if (coverageStatus === CardCoverageStatus.FULL) return null;

  const partialCoverage = [
    CardCoverageStatus.LEGEND,
    CardCoverageStatus.PARTIAL,
  ].includes(coverageStatus);
  const variant = partialCoverage ? 'blue' : undefined;

  if (coverageStatus === CardCoverageStatus.NOT_ELIGIBLE) {
    return (
      <Warning variant={variant} title={title} message={messages.notEligible} />
    );
  }

  if (coverageStatus === CardCoverageStatus.LEGEND) {
    return (
      <Warning
        variant={variant}
        title={title}
        message={descriptionMessages.legend}
        values={{ link: createLink(FAQ) }}
      />
    );
  }

  if (coverageStatus === CardCoverageStatus.PARTIAL) {
    return (
      <Warning
        variant={variant}
        title={title}
        message={descriptionMessages.partial}
        values={{
          b: Bold,
          competitionsCount: card.openForGameStatsCompetitions.length,
          competitions: card.openForGameStatsCompetitions
            .map(c => c.name)
            .join(', '),
        }}
      />
    );
  }

  if (coverageStatus === CardCoverageStatus.SPECIAL) {
    return (
      <Warning variant={variant} title={title} message={messages.collectible} />
    );
  }

  if (coverageStatus === CardCoverageStatus.NOT_COVERED) {
    return (
      <Warning variant={variant} title={title} message={messages.notCovered} />
    );
  }

  return null;
};

ItemEligibility.fragments = {
  card: gql`
    fragment CardPage_ItemEligibility_card on Card {
      slug
      assetId
      coverageStatus
      openForGameStatsCompetitions {
        slug
        name
      }
    }
  `,
};

export default ItemEligibility;
