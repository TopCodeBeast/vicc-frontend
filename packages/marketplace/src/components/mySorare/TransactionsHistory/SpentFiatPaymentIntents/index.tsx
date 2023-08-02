import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import LoadMoreButton from '@sorare/core/src/atoms/buttons/LoadMoreButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import EmptyContent from '@sorare/core/src/contexts/intl/EmptyContent';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Bid } from './Bid';
import { Offer } from './Offer';
import { PrimaryOffer } from './PrimaryOffer';
import {
  SpentFiatPaymentIntentsQuery,
  SpentFiatPaymentIntentsQueryVariables,
} from './__generated__/index.graphql';

const messages = defineMessages({
  empty: {
    id: 'FiatTransactionsHistory.empty',
    defaultMessage: 'No credit card transactions',
  },
});

const SPENT_FIAT_PAYMENT_INTENTS_QUERY = gql`
  query SpentFiatPaymentIntentsQuery($cursor: String) {
    currentUser {
      slug
      spentFiatPaymentIntents(after: $cursor) {
        nodes {
          id
          spentAt
          aasmState
          ...Bid_payment
          ...Offer_payment
          ...PrimaryOffer_payment
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Bid.fragments.payment}
  ${Offer.fragments.payment}
  ${PrimaryOffer.fragments.payment}
` as TypedDocumentNode<
  SpentFiatPaymentIntentsQuery,
  SpentFiatPaymentIntentsQueryVariables
>;

export const SpentFiatPaymentIntents = () => {
  const { data, loading, loadMore } = usePaginatedQuery(
    SPENT_FIAT_PAYMENT_INTENTS_QUERY,
    {
      connection: 'PaymentConnection',
      nextFetchPolicy: 'cache-first',
    }
  );

  const {
    items: payments = [],
    hasMore,
    cursor,
  } = extractConnectionData(
    data?.currentUser?.spentFiatPaymentIntents,
    src => src
  );

  if (!data && !loading) return <EmptyContent message={messages.empty} />;

  return (
    <div>
      {!data && loading ? (
        <LoadingIndicator />
      ) : (
        payments.map(payment => (
          <Fragment key={payment.id}>
            <Bid payment={payment} />
            <Offer payment={payment} />
            <PrimaryOffer payment={payment} />
          </Fragment>
        ))
      )}
      <LoadMoreButton
        hasMore={hasMore}
        loadMore={() => {
          loadMore(false, {
            cursor,
          });
        }}
        loading={loading}
      />
    </div>
  );
};
