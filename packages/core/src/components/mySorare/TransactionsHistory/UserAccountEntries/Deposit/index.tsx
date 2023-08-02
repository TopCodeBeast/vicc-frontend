import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowDownLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Currency, UserAccountEntryEntry } from '__generated__/globalTypes';
import { glossary } from '@core/lib/glossary';

import { AccountEntry } from '../AccountEntry';
import { Deposit_userAccountEntry } from './__generated__/index.graphql';

const DepositIcon = styled(FontAwesomeIcon)`
  width: var(--double-unit);
  height: var(--double-unit);
  border-radius: 50%;
  align-self: center;
  background-color: transparent;
  border: 1px solid var(--c-green-600);
  color: var(--c-green-600);
  padding: var(--unit);
`;

type Props = {
  userAccountEntry: Deposit_userAccountEntry;
  withIcon?: boolean;
  expandable?: boolean;
  primaryCurrency: Currency;
};

export const Deposit = ({
  userAccountEntry,
  withIcon = false,
  expandable,
  primaryCurrency,
}: Props) => {
  const { formatMessage } = useIntl();

  if (userAccountEntry.entryType !== UserAccountEntryEntry.DEPOSIT) return null;

  return (
    <AccountEntry
      userAccountEntry={userAccountEntry}
      title={formatMessage(glossary.deposit)}
      expandable={expandable}
      icon={withIcon ? <DepositIcon icon={faArrowDownLeft} /> : undefined}
      primaryCurrency={primaryCurrency}
    />
  );
};

Deposit.fragments = {
  userAccountEntry: gql`
    fragment Deposit_userAccountEntry on UserAccountEntry {
      id
      entryType
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
  ` as TypedDocumentNode<Deposit_userAccountEntry>,
};
