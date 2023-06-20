import { MessageDescriptor, defineMessages } from 'react-intl';

import { CardCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';

interface Props {
  status: CardCoverageStatus | undefined;
  customMessage: MessageDescriptor | undefined;
}

export const getCardCoverage = ({ status, customMessage }: Props) => {
  const isCollectible = status === 'SPECIAL';
  const isNotCovered = status === 'NOT_COVERED';
  const isLegend = customMessage && status === 'LEGEND';
  const isPartiallyCovered = status === 'PARTIAL';

  return {
    isNotCovered,
    isLegend,
    isPartiallyCovered,
    isCollectible,
  };
};

export const messages = defineMessages({
  notCovered: {
    id: 'cardCoverage.notCovered',
    defaultMessage:
      'This player is in a Team not covered by SO5. His points will not be scored.',
  },
  notCoveredBundle: {
    id: 'cardCoverage.notCoveredBundle',
    defaultMessage:
      'Players in this bundle are in teams not covered by SO5. Their points will not be scored.',
  },
  notEligible: {
    id: 'cardCoverage.notEligible',
    defaultMessage: 'This Card is not eligible for the So5 game',
  },
  legend: {
    id: 'cardCoverage.legend',
    defaultMessage:
      'This player is not covered in So5 except for special occasions.',
  },
  partial: {
    id: 'cardCoverage.partial',
    defaultMessage:
      'This player is in a club covered only in specific tournaments. His points will not be scored for his domestic league.',
  },
  partialBundle: {
    id: 'cardCoverage.partialBundle',
    defaultMessage:
      'Players in this bundle are in teams covered only in specific tournaments. Points will not be scored for domestic leagues.',
  },
  collectible: {
    id: 'cardCoverage.collectible',
    defaultMessage:
      'This is a special edition collectible-only Card. It cannot be used in the Sorare Fantasy game.',
  },
});
