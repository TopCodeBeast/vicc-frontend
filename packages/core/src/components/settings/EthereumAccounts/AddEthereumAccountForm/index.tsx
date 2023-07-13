import { gql } from '@apollo/client';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title3, Title4 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import ConnectPrivateWallet from '@core/components/wallet/ConnectPrivateWallet';
// import { ethereumAccounts } from '@core/contexts/currentUser/queries';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useMutation from '@core/hooks/graphql/useMutation';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';

import {
  AddEthereumAccountMutation,
  AddEthereumAccountMutationVariables,
} from './__generated__/index.graphql';

// const ADD_ETHEREUM_ACCOUNT_MUTATION = gql`
//   mutation AddEthereumAccountMutation($input: linkEthereumAddressInput!) {
//     linkEthereumAddress(input: $input) {
//       currentUser {
//         slug
//         ...CurrentUseProvider_ethereumAccounts
//       }
//       errors {
//         path
//         message
//         code
//       }
//     }
//   }
//   ${ethereumAccounts}
// `;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  form {
    margin-bottom: 0;
  }
`;

const Wallets = styled.div`
  align-self: center;
  width: 100%;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

type Props = {
  onSuccess: () => void;
};

const MESSAGE = 'Link to Sorare account';

export const AddEthereumAccountForm = ({ onSuccess: doOnSuccess }: Props) => {
  const [address, setAddress] = useState<string | null>(null);
  const accountData = useBlockchainAccountData();
  const { showNotification } = useSnackNotificationContext();
  const [mutate] = useMutation<
    AddEthereumAccountMutation,
    AddEthereumAccountMutationVariables
  >(ADD_ETHEREUM_ACCOUNT_MUTATION, { showErrorsInForm: true });

  const handleAddressChanged = (event: ChangeEvent<Element>) => {
    setAddress((event.target as HTMLInputElement).value.toLowerCase());
  };

  const submit = async (
    values: any,
    onResult: (res: GraphQLResult) => void
  ) => {
    if (!address) return;
    if (!accountData?.ethereum.accountManager) return;

    const signature = await accountData.ethereum.web3.eth.personal.sign(
      MESSAGE,
      address,
      ''
    );

    const result = await mutate({
      variables: { input: { address, signature } },
    });
    onResult(result);
  };

  const onSuccess = () => {
    showNotification('ethereumAccountLinked', { address });
    doOnSuccess();
  };

  if (!accountData)
    return (
      <Wrapper>
        <Title4>
          <FormattedMessage
            id="AddEthereumAccountForm.disconnectedTitle"
            defaultMessage="No Ethereum wallet connected"
          />
        </Title4>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="AddEthereumAccountForm.disconnectedDesc"
            defaultMessage="Connect your Ethereum wallet to link an Ethereum address to yout Sorare account"
          />
        </Text16>
        <Wallets>
          <ConnectPrivateWallet />
        </Wallets>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Group>
        <Title3 bold>
          <FormattedMessage
            id="AddEthereumAccountForm.title"
            defaultMessage="Link an Ethereum address"
          />
        </Title3>
        <Text16>
          <FormattedMessage
            id="AddEthereumAccountForm.description"
            defaultMessage="Enter the address you would like to link to your Sorare account"
          />
        </Text16>
      </Group>
      <GraphqlForm
        onSubmit={(values, doOnResult) => {
          submit(values, doOnResult);
        }}
        onError={() => setAddress(null)}
        onSuccess={onSuccess}
        render={(Error, SubmitButton) => (
          <Group>
            <Error code />
            <StyledTextField
              name="address"
              value={address || ''}
              onChange={handleAddressChanged}
              label={
                <Text14 bold>
                  <FormattedMessage
                    id="AddEthereumAccountForm.label"
                    defaultMessage="Ethereum address"
                  />
                </Text14>
              }
            />
            <SubmitButton fullWidth color="blue">
              <FormattedMessage
                id="AddEthereumAccountForm.submit"
                defaultMessage="Link"
              />
            </SubmitButton>
          </Group>
        )}
      />
    </Wrapper>
  );
};
