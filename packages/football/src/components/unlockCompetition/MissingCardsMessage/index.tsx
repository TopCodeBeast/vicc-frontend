import { gql } from '@apollo/client';
import { FormattedList, FormattedMessage, useIntl } from 'react-intl';

import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { getMissingCards } from '@football/components/unlockCompetition/getMissingCards';

import { MissingCardsMessage_validity } from './__generated__/index.graphql';

type Props = { validity: MissingCardsMessage_validity };

export const MissingCardsMessage = ({ validity }: Props) => {
  const { formatMessage, formatNumber } = useIntl();

  if (!validity.notEnoughEligibleCards) {
    return null;
  }

  const combinedMissingCards = getMissingCards(validity);
  if (combinedMissingCards.common > 0) {
    return (
      <FormattedMessage
        id="MissingCardsMessage.commons"
        defaultMessage="You need to draft Common Cards to play this competition"
      />
    );
  }

  const translatedRarities = Object.entries(combinedMissingCards)
    .filter(([, nb]) => nb > 0)
    .map(([rarity, nb]) => {
      return `${formatNumber(nb)} ${formatMessage(
        scarcityMessages[rarity as keyof typeof combinedMissingCards]
      )}`;
    });

  return (
    <FormattedMessage
      id="MissingCardsMessage.description"
      defaultMessage="You are missing the following {totalNb, plural, one {card} other {cards}} to play this tournament: {rarities}"
      values={{
        rarities: (
          <FormattedList type="conjunction" value={translatedRarities} />
        ),
        totalNb: validity.missingCards,
      }}
    />
  );
};

MissingCardsMessage.fragments = {
  validity: gql`
    fragment MissingCardsMessage_validity on Validity {
      notEnoughEligibleCards
      missingCards
      ...getMissingCards_validity
    }
    ${getMissingCards.fragments.validity}
  `,
};
