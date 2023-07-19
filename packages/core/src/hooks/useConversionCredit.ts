import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { useMemo } from 'react';

import {
  ConversionCredit,
  ConversionCreditStatus,
  MonetaryAmount,
  Sport,
} from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useMonetaryAmount from '@core/hooks/useMonetaryAmount';

type SportConversionCredit = ConversionCredit & {
  sport: Sport;
  maxDiscount: MonetaryAmount & {
    eur: number;
    usd: number;
    gbp: number;
    wei: string;
  };
};

export const useConversionCredit = (
  sport?: Sport
): SportConversionCredit | undefined => {
  const currentUser: any = undefined;// const { currentUser } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();

  const conversionCredit = useMemo(() => {
    if (!sport) return undefined;

    const sportConversionCredit = {
      [Sport.FOOTBALL]: currentUser?.footballConversionCredit,
      [Sport.NBA]: currentUser?.nbaConversionCredit,
      [Sport.BASEBALL]: currentUser?.baseballConversionCredit,
    }[sport];

    if (
      !sportConversionCredit?.sport ||
      ![
        ConversionCreditStatus.CLAIMED,
        // ConversionCreditStatus.RECLAIMED,
        ConversionCreditStatus.CREATED,
      ].includes(sportConversionCredit.status) ||
      isPast(parseISO(sportConversionCredit.endDate))
    ) {
      return undefined;
    }

    const amounts =
      sportConversionCredit &&
      toMonetaryAmount(sportConversionCredit.maxDiscount);

    return (
      sportConversionCredit && {
        ...sportConversionCredit,
        maxDiscount: amounts,
      }
    );
  }, [
    currentUser?.baseballConversionCredit,
    currentUser?.footballConversionCredit,
    currentUser?.nbaConversionCredit,
    sport,
    toMonetaryAmount,
  ]);

  return conversionCredit as SportConversionCredit;
};

// const conversionCreditFragment = gql`
//   fragment useConversionCredit_conversionCredit on ConversionCredit {
//     id
//     endDate
//     maxDiscount {
//       referenceCurrency
//       eur
//       gbp
//       usd
//       wei
//     }
//     percentageDiscount
//     status
//     sport
//   }
// `;

// useConversionCredit.fragments = {
//   currentUser: gql`
//     fragment useConversionCredit_currentUser on CurrentUser {
//       slug
//       footballConversionCredit: sportConversionCredit(sport: FOOTBALL) {
//         ...useConversionCredit_conversionCredit
//       }
//       nbaConversionCredit: sportConversionCredit(sport: NBA) {
//         ...useConversionCredit_conversionCredit
//       }
//       baseballConversionCredit: sportConversionCredit(sport: BASEBALL) {
//         ...useConversionCredit_conversionCredit
//       }
//     }
//     ${conversionCreditFragment}
//   `,
// };
