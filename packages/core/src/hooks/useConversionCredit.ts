import { TypedDocumentNode, gql } from '@apollo/client';
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
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import {
  useConversionCredit_conversionCredit,
  useConversionCredit_currentUser,
} from './__generated__/useConversionCredit.graphql';

export type ConversionCreditWithAmounts = ConversionCredit & {
  maxDiscount: MonetaryAmount & {
    eur: number;
    usd: number;
    gbp: number;
    wei: string;
  };
};

export const useConversionCredit = (
  sport?: Sport
): ConversionCreditWithAmounts | undefined => {
  const { currentUser } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();

  const conversionCredit = useMemo(() => {
    if (!sport) return undefined;

    const sportConversionCredit = {
      [Sport.FOOTBALL]: currentUser?.footballConversionCredit,
      [Sport.NBA]: currentUser?.nbaConversionCredit,
      [Sport.BASEBALL]: currentUser?.baseballConversionCredit,
    }[sport];

    if (
      !sportConversionCredit ||
      ![
        ConversionCreditStatus.CLAIMED,
        ConversionCreditStatus.RECLAIMED,
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

  return conversionCredit as ConversionCreditWithAmounts;
};

export const conversionCreditFragment = gql`
  fragment useConversionCredit_conversionCredit on ConversionCredit {
    id
    endDate
    maxDiscount {
      ...MonetaryAmountFragment_monetaryAmount
    }
    percentageDiscount
    status
    sport
  }
  ${monetaryAmountFragment}
` as TypedDocumentNode<useConversionCredit_conversionCredit>;

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
  ` as TypedDocumentNode<useConversionCredit_currentUser>,
};
