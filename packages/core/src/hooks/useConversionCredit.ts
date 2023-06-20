import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';

import {
  ConversionCredit,
  ConversionCreditStatus,
  Sport,
} from '__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';

type SportConversionCredit = ConversionCredit & {
  sport: Sport;
  maxDiscount: {
    eur: number;
    usd: number;
    gbp: number;
    wei: string;
  };
};

export const useConversionCredit = (
  sport?: Sport
): SportConversionCredit | undefined => {
  const { currentUser } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();

  if (!sport) return undefined;

  const sportConversionCredit = {
    [Sport.FOOTBALL]: currentUser?.footballConversionCredit,
    [Sport.NBA]: currentUser?.nbaConversionCredit,
    [Sport.BASEBALL]: currentUser?.baseballConversionCredit,
  }[sport];

  if (
    !sportConversionCredit?.sport ||
    ![ConversionCreditStatus.CLAIMED, ConversionCreditStatus.CREATED].includes(
      sportConversionCredit.status
    ) ||
    isPast(parseISO(sportConversionCredit.endDate))
  ) {
    return undefined;
  }

  const amounts =
    sportConversionCredit &&
    toMonetaryAmount(sportConversionCredit.maxDiscount);

  const conversionCredit = sportConversionCredit && {
    ...sportConversionCredit,
    maxDiscount: amounts && {
      eur: amounts.eur / 100,
      usd: amounts.usd / 100,
      gbp: amounts.gbp / 100,
      wei: amounts.wei,
    },
  };

  return conversionCredit as SportConversionCredit;
};

const conversionCreditFragment = gql`
  fragment useConversionCredit_conversionCredit on ConversionCredit {
    id
    endDate
    maxDiscount {
      referenceCurrency
      eur
      gbp
      usd
      wei
    }
    percentageDiscount
    status
    sport
  }
`;

useConversionCredit.fragments = {
  currentUser: gql`
    fragment useConversionCredit_currentUser on CurrentUser {
      slug
      footballConversionCredit: sportConversionCredit(sport: FOOTBALL) {
        ...useConversionCredit_conversionCredit
      }
      nbaConversionCredit: sportConversionCredit(sport: NBA) {
        ...useConversionCredit_conversionCredit
      }
      baseballConversionCredit: sportConversionCredit(sport: BASEBALL) {
        ...useConversionCredit_conversionCredit
      }
    }
    ${conversionCreditFragment}
  `,
};
