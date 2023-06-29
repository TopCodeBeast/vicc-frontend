import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Currency, SupportedCurrency } from '__generated__/globalTypes';

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
  ethFirst?: boolean;
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
  ethFirst = true,
}: Props) => {
  return (
    <TransactionEntry
      date={userAccountEntry.date}
      expandable={expandable}
      amount={
        <PriceContainer>
          {tooltip}
          <TransactionAmountWithConversion
            monetaryAmount={{
              referenceCurrency: SupportedCurrency.WEI,
              [SupportedCurrency.WEI.toLowerCase()]: userAccountEntry.amount,
              ...userAccountEntry.amountInFiat,
            }}
            usingLegacyFiat
            primaryCurrency={ethFirst ? Currency.ETH : undefined}
            aasmState={userAccountEntry.aasmState}
            positive={Number(userAccountEntry.amount) > 0}
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
      amount
      amountInFiat {
        eur
        usd
        gbp
      }
      date
      ...AccountEntryState_userAccountEntry
    }
    ${AccountEntryState.fragments.userAccountEntry}
  `,
};
