import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Currency,
  Fiat,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';

import PaymentBoxAmountWithConversion from '../../AmountWithConversion';
import { ConversionCreditRow } from '../../ConversionCreditRow';
import { AccountingLine, Row } from '../ui';

type Props = {
  currency: Currency;
  totalWeiAmount: string;
  totalFiatAmount?: Fiat;
  usingConversionCredit: boolean;
  sport: Sport;
  customAmountDisplay?: ReactNode;
};

export const SummaryTableTotal = ({
  sport,
  currency,
  customAmountDisplay,
  totalWeiAmount,
  totalFiatAmount,
  usingConversionCredit,
}: Props) => {
  return (
    <>
      {usingConversionCredit && (
        <Row>
          <AccountingLine>
            <ConversionCreditRow sport={sport} currencyFirst={currency} />
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
              amount={totalWeiAmount}
              amountInFiat={totalFiatAmount}
              currencyFirst={currency}
              unit="wei"
              context="SummaryTable — Subtotal"
              bold
            />
          )}
        </AccountingLine>
        {usingConversionCredit && (
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="SummaryTable.conversionCreditHelperGeneral"
              defaultMessage="A card bought using a conversion credit can’t be listed for sale for {unlistableDuration} days."
              values={{ unlistableDuration: 7 }}
            />
          </Text14>
        )}
      </Row>
    </>
  );
};
