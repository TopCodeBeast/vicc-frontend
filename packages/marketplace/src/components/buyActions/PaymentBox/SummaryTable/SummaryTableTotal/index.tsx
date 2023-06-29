import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Currency,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';

import { PaymentBoxAmountWithConversion } from '../../AmountWithConversion';
import { ConversionCreditRow } from '../../ConversionCreditRow';
import { AccountingLine, Row } from '../ui';

type Props = {
  totalMonetaryAmount: MonetaryAmountOutput;
  conversionCreditMonetaryAmount?: MonetaryAmountOutput;
  usingConversionCredit: boolean;
  sport: Sport;
  customAmountDisplay?: ReactNode;
  canChangeRefCurrency?: boolean;
  isFiat?: boolean;
  currency?: Currency;
};

export const SummaryTableTotal = ({
  sport,
  customAmountDisplay,
  totalMonetaryAmount,
  usingConversionCredit,
  canChangeRefCurrency = false,
  isFiat = false,
  currency = undefined,
  conversionCreditMonetaryAmount,
}: Props) => {
  const {
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();
  return (
    <>
      {usingConversionCredit && conversionCreditMonetaryAmount && (
        <Row>
          <AccountingLine>
            <ConversionCreditRow
              sport={sport}
              canChangeRefCurrency={canChangeRefCurrency}
              currency={currency}
              isFiat={isFiat}
              usingConversionCredit={usingConversionCredit}
              conversionCreditMonetaryAmount={conversionCreditMonetaryAmount}
            />
          </AccountingLine>
        </Row>
      )}
      <Row>
        <AccountingLine>
          <Text16 bold color="var(--c-neutral-1000)">
            <FormattedMessage
              id="SummaryTable.total"
              defaultMessage="Order total"
            />
          </Text16>
          {customAmountDisplay || (
            <PaymentBoxAmountWithConversion
              monetaryAmount={{
                referenceCurrency: SupportedCurrency.WEI,
                ...totalMonetaryAmount,
              }}
              bold
              hideExponent={canChangeRefCurrency || onlyShowFiatCurrency}
              {...(currency ? { primaryCurrency: currency } : {})}
              {...(canChangeRefCurrency && {
                primaryCurrency: isFiat ? Currency.FIAT : Currency.ETH,
              })}
            />
          )}
        </AccountingLine>
        {usingConversionCredit && (
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="SummaryTable.conversionCreditHelperGeneral"
              defaultMessage="A card bought using a credit can’t be listed for sale for {unlistableDuration} days."
              values={{ unlistableDuration: 14 }}
            />
          </Text14>
        )}
      </Row>
    </>
  );
};
