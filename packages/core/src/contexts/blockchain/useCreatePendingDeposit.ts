import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';

// import {
//   CreatePendingDepositMutation,
//   CreatePendingDepositMutationVariables,
// } from './__generated__/useCreatePendingDeposit.graphql';

// const CREATE_PENDING_DEPOSIT_MUTATION = gql`
//   mutation CreatePendingDepositMutation($input: createEthDepositInput!) {
//     createEthDeposit(input: $input) {
//       currentUser {
//         slug
//         pendingDeposits {
//           id
//           date
//           amount
//           providerType
//           transactionHash
//           amountInFiat {
//             eur
//             gbp
//             usd
//           }
//         }
//       }
//     }
//   }
// `;

const useCreatePendingDeposit = () => {
  // const [mutate] = useMutation<
  //   CreatePendingDepositMutation,
  //   CreatePendingDepositMutationVariables
  // >(CREATE_PENDING_DEPOSIT_MUTATION, {
  //   showErrorsWithSnackNotification: false,
  // });

  return useCallback(
    async (transactionHash: string, amount: string) => {
      // const { data } = await mutate({
      //   variables: { input: { transactionHash, amount } },
      // });
      // return data?.createEthDeposit?.currentUser?.pendingDeposits;
      return 0;
    },
    [/*mutate*/]
  );
};

export default useCreatePendingDeposit;
