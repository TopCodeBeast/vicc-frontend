import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import {
  StopAutoBidMutation,
  StopAutoBidMutationVariables,
  useStopAutoBid_bid,
} from './__generated__/useStopAutoBid.graphql';

const STOP_AUTO_BID_MUTATION = gql`
  mutation StopAutoBidMutation($input: stopAutoBidInput!) {
    stopAutoBid(input: $input) {
      tokenBid {
        id
        auction {
          id
          currentPrice
          privateCurrentPrice
          bidsCount
          endDate
          minNextBid
          privateMinNextBid
          currency
          autoBid
          bestBid {
            id
            bidder {
              ... on User {
                slug
              }
            }
          }
          myBestBid {
            id
            maximumAmount
            maximumAmounts {
              referenceCurrency
              eur
              wei
              usd
              gbp
            }
          }
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useStopAutoBid = (bid: useStopAutoBid_bid) => {
  const [stopAutoBid] = useMutation<
    StopAutoBidMutation,
    StopAutoBidMutationVariables
  >(STOP_AUTO_BID_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async () => {
    const { errors } = await stopAutoBid({
      variables: {
        input: {
          bidId: idFromObject(bid.id)!,
        },
      },
    });
    if (errors) {
      showNotification('errors', { errors });
      return errors;
    }
    return null;
  };
};

useStopAutoBid.fragments = {
  bid: gql`
    fragment useStopAutoBid_bid on TokenBid {
      id
    }
  `,
};

export default useStopAutoBid;
