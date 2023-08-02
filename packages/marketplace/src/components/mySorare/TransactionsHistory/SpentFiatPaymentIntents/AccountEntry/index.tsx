import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';

import { Title6 } from '@sorare/core/src/atoms/typography';
import {
  TransactionEntry,
  messages,
} from '@sorare/core/src/components/mySorare/TransactionsHistory/common/TransactionEntry';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

import { RequestReceipt } from '../RequestReceipt';
import { AccountEntry_payment } from './__generated__/index.graphql';

export { messages };

type Props = {
  title: string | ReactNode;
  payment: AccountEntry_payment;
  children: ReactNode;
};

export const AccountEntry = ({ title, payment, children }: Props) => {
  const { formatNumber } = useIntlContext();

  if (!payment.fiatAmount || !payment.fiatCurrency) return null;

  return (
    <TransactionEntry
      date={payment.spentAt}
      amount={
        <Title6 color="var(--c-neutral-1000)">
          {formatNumber(-payment.fiatAmount / 100, {
            style: 'currency',
            currency: payment.fiatCurrency,
          })}
        </Title6>
      }
      action={<RequestReceipt payment={payment} />}
      title={title}
    >
      {children}
    </TransactionEntry>
  );
};

AccountEntry.fragments = {
  payment: gql`
    fragment AccountEntry_payment on Payment {
      id
      spentAt
      fiatAmount
      fiatCurrency
      aasmState
      ...RequestReceipt_payment
    }
    ${RequestReceipt.fragments.payment}
  ` as TypedDocumentNode<AccountEntry_payment>,
};
