import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Currency } from '__generated__/globalTypes';
import useMonetaryAmount from '@core/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import { TransactionAmountWithConversion } from '../../common/TransactionAmountWithConversion';
import { TransactionEntry, messages } from '../../common/TransactionEntry';
import AccountEntryState from '../AccountEntryState';
import { AccountEntry_userAccountEntry } from './__generated__/index.graphql';

type Props = {
  title: string | ReactNode;
  userAccountEntry: AccountEntry_userAccountEntry;
  children?: ReactNode;
  tooltip?: ReactNode;
  icon?: ReactNode;
  expandable?: boolean;
  primaryCurrency?: Currency;
};

const PriceContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: baseline;
`;

export { messages };

export const AccountEntry = ({
  title,
  userAccountEntry,
  children,
  tooltip,
  icon,
  expandable,
  primaryCurrency,
}: Props) => {
  const { amounts } = userAccountEntry;
  const { toMonetaryAmount } = useMonetaryAmount();
  const monetaryOutput = toMonetaryAmount(amounts);
  const monetaryOutputIsPositive = monetaryOutput.eur > 0;

  return (
    <TransactionEntry
      date={userAccountEntry.date}
      expandable={expandable}
      amount={
        <PriceContainer>
          {tooltip}
          <TransactionAmountWithConversion
            monetaryAmount={amounts}
            primaryCurrency={primaryCurrency}
            aasmState={userAccountEntry.aasmState}
            positive={monetaryOutputIsPositive}
          />
        </PriceContainer>
      }
      state={<AccountEntryState userAccountEntry={userAccountEntry} />}
      title={title}
      icon={icon}
    >
      {children}
    </TransactionEntry>
  );
};

AccountEntry.fragments = {
  userAccountEntry: gql`
    fragment AccountEntry_userAccountEntry on UserAccountEntry {
      id
      aasmState
      amounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      date
      ...AccountEntryState_userAccountEntry
    }
    ${monetaryAmountFragment}
    ${AccountEntryState.fragments.userAccountEntry}
  ` as TypedDocumentNode<AccountEntry_userAccountEntry>,
};
