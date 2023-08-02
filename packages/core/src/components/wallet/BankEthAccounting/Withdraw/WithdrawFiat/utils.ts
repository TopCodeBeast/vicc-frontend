import { TypedDocumentNode, gql } from '@apollo/client';

import { isType, withFragments } from 'gql';

import { getAccountIdentifier_bankAccount } from './__generated__/utils.graphql';

export const getAccountIdentifier = withFragments(
  (bankAccount: getAccountIdentifier_bankAccount) => {
    if (
      isType(bankAccount, 'CaBankAccount') ||
      isType(bankAccount, 'UsBankAccount') ||
      isType(bankAccount, 'OtherBankAccount')
    ) {
      return bankAccount.accountNumber;
    }
    if (isType(bankAccount, 'IbanBankAccount')) {
      return bankAccount.iban;
    }
    return '';
  },
  {
    bankAccount: gql`
      fragment getAccountIdentifier_bankAccount on BankAccount {
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
        ... on IbanBankAccount {
          id
          iban
        }
      }
    ` as TypedDocumentNode<getAccountIdentifier_bankAccount>,
  }
);
