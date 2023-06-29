import { gql, useMutation } from '@apollo/client';
import { FormEvent, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import Bold from '@core/atoms/typography/Bold';
import { AmountWithConversion } from '@core/components/buyActions/AmountWithConversion';
import SignTransaction from '@core/components/wallet/SignTransaction';
import { useBlockchainContext } from '@core/contexts/blockchain';
import Warning from '@core/contexts/intl/Warning';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';
import useBankWithdrawableAmount from '@core/hooks/users/useBankWithdrawableAmount';
import { glossary } from '@core/lib/glossary';

import {
  CreateEthBankWitdrawalIntentMutation,
  CreateEthBankWitdrawalIntentMutationVariables,
} from './__generated__/index.graphql';

const CREATE_ETH_BANK_WITHDRAWAL_INTENT_MUTATION = gql`
  mutation CreateEthBankWitdrawalIntentMutation(
    $input: createEthBankWithdrawalIntentInput!
  ) {
    createEthBankWithdrawalIntent(input: $input) {
      ethBankWithdrawalIntent {
        signature
        nonce
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export const messages = defineMessages({
  switchWallet: {
    id: 'WithdrawEthForm.switchWallet',
    defaultMessage:
      'Please switch your wallet to your mapped account <b>{bankMapping}</b>',
  },
  withdrawal: {
    id: 'WithdrawEthForm.withdrawal',
    defaultMessage:
      'Withdraw {amount} to your mapped account <b>{bankMapping}</b>.',
  },
});

const BlueAmountWithConversion = styled(AmountWithConversion)`
  color: var(--c-brand-600);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MappedAccount = styled.div`
  margin-bottom: 20px;
  & br {
    margin-bottom: 20px;
  }
`;

export const WithdrawEthForm = () => {
  const { withdrawFromBank } = useBlockchainContext();
  const [pending, setPending] = useState(false);
  const { showNotification } = useSnackNotificationContext();
  const accountData = useBlockchainAccountData();
  const bankWithdrawableAmount = useBankWithdrawableAmount();

  const [mutate] = useMutation<
    CreateEthBankWitdrawalIntentMutation,
    CreateEthBankWitdrawalIntentMutationVariables
  >(CREATE_ETH_BANK_WITHDRAWAL_INTENT_MUTATION);

  if (!accountData) return null;

  const { ethAccount, bankMapping } = accountData;

  const getWithdrawalIntent = async () => {
    const { data, errors: gqlErrors } = await mutate({
      variables: {
        input: {
          amount: bankWithdrawableAmount,
        },
      },
    });
    if (gqlErrors) {
      throw new Error(gqlErrors.join(', '));
    }

    const { ethBankWithdrawalIntent, errors } =
      data!.createEthBankWithdrawalIntent!;

    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(', '));
    }

    return ethBankWithdrawalIntent!;
  };

  const withdrawEth = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);

    try {
      const { signature, nonce } = await getWithdrawalIntent();

      const result = await withdrawFromBank(
        bankWithdrawableAmount,
        nonce,
        signature
      );

      if (result.err) {
        throw new Error(result.err);
      }

      showNotification('withdrawEthForm');
    } catch (error: any) {
      showNotification(
        'errors',
        { errors: error.message },
        { level: Level.WARN }
      );
    } finally {
      setPending(false);
    }
  };

  if (pending) {
    return <SignTransaction />;
  }

  if (!bankMapping) {
    return null;
  }

  if (bankMapping && ethAccount !== bankMapping) {
    return (
      <Warning
        message={messages.switchWallet}
        values={{ b: Bold, bankMapping }}
      />
    );
  }

  return (
    <div>
      <Form
        onSubmit={event => {
          withdrawEth(event);
        }}
      >
        <MappedAccount>
          <Warning
            message={messages.withdrawal}
            values={{
              amount: (
                <BlueAmountWithConversion
                  monetaryAmount={{
                    referenceCurrency: SupportedCurrency.WEI,
                    [SupportedCurrency.WEI.toLowerCase()]:
                      bankWithdrawableAmount,
                  }}
                />
              ),
              bankMapping,
              b: Bold,
            }}
            variant="blue"
          />
        </MappedAccount>
        <Button color="blue" medium type="submit" disabled={pending}>
          <FormattedMessage {...glossary.submit} />
        </Button>
      </Form>
    </div>
  );
};

export default WithdrawEthForm;
