import { TypedDocumentNode, gql } from '@apollo/client';
import { faBuildingColumns } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16 } from '@core/atoms/typography';
import { isType } from 'gql';

import { getAccountIdentifier } from '../utils';
import { BankAccount_bankAccount } from './__generated__/index.graphql';

const BankIcon = styled.div`
  width: calc(5 * var(--unit));
  height: var(--quadruple-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--half-unit);
  background-color: var(--c-neutral-300);
  border: 1px solid var(--c-neutral-200);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

type Props = {
  bankAccount: BankAccount_bankAccount;
};

export const BankAccount = ({ bankAccount }: Props) => {
  const accountIdentifier = getAccountIdentifier(bankAccount);

  const accountIdentifierBeautified = isType(bankAccount, 'IbanBankAccount')
    ? `${accountIdentifier.slice(0, 4)} •••• ${accountIdentifier.slice(-3)}`
    : `•••• ${accountIdentifier.slice(-4)}`;

  return (
    <Row>
      <BankIcon>
        <FontAwesomeIcon size="lg" icon={faBuildingColumns} />
      </BankIcon>
      <div>
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Withdraw.WithdrawFiat.bankAccount"
            defaultMessage="Bank account"
          />
        </Text16>
        <Text14 color="var(--c-neutral-700)">
          {accountIdentifierBeautified}
        </Text14>
      </div>
    </Row>
  );
};

BankAccount.fragments = {
  bankAccount: gql`
    fragment BankAccount_bankAccount on BankAccount {
      ... on CaBankAccount {
        id
        accountNumber
      }
      ... on UsBankAccount {
        id
        accountNumber
      }
      ... on OtherBankAccount {
        id
        accountNumber
      }
      ... on GbBankAccount {
        id
        accountNumber
      }
      ... on IbanBankAccount {
        id
        iban
      }
      ...getAccountIdentifier_bankAccount
    }
    ${getAccountIdentifier.fragments.bankAccount}
  ` as TypedDocumentNode<BankAccount_bankAccount>,
};
